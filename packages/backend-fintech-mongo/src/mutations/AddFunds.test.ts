import { main } from "../app.ts";
import supertest from "supertest";
import { Db, MongoClient, ObjectId } from "mongodb";
import { type Consumer, Kafka, type Producer } from "kafkajs";
import { StartedRedisContainer, RedisContainer } from "@testcontainers/redis";
import { KafkaContainer, StartedKafkaContainer } from "@testcontainers/kafka";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { Redis, type RedisOptions } from "ioredis";
import TestAgent from "supertest/lib/agent.js";
import { serialize } from "cookie";
import { credentials, Server, ServerCredentials } from "@grpc/grpc-js";
import { createClient } from "redis";
import { KAFKA_ID } from "@repo/utils";
import { AuthService } from "@repo/grpc-utils/protoAuth/auth_grpc_pb";
import { getValidTokens } from "@repo/jwt-utils";
import type { RedisClientType } from "@repo/redis-utils";
import { AuthServer, AuthClient } from "@repo/grpc-utils";
import { runKafkaConsumer } from "@repo/kafka-utils";
import { getFintechCollections } from "@repo/mongo-utils";

// Test indempotency?

const delay = () =>
  new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 300);
  });

describe("AddFunds tests", () => {
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
      "0.0.0.0:1983",
      ServerCredentials.createInsecure(),
      (err) => {
        if (err) {
          return;
        }
      }
    );
    grpcClient = new AuthClient(`0.0.0.0:1983`, credentials.createInsecure());
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
    await consumer.disconnect();
    await producer.disconnect();
    await startedKafkaContainer.stop();
    await mongoClient.close();
    await delay();
  }, 10000);

  it("test AddFunds increase valid access token", async () => {
    const { users } = getFintechCollections(dbInstanceFintech);
    const user_oid = new ObjectId();
    const id = crypto.randomUUID();
    await users.insertOne({
      _id: user_oid,
      id,
      account_available: 100000,
      account_to_be_paid: 0,
      account_total: 100000,
      account_withheld: 0,
    });
    const { refreshToken, accessToken } = getValidTokens({
      isBorrower: false,
      isLender: true,
      isSupport: false,
      id,
    });
    const requestCookies = serialize("refreshToken", refreshToken);
    const response = await request
      .post("/graphql")
      .trustLocalhost()
      .send({
        extensions: {
          doc_id: "ccd989a67362a42de18960129992958e",
        },
        query: "",
        variables: {
          input: {
            quantity: "500.00",
          },
        },
        operationName: "addFundsMutation",
      })
      .set("Accept", "text/event-stream")
      .set("Authorization", accessToken)
      .set("Cookie", requestCookies);
    const stream = response.text.split("\n");
    const data = JSON.parse(stream[1].replace("data: ", ""));
    expect(data.data.addFunds.error).toBeFalsy();
    await delay();
    const user = await users.findOne({ id });
    if (!user) {
      throw new Error("User not found.");
    }
    expect(user).toEqual({
      _id: user_oid,
      account_available: 150000,
      account_to_be_paid: 0,
      account_total: 150000,
      account_withheld: 0,
      id,
    });
  }, 10000);

  it("test AddFunds decrease valid access token", async () => {
    const { users } = getFintechCollections(dbInstanceFintech);
    const user_oid = new ObjectId();
    const id = crypto.randomUUID();
    await users.insertOne({
      _id: user_oid,
      id,
      account_available: 100000,
      account_to_be_paid: 0,
      account_total: 100000,
      account_withheld: 0,
    });
    const { refreshToken, accessToken } = getValidTokens({
      isBorrower: false,
      isLender: true,
      isSupport: false,
      id,
    });
    const requestCookies = serialize("refreshToken", refreshToken);
    const response = await request
      .post("/graphql")
      .trustLocalhost()
      .send({
        extensions: {
          doc_id: "ccd989a67362a42de18960129992958e",
        },
        query: "",
        variables: {
          input: {
            quantity: "-500.00",
          },
        },
        operationName: "addFundsMutation",
      })
      .set("Accept", "text/event-stream")
      .set("Authorization", accessToken)
      .set("Cookie", requestCookies);
    const stream = response.text.split("\n");
    const data = JSON.parse(stream[1].replace("data: ", ""));
    expect(data.data.addFunds.error).toBeFalsy();
    await delay();
    const user = await users.findOne({ id });
    if (!user) {
      throw new Error("User not found.");
    }
    expect(user).toEqual({
      _id: user_oid,
      account_available: 50000,
      account_to_be_paid: 0,
      account_total: 50000,
      account_withheld: 0,
      id,
    });
  }, 10000);

  it("test AddFunds increase invalid access token and valid refresh token", async () => {
    const { users } = getFintechCollections(dbInstanceFintech);
    const user_oid = new ObjectId();
    const id = crypto.randomUUID();
    await users.insertOne({
      _id: user_oid,
      id,
      account_available: 100000,
      account_to_be_paid: 0,
      account_total: 100000,
      account_withheld: 0,
    });
    const { refreshToken, accessToken } = getValidTokens({
      isBorrower: false,
      isLender: true,
      isSupport: false,
      id,
      invalidAccessToken: true,
    });
    const requestCookies = serialize("refreshToken", refreshToken);
    const response = await request
      .post("/graphql")
      .trustLocalhost()
      .send({
        extensions: {
          doc_id: "ccd989a67362a42de18960129992958e",
        },
        query: "",
        variables: {
          input: {
            quantity: "500.00",
          },
        },
        operationName: "addFundsMutation",
      })
      .set("Accept", "text/event-stream")
      .set("Authorization", accessToken)
      .set("Cookie", requestCookies);
    const stream = response.text.split("\n");
    const data = JSON.parse(stream[1].replace("data: ", ""));
    expect(data.data.addFunds.error).toBeFalsy();
    expect(response.headers["accesstoken"]).toBeTruthy();
    expect(response.headers["accesstoken"]).not.toBe(accessToken);
    await delay();
    const user = await users.findOne({ id });
    if (!user) {
      throw new Error("User not found.");
    }
    expect(user).toEqual({
      _id: user_oid,
      account_available: 150000,
      account_to_be_paid: 0,
      account_total: 150000,
      account_withheld: 0,
      id,
    });
  }, 10000);

  it("test AddFunds try decrease more than available valid refresh token", async () => {
    const { users } = getFintechCollections(dbInstanceFintech);
    const user_oid = new ObjectId();
    const id = crypto.randomUUID();
    await users.insertOne({
      _id: user_oid,
      id,
      account_available: 100000,
      account_to_be_paid: 0,
      account_total: 100000,
      account_withheld: 0,
    });
    const { refreshToken, accessToken } = getValidTokens({
      isBorrower: false,
      isLender: true,
      isSupport: false,
      id,
    });
    const requestCookies = serialize("refreshToken", refreshToken);
    const response = await request
      .post("/graphql")
      .trustLocalhost()
      .send({
        extensions: {
          doc_id: "ccd989a67362a42de18960129992958e",
        },
        query: "",
        variables: {
          input: {
            quantity: "-1500.00",
          },
        },
        operationName: "addFundsMutation",
      })
      .set("Accept", "text/event-stream")
      .set("Authorization", accessToken)
      .set("Cookie", requestCookies);
    const stream = response.text.split("\n");
    const data = JSON.parse(stream[1].replace("data: ", ""));
    expect(data.data.addFunds.error).toBe("");
    await delay();
    const user = await users.findOne({ id });
    if (!user) {
      throw new Error("User not found.");
    }
    expect(user).toEqual({
      _id: user_oid,
      account_available: 100000,
      account_to_be_paid: 0,
      account_total: 100000,
      account_withheld: 0,
      id,
    });
  }, 10000);

  it("test AddFunds try increase cero valid refresh token", async () => {
    const user_oid = new ObjectId();
    const id = crypto.randomUUID();
    const { users } = getFintechCollections(dbInstanceFintech);
    await users.insertOne({
      _id: user_oid,
      id,
      account_available: 100000,
      account_to_be_paid: 0,
      account_total: 100000,
      account_withheld: 0,
    });
    const { refreshToken, accessToken } = getValidTokens({
      isBorrower: false,
      isLender: true,
      isSupport: false,
      id,
    });
    const requestCookies = serialize("refreshToken", refreshToken);
    const response = await request
      .post("/graphql")
      .trustLocalhost()
      .send({
        extensions: {
          doc_id: "ccd989a67362a42de18960129992958e",
        },
        query: "",
        variables: {
          input: {
            quantity: "0.00",
          },
        },
        operationName: "addFundsMutation",
      })
      .set("Accept", "text/event-stream")
      .set("Authorization", accessToken)
      .set("Cookie", requestCookies);
    const stream = response.text.split("\n");
    const data = JSON.parse(stream[1].replace("data: ", ""));
    expect(data.data.addFunds.error).toBe("La cantidad no puede ser cero.");
    await delay();
    const user = await users.findOne({ id });
    if (!user) {
      throw new Error("User not found.");
    }
    expect(user).toEqual({
      _id: user_oid,
      account_available: 100000,
      account_to_be_paid: 0,
      account_total: 100000,
      account_withheld: 0,
      id,
    });
  }, 20000);
});
