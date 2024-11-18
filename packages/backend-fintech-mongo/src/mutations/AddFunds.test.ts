import { Server, ServerCredentials, credentials } from "@grpc/grpc-js";
import { AuthClient, AuthServer } from "@repo/grpc-utils";
import { AuthService } from "@repo/grpc-utils/protoAuth/auth_grpc_pb";
import { getValidTokens } from "@repo/jwt-utils";
import { runKafkaConsumer } from "@repo/kafka-utils";
import { getFintechCollections } from "@repo/mongo-utils";
import { KAFKA_ID } from "@repo/utils";
import { KafkaContainer } from "@testcontainers/kafka";
import { RedisContainer } from "@testcontainers/redis";
import { MongoDBContainer } from "@testcontainers/mongodb";
import { serialize } from "cookie";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { Redis, type RedisOptions } from "ioredis";
import { Kafka } from "kafkajs";
import { MongoClient, ObjectId } from "mongodb";
import { createClient } from "redis";
import supertest from "supertest";
import { main } from "../app.ts";
import { after, describe, it } from "node:test";
import { deepStrictEqual, notStrictEqual, ok, strictEqual } from "node:assert";

const delay = () =>
  new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 300);
  });

describe("AddFunds tests", async () => {
  const startedRedisContainer = await new RedisContainer().start();
  const startedMongoContainer = await new MongoDBContainer().start();
  const startedKafkaContainer = await new KafkaContainer().withExposedPorts(9093).start();
  const redisClient = createClient({
    url: startedRedisContainer.getConnectionUrl(),
  });
  const mongoClient = await MongoClient.connect(startedMongoContainer.getConnectionString(), { directConnection: true });
  const dbInstanceAuth = mongoClient.db("auth");
  const dbInstanceFintech = mongoClient.db("fintech");
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
  grpcServer.bindAsync("0.0.0.0:1983", ServerCredentials.createInsecure(), (err) => {
    if (err) {
      return;
    }
  });
  const grpcClient = new AuthClient("0.0.0.0:1983", credentials.createInsecure());
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
      await consumer.disconnect();
      await producer.disconnect();
      await startedKafkaContainer.stop();
      await mongoClient.close();
      await pubsub.close();
    },
    { timeout: 10_000 },
  );

  it("test AddFunds increase valid access token", { timeout: 10_000 }, async () => {
    const { users } = getFintechCollections(dbInstanceFintech);
    const user_oid = new ObjectId();
    const id = crypto.randomUUID();
    await users.insertOne({
      _id: user_oid,
      id,
      account_available: 1_000_00,
      account_to_be_paid: 0,
      account_total: 1_000_00,
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
    strictEqual(data.data.addFunds.error, "");
    await delay();
    const user = await users.findOne({ id });
    if (!user) {
      throw new Error("User not found.");
    }
    deepStrictEqual(user, {
      _id: user_oid,
      account_available: 1_500_00,
      account_to_be_paid: 0,
      account_total: 1_500_00,
      account_withheld: 0,
      id,
    });
  });

  it("test AddFunds decrease valid access token", { timeout: 10_000 }, async () => {
    const { users } = getFintechCollections(dbInstanceFintech);
    const user_oid = new ObjectId();
    const id = crypto.randomUUID();
    await users.insertOne({
      _id: user_oid,
      id,
      account_available: 1_000_00,
      account_to_be_paid: 0,
      account_total: 1_000_00,
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
    strictEqual(data.data.addFunds.error, "");
    await delay();
    const user = await users.findOne({ id });
    if (!user) {
      throw new Error("User not found.");
    }
    deepStrictEqual(user, {
      _id: user_oid,
      account_available: 500_00,
      account_to_be_paid: 0,
      account_total: 500_00,
      account_withheld: 0,
      id,
    });
  });

  it("test AddFunds increase invalid access token and valid refresh token", { timeout: 10_000 }, async () => {
    const { users } = getFintechCollections(dbInstanceFintech);
    const user_oid = new ObjectId();
    const id = crypto.randomUUID();
    await users.insertOne({
      _id: user_oid,
      id,
      account_available: 1_000_00,
      account_to_be_paid: 0,
      account_total: 1_000_00,
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
    strictEqual(data.data.addFunds.error, "");
    ok(response.headers.accesstoken);
    notStrictEqual(response.headers.accesstoken, accessToken);
    await delay();
    const user = await users.findOne({ id });
    if (!user) {
      throw new Error("User not found.");
    }
    deepStrictEqual(user, {
      _id: user_oid,
      account_available: 1_500_00,
      account_to_be_paid: 0,
      account_total: 1_500_00,
      account_withheld: 0,
      id,
    });
  });

  it("test AddFunds try decrease more than available valid refresh token", { timeout: 10_000 }, async () => {
    const { users } = getFintechCollections(dbInstanceFintech);
    const user_oid = new ObjectId();
    const id = crypto.randomUUID();
    await users.insertOne({
      _id: user_oid,
      id,
      account_available: 1_000_00,
      account_to_be_paid: 0,
      account_total: 1_000_00,
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
    strictEqual(data.data.addFunds.error, "");
    await delay();
    const user = await users.findOne({ id });
    if (!user) {
      throw new Error("User not found.");
    }
    deepStrictEqual(user, {
      _id: user_oid,
      account_available: 1_000_00,
      account_to_be_paid: 0,
      account_total: 1_000_00,
      account_withheld: 0,
      id,
    });
  });

  it("test AddFunds try increase cero valid refresh token", { timeout: 10_000 }, async () => {
    const user_oid = new ObjectId();
    const id = crypto.randomUUID();
    const { users } = getFintechCollections(dbInstanceFintech);
    await users.insertOne({
      _id: user_oid,
      id,
      account_available: 1_000_00,
      account_to_be_paid: 0,
      account_total: 1_000_00,
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
    strictEqual(data.data.addFunds.error, "La cantidad no puede ser cero.");
    await delay();
    const user = await users.findOne({ id });
    if (!user) {
      throw new Error("User not found.");
    }
    deepStrictEqual(user, {
      _id: user_oid,
      account_available: 1_000_00,
      account_to_be_paid: 0,
      account_total: 1_000_00,
      account_withheld: 0,
      id,
    });
  });
});
