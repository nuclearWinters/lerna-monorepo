import { main } from "../app";
import supertest from "supertest";
import { Db, MongoClient, ObjectId } from "mongodb";
import { TransactionMongo, UserMongo } from "../types";
import { base64Name, jwt } from "../utils";
import { Admin, Kafka, Producer } from "kafkajs";
import { AuthClient } from "@lerna-monorepo/grpc-auth-node";
import { StartedRedisContainer, RedisContainer } from "@testcontainers/redis"
import { KafkaContainer, StartedKafkaContainer } from "@testcontainers/kafka"
import { RedisPubSub } from "graphql-redis-subscriptions";
import { Redis, RedisOptions } from "ioredis";
import TestAgent from "supertest/lib/agent";
import { REFRESH_TOKEN_EXP_NUMBER } from "@lerna-monorepo/grpc-auth-node/src/utils";
import { ACCESS_TOKEN_EXP_NUMBER } from "backend-auth/src/utils";
import { serialize } from "cookie";
import { AuthService, AuthServer } from "@lerna-monorepo/grpc-auth-node";
import { credentials, Server, ServerCredentials } from "@grpc/grpc-js";
import { RedisClientType } from "@lerna-monorepo/grpc-auth-node/src/types";
import { createClient } from "redis";
import { ACCESSSECRET, REFRESHSECRET } from "@lerna-monorepo/grpc-auth-node/src/config";

