import { main } from "../app";
import supertest from "supertest";
import { Db, MongoClient, ObjectId } from "mongodb";
import { Consumer, Kafka, Producer } from "kafkajs";
import { StartedRedisContainer, RedisContainer } from "@testcontainers/redis";
import { KafkaContainer, StartedKafkaContainer } from "@testcontainers/kafka";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { Redis, RedisOptions } from "ioredis";
import TestAgent from "supertest/lib/agent";
import { serialize } from "cookie";
import { credentials, Server, ServerCredentials } from "@grpc/grpc-js";
import { createClient } from "redis";
import { KAFKA_ID } from "@repo/utils/config";
import { AuthService } from "@repo/grpc-utils/protoAuth/auth_grpc_pb";
import { base64Name, delay } from "@repo/utils/index";
import { getValidTokens, jwt } from "@repo/jwt-utils/index";
import { RedisClientType } from "@repo/redis-utils/types";
import { AuthServer } from "@repo/grpc-utils/index";
import { AuthClient } from "@repo/grpc-utils/protoAuth/auth_grpc_pb";
import { runKafkaConsumer } from "@repo/kafka-utils/kafka";
import { getFintechCollections } from "@repo/mongo-utils/index";
import { addMonths } from "date-fns";

describe("AddLends one lend and loan no completed goal", () => {
  let mongoClient: MongoClient;
  let dbInstanceFintech: Db;
  let dbInstanceAuth: Db;
  let producer: Producer;
  let startedRedisContainer: StartedRedisContainer;
  let grpcClient: AuthClient;
  let pubsub: RedisPubSub;
  let request: TestAgent<supertest.Test>;
  let startedKafkaContainer: StartedKafkaContainer;
  let grpcServer: Server;
  let redisClient: RedisClientType;
  let ioredisPublisherClient: Redis;
  let ioredisSubscriberClient: Redis;
  let consumer: Consumer;

  beforeAll(async () => {
    mongoClient = await MongoClient.connect(
      (global as unknown as { __MONGO_URI__: string }).__MONGO_URI__,
      {}
    );
    dbInstanceFintech = mongoClient.db(
      (global as unknown as { __MONGO_DB_NAME__: string }).__MONGO_DB_NAME__
    );
    dbInstanceAuth = mongoClient.db(
      (global as unknown as { __MONGO_DB_NAME__: string }).__MONGO_DB_NAME__ +
        "-auth"
    );
    startedKafkaContainer = await new KafkaContainer()
      .withExposedPorts(9093)
      .start();
    const name = startedKafkaContainer.getHost();
    const port = startedKafkaContainer.getMappedPort(9093);
    const kafka = new Kafka({
      clientId: KAFKA_ID,
      brokers: [`${name}:${port}`],
    });
    const admin = kafka.admin();
    await admin.connect();
    await admin.createTopics({
      validateOnly: false,
      topics: [
        {
          topic: "add-lends",
        },
        {
          topic: "user-transaction",
        },
        {
          topic: "loan-transaction",
        },
      ],
    });
    await admin.disconnect();
    producer = kafka.producer();
    await producer.connect();
    startedRedisContainer = await new RedisContainer().start();
    redisClient = createClient({
      url: startedRedisContainer.getConnectionUrl(),
    });
    await redisClient.connect();
    const options: RedisOptions = {
      host: startedRedisContainer.getConnectionUrl(),
      port: 6379,
      retryStrategy: () => 10000,
    };
    ioredisPublisherClient = new Redis(options);
    ioredisSubscriberClient = new Redis(options);
    pubsub = new RedisPubSub({
      publisher: ioredisPublisherClient,
      subscriber: ioredisSubscriberClient,
    });
    grpcServer = new Server();
    grpcServer.addService(AuthService, AuthServer(dbInstanceAuth, redisClient));
    grpcServer.bindAsync(
      "0.0.0.0:1984",
      ServerCredentials.createInsecure(),
      (err) => {
        if (err) {
          return;
        }
      }
    );
    grpcClient = new AuthClient(`0.0.0.0:1984`, credentials.createInsecure());
    const server = await main(dbInstanceFintech, producer, grpcClient, pubsub);
    request = supertest(server, { http2: true });
    consumer = kafka.consumer({ groupId: "test-group" });
    await runKafkaConsumer(consumer, producer, dbInstanceFintech, pubsub);
  }, 20000);

  afterAll(async () => {
    grpcClient.close();
    grpcServer.forceShutdown();
    await redisClient.disconnect();
    await startedRedisContainer.stop();
    await producer.disconnect();
    await consumer.disconnect();
    await startedKafkaContainer.stop();
    await mongoClient.close();
  }, 10000);

  it("test AddLends valid access token", async () => {
    const { users, loans, records, investments } =
      getFintechCollections(dbInstanceFintech);
    const user1_oid = new ObjectId();
    const user2_oid = new ObjectId();
    const user1_id = crypto.randomUUID();
    const user2_id = crypto.randomUUID();
    const loan1_oid = new ObjectId();
    await users.insertOne({
      _id: user1_oid,
      id: user1_id,
      account_available: 10000,
      account_to_be_paid: 0,
      account_total: 10000,
      account_withheld: 0,
    });
    await users.insertOne({
      _id: user2_oid,
      id: user2_id,
      account_available: 10000,
      account_to_be_paid: 0,
      account_total: 10000,
      account_withheld: 0,
    });
    await investments.insertOne({
      borrower_id: user2_id,
      lender_id: user1_id,
      loan_oid: loan1_oid,
      quantity: 10000,
      created_at: new Date(),
      updated_at: new Date(),
      status: "financing",
      status_type: "on_going",
      roi: 17,
      term: 5,
      payments: 0,
      moratory: 0,
      amortize: 0,
      interest_to_earn: 0,
      to_be_paid: 0,
      paid_already: 0,
    });
    const expiry = addMonths(new Date(), 3);
    await loans.insertOne({
      _id: loan1_oid,
      user_id: user2_id,
      score: "AAA",
      raised: 4990000,
      expiry,
      roi: 17,
      goal: 5000000,
      term: 5,
      status: "financing",
      pending: 10000,
      payments_delayed: 0,
      payments_done: 0,
    });
    const { refreshToken, accessToken } = getValidTokens({
      isBorrower: false,
      isLender: true,
      isSupport: false,
      id: user1_id,
    });
    const requestCookies = serialize("refreshToken", refreshToken);
    const response = await request
      .post("/graphql")
      .trustLocalhost()
      .send({
        extensions: {
          doc_id: "64b571ffb2b4d4c3b1ab5d40cf54f5b1",
        },
        query: "",
        variables: {
          input: {
            lends: [
              {
                loan_gid: base64Name(loan1_oid.toHexString(), "Loan"),
                quantity: "100.00",
              },
            ],
          },
        },
        operationName: "addLendsMutation",
      })
      .set("Accept", "text/event-stream")
      .set("Authorization", accessToken)
      .set("Cookie", requestCookies);
    const stream = response.text.split("\n");
    const data = JSON.parse(stream[1].replace("data: ", ""));
    expect(data.data.addLends.error).toBeFalsy();
    await delay(1000);
    const recordsResult = await records.find().toArray();
    expect(recordsResult.length).toBe(7);
    expect(
      recordsResult.map(({ _id, ...record }) => ({
        ...record,
        _id: ObjectId.isValid(_id),
      }))
    ).toEqual([
      {
        _id: true,
        status: "applied",
      },
      {
        _id: true,
        status: "applied",
      },
      {
        _id: true,
        status: "applied",
      },
      {
        _id: true,
        status: "applied",
      },
      {
        _id: true,
        status: "applied",
      },
      {
        _id: true,
        status: "applied",
      },
      {
        _id: true,
        status: "applied",
      },
    ]);
    const user1 = await users.findOne({ id: user1_id });
    expect(user1).toEqual({
      _id: user1_oid,
      id: user1_id,
      account_available: 0,
      account_to_be_paid: 10795,
      account_total: 10795,
      account_withheld: 0,
    });
    const user2 = await users.findOne({ id: user2_id });
    expect(user2).toEqual({
      _id: user2_oid,
      id: user2_id,
      account_available: 5010000,
      account_to_be_paid: 0,
      account_total: 5010000,
      account_withheld: 0,
    });
    const loan1 = await loans.findOne({ _id: loan1_oid });
    expect(loan1).toEqual({
      _id: loan1_oid,
      user_id: user2_id,
      score: "AAA",
      raised: 5000000,
      expiry,
      roi: 17,
      goal: 5000000,
      term: 5,
      status: "to be paid",
      pending: 0,
      payments_delayed: 0,
      payments_done: 0,
    });
    const investmentsResult = await investments.find().toArray();
    expect(investmentsResult.length).toBe(1);
    expect(
      investmentsResult.map(
        ({ _id, created_at, updated_at, ...investment }) => ({
          ...investment,
          _id: ObjectId.isValid(_id),
          created_at: created_at instanceof Date,
          updated_at: updated_at instanceof Date,
        })
      )
    ).toEqual([
      {
        _id: true,
        created_at: true,
        updated_at: true,
        borrower_id: user2_id,
        lender_id: user1_id,
        loan_oid: loan1_oid,
        quantity: 10000,
        status: "up to date",
        status_type: "on_going",
        roi: 17,
        term: 5,
        payments: 0,
        moratory: 0,
        amortize: 4159,
        interest_to_earn: 795,
        paid_already: 0,
        to_be_paid: 20795,
      },
    ]);
  });
});
