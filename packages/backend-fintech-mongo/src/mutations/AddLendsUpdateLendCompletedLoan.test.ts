import { Server, ServerCredentials, credentials } from "@grpc/grpc-js";
import { AuthClient, AuthServer } from "@repo/grpc-utils";
import { AuthService } from "@repo/grpc-utils/protoAuth/auth_grpc_pb";
import { getValidTokens } from "@repo/jwt-utils";
import { runKafkaConsumer } from "@repo/kafka-utils";
import { getFintechCollections } from "@repo/mongo-utils";
import { KAFKA_ID } from "@repo/utils";
import { base64Name, delay } from "@repo/utils";
import { KafkaContainer } from "@testcontainers/kafka";
import { RedisContainer } from "@testcontainers/redis";
import { serialize } from "cookie";
import { addMonths } from "date-fns";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { Redis, type RedisOptions } from "ioredis";
import { Kafka } from "kafkajs";
import { MongoClient, ObjectId } from "mongodb";
import { createClient } from "redis";
import supertest from "supertest";
import { main } from "../app.ts";
import { MongoDBContainer } from "@testcontainers/mongodb";
import { after, it, describe } from "node:test";
import { deepStrictEqual, strictEqual } from "node:assert";

describe("AddLends one lend and loan no completed goal", async () => {
  const startedMongoContainer = await new MongoDBContainer().start();
  const startedKafkaContainer = await new KafkaContainer().withExposedPorts(9093).start();
  const mongoClient = await MongoClient.connect(startedMongoContainer.getConnectionString(), { directConnection: true });
  const dbInstanceFintech = mongoClient.db("fintech");
  const dbInstanceAuth = mongoClient.db("auth");
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
  const producer = kafka.producer();
  await producer.connect();
  const startedRedisContainer = await new RedisContainer().start();
  const redisClient = createClient({
    url: startedRedisContainer.getConnectionUrl(),
  });
  await redisClient.connect();
  const options: RedisOptions = {
    host: startedRedisContainer.getHost(),
    port: startedRedisContainer.getMappedPort(6379),
    retryStrategy: () => 10_000,
  };
  const ioredisPublisherClient = new Redis(options);
  const ioredisSubscriberClient = new Redis(options);
  const pubsub = new RedisPubSub({
    publisher: ioredisPublisherClient,
    subscriber: ioredisSubscriberClient,
  });
  const grpcServer = new Server();
  grpcServer.addService(AuthService, AuthServer(dbInstanceAuth, redisClient));
  grpcServer.bindAsync("0.0.0.0:1986", ServerCredentials.createInsecure(), (err) => {
    if (err) {
      return;
    }
  });
  const grpcClient = new AuthClient("0.0.0.0:1986", credentials.createInsecure());
  const server = await main(dbInstanceFintech, producer, grpcClient, pubsub);
  const request = supertest(server, { http2: true });
  const consumer = kafka.consumer({ groupId: "test-group" });
  await runKafkaConsumer(consumer, producer, dbInstanceFintech, pubsub);

  after(
    async () => {
      grpcClient.close();
      grpcServer.forceShutdown();
      await redisClient.disconnect();
      await startedRedisContainer.stop();
      await producer.disconnect();
      await consumer.disconnect();
      await startedKafkaContainer.stop();
      await mongoClient.close();
      await pubsub.close();
    },
    { timeout: 10_000 },
  );

  it("test AddLends valid access token", async () => {
    const { users, loans, records, investments } = getFintechCollections(dbInstanceFintech);
    const user1_oid = new ObjectId();
    const user2_oid = new ObjectId();
    const user1_id = crypto.randomUUID();
    const user2_id = crypto.randomUUID();
    const loan1_oid = new ObjectId();
    await users.insertOne({
      _id: user1_oid,
      id: user1_id,
      account_available: 100_00,
      account_to_be_paid: 0,
      account_total: 100_00,
      account_withheld: 0,
    });
    await users.insertOne({
      _id: user2_oid,
      id: user2_id,
      account_available: 100_00,
      account_to_be_paid: 0,
      account_total: 100_00,
      account_withheld: 0,
    });
    await investments.insertOne({
      borrower_id: user2_id,
      lender_id: user1_id,
      loan_oid: loan1_oid,
      quantity: 100_00,
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
      raised: 49_900_00,
      expiry,
      roi: 17,
      goal: 50_000_00,
      term: 5,
      status: "financing",
      pending: 100_00,
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
    strictEqual(data.data.addLends.error, "");
    await delay(1_000);
    const recordsResult = await records.find().toArray();
    strictEqual(recordsResult.length, 7);
    deepStrictEqual(
      recordsResult.map(({ _id, ...record }) => ({
        ...record,
        _id: ObjectId.isValid(_id),
      })),
      [
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
      ],
    );
    const user1 = await users.findOne({ id: user1_id });
    deepStrictEqual(user1, {
      _id: user1_oid,
      id: user1_id,
      account_available: 0,
      account_to_be_paid: 10795,
      account_total: 10795,
      account_withheld: 0,
    });
    const user2 = await users.findOne({ id: user2_id });
    deepStrictEqual(user2, {
      _id: user2_oid,
      id: user2_id,
      account_available: 50_100_00,
      account_to_be_paid: 0,
      account_total: 50_100_00,
      account_withheld: 0,
    });
    const loan1 = await loans.findOne({ _id: loan1_oid });
    deepStrictEqual(loan1, {
      _id: loan1_oid,
      user_id: user2_id,
      score: "AAA",
      raised: 50_000_00,
      expiry,
      roi: 17,
      goal: 50_000_00,
      term: 5,
      status: "to be paid",
      pending: 0,
      payments_delayed: 0,
      payments_done: 0,
    });
    const investmentsResult = await investments.find().toArray();
    strictEqual(investmentsResult.length, 1);
    deepStrictEqual(
      investmentsResult.map(({ _id, created_at, updated_at, ...investment }) => ({
        ...investment,
        _id: ObjectId.isValid(_id),
        created_at: created_at instanceof Date,
        updated_at: updated_at instanceof Date,
      })),
      [
        {
          _id: true,
          created_at: true,
          updated_at: true,
          borrower_id: user2_id,
          lender_id: user1_id,
          loan_oid: loan1_oid,
          quantity: 100_00,
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
      ],
    );
  });
});