describe("AddLends tests", () => {
  let mongoClient: MongoClient;
  let dbInstanceFintech: Db;
  let dbInstanceAuth: Db;
  let producer: Producer;
  let startedRedisContainer: StartedRedisContainer;
  let grpcClient: AuthClient
  let pubsub: RedisPubSub
  let request: TestAgent<supertest.Test>
  let startedKafkaContainer: StartedKafkaContainer
  let grpcServer: Server
  let redisClient: RedisClientType
  let ioredisPublisherClient: Redis
  let ioredisSubscriberClient: Redis
  let admin: Admin

  beforeAll(async () => {
    mongoClient = await MongoClient.connect(
      (global as unknown as { __MONGO_URI__: string }).__MONGO_URI__,
      {}
    );
    dbInstanceFintech = mongoClient.db(
      (global as unknown as { __MONGO_DB_NAME__: string }).__MONGO_DB_NAME__
    );
    dbInstanceAuth = mongoClient.db(
      (global as unknown as { __MONGO_DB_NAME__: string }).__MONGO_DB_NAME__ + "-auth"
    );
    startedKafkaContainer = await new KafkaContainer()
      .withExposedPorts(9093)
      .start();
    const name = startedKafkaContainer.getHost();
    const port = startedKafkaContainer.getMappedPort(9093);
    const kafka = new Kafka({
      clientId: "my-app",
      brokers: [`${name}:${port}`],
    });
    admin = kafka.admin();
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
      retryStrategy: (times) => {
        return Math.min(times * 50, 2000);
      },
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
      "localhost:1984",
      ServerCredentials.createInsecure(),
      (err) => {
        if (err) {
          return;
        }
      }
    );
    grpcClient = new AuthClient(
      `localhost:1984`,
      credentials.createInsecure()
    );
    const server = await main(dbInstanceFintech, producer, grpcClient, pubsub);
    request = supertest(server, { http2: true });
  });

  afterAll(async () => {
    grpcClient.close()
    grpcServer.forceShutdown()
    await pubsub.close();
    ioredisPublisherClient.quit()
    ioredisSubscriberClient.quit()
    await producer.disconnect()
    await admin.disconnect();
    await redisClient.disconnect()
    await startedKafkaContainer.stop()
    await startedRedisContainer.stop();
    await mongoClient.close();
    await (() => new Promise(resolve => setTimeout(resolve, 1000)))();
  });

  it("test AddLends valid access token", async () => {
    const id = crypto.randomUUID();
    const now = new Date();
    now.setMilliseconds(0);
    const refreshTokenExpireTime = now.getTime() / 1000 + REFRESH_TOKEN_EXP_NUMBER;
    const accessTokenExpireTime = now.getTime() / 1000 + ACCESS_TOKEN_EXP_NUMBER;
    const refreshToken = jwt.sign(
      {
        id,
        isBorrower: false,
        isLender: true,
        isSupport: false,
        refreshTokenExpireTime,
        exp: refreshTokenExpireTime,
      },
      REFRESHSECRET,
    );
    const accessToken = jwt.sign(
      {
        id,
        isBorrower: false,
        isLender: true,
        isSupport: false,
        refreshTokenExpireTime,
        exp: accessTokenExpireTime,
      },
      ACCESSSECRET,
    );
    const requestCookies = serialize("refreshToken", refreshToken);
    const response = await request
      .post("/graphql")
      .send({
        extensions: {
          doc_id: "64b571ffb2b4d4c3b1ab5d40cf54f5b1"
        },
        query: "",
        variables: {
          input: {
            lends: [
              {
                loan_gid: base64Name("000000000000000000000002", "Loan"),
                quantity: "100.00",
                borrower_id: "wHHR1SUBT0dspoF4YUO32",
              },
              {
                loan_gid: base64Name("000000000000000000000003", "Loan"),
                quantity: "50.00",
                borrower_id: "wHHR1SUBT0dspoF4YUO32",
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
    const data = JSON.parse(stream[3].replace("data: ", ""));
    expect(data.data.addLends.error).toBeFalsy();
    const response2 = await request
      .post("/graphql")
      .send({
        extensions: {
          doc_id: "64b571ffb2b4d4c3b1ab5d40cf54f5b1"
        },
        query: "",
        variables: {
          input: {
            lends: [
              {
                loan_gid: base64Name("000000000000000000000002", "Loan"),
                quantity: "400.00",
                borrower_id: "wHHR1SUBT0dspoF4YUO32",
              },
              {
                loan_gid: base64Name("000000000000000000000003", "Loan"),
                quantity: "450.00",
                borrower_id: "wHHR1SUBT0dspoF4YUO32",
              },
            ],
          },
        },
        operationName: "addLendsMutation",
      })
      .set("Accept", "text/event-stream")
      .set("Authorization", accessToken)
      .set("Cookie", requestCookies);
    const stream2 = response2.text.split("\n");
    const data2 = JSON.parse(stream2[3].replace("data: ", ""));
    expect(data2.data.addLends.error).toBeFalsy();
    expect(response2.body.data.addLends.error).toBeFalsy();
    const lends = await admin.fetchTopicOffsets("add-lends");
    console.log("lends:", lends)
  });

  it("test AddLends not enough money valid access token", async () => {
    const id = crypto.randomUUID();
    const now = new Date();
    now.setMilliseconds(0);
    const refreshTokenExpireTime = now.getTime() / 1000 + REFRESH_TOKEN_EXP_NUMBER;
    const accessTokenExpireTime = now.getTime() / 1000 + ACCESS_TOKEN_EXP_NUMBER;
    const refreshToken = jwt.sign(
      {
        id,
        isBorrower: false,
        isLender: true,
        isSupport: false,
        refreshTokenExpireTime,
        exp: refreshTokenExpireTime,
      },
      REFRESHSECRET,
    );
    const accessToken = jwt.sign(
      {
        id,
        isBorrower: false,
        isLender: true,
        isSupport: false,
        refreshTokenExpireTime,
        exp: accessTokenExpireTime,
      },
      ACCESSSECRET,
    );
    const requestCookies = serialize("refreshToken", refreshToken);
    const response = await request
      .post("/graphql")
      .send({
        extensions: {
          doc_id: "64b571ffb2b4d4c3b1ab5d40cf54f5b1"
        },
        query: "",
        variables: {
          input: {
            lends: [
              {
                loan_gid: base64Name("400000000000000000000002", "Loan"),
                quantity: "150.00",
                borrower_id: "wHHR1SUBT0dspoF4YUO34",
              },
            ],
          },
        },
        operationName: "addLendsMutation",
      })
      .set("Accept", "text/event-stream")
      .set("Authorization", accessToken)
      .set("Cookie", requestCookies);
    expect(response.body.data.addLends.error).toBe("");
    //expect(producer.send).toHaveBeenCalledTimes(5);
  });

  it("test AddLends no investments done valid access token", async () => {
    const id = crypto.randomUUID();
    const now = new Date();
    now.setMilliseconds(0);
    const refreshTokenExpireTime = now.getTime() / 1000 + REFRESH_TOKEN_EXP_NUMBER;
    const accessTokenExpireTime = now.getTime() / 1000 + ACCESS_TOKEN_EXP_NUMBER;
    const refreshToken = jwt.sign(
      {
        id,
        isBorrower: false,
        isLender: true,
        isSupport: false,
        refreshTokenExpireTime,
        exp: refreshTokenExpireTime,
      },
      REFRESHSECRET,
    );
    const accessToken = jwt.sign(
      {
        id,
        isBorrower: false,
        isLender: true,
        isSupport: false,
        refreshTokenExpireTime,
        exp: accessTokenExpireTime,
      },
      ACCESSSECRET,
    );
    const requestCookies = serialize("refreshToken", refreshToken);
    const response = await request
      .post("/graphql")
      .send({
        extensions: {
          doc_id: "64b571ffb2b4d4c3b1ab5d40cf54f5b1"
        },
        query: "",
        variables: {
          input: {
            lends: [
              {
                loan_gid: base64Name("500000000000000000000002", "Loan"),
                quantity: "50.00",
                borrower_id: "wHHR1SUBT0dspoF4YUO36",
              },
            ],
          },
        },
        operationName: "addLendsMutation",
      })
      .set("Accept", "text/event-stream")
      .set("Authorization", accessToken)
      .set("Cookie", requestCookies);
    expect(response.body.data.addLends.error).toBe("");
    //expect(producer.send).toHaveBeenCalledTimes(6);
  });

  it("test AddLends not all investments are done valid access token", async () => {
    const id = crypto.randomUUID();
    const now = new Date();
    now.setMilliseconds(0);
    const refreshTokenExpireTime = now.getTime() / 1000 + REFRESH_TOKEN_EXP_NUMBER;
    const accessTokenExpireTime = now.getTime() / 1000 + ACCESS_TOKEN_EXP_NUMBER;
    const refreshToken = jwt.sign(
      {
        id,
        isBorrower: false,
        isLender: true,
        isSupport: false,
        refreshTokenExpireTime,
        exp: refreshTokenExpireTime,
      },
      REFRESHSECRET,
    );
    const accessToken = jwt.sign(
      {
        id,
        isBorrower: false,
        isLender: true,
        isSupport: false,
        refreshTokenExpireTime,
        exp: accessTokenExpireTime,
      },
      ACCESSSECRET,
    );
    const requestCookies = serialize("refreshToken", refreshToken);
    const response = await request
      .post("/graphql")
      .send({
        extensions: {
          doc_id: "64b571ffb2b4d4c3b1ab5d40cf54f5b1"
        },
        query: "",
        variables: {
          input: {
            lends: [
              {
                loan_gid: base64Name("600000000000000000000002", "Loan"),
                quantity: "50.00",
                borrower_id: "wHHR1SUBT0dspoF4YUO38",
              },
              {
                loan_gid: base64Name("600000000000000000000003", "Loan"),
                quantity: "50.00",
                borrower_id: "wHHR1SUBT0dspoF4YUO38",
              },
            ],
          },
        },
        operationName: "addLendsMutation",
      })
      .set("Accept", "text/event-stream")
      .set("Authorization", accessToken)
      .set("Cookie", requestCookies);
    expect(response.body.data.addLends.error).toBeFalsy();
    //consumer.
    //expect(producer.send).toHaveBeenCalledTimes(8);
  });
});
