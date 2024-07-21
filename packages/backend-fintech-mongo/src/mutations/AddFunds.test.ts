import { main } from "../app";
import supertest from "supertest";
import { Db, MongoClient, ObjectId } from "mongodb";
import { TransactionMongo, UserMongo } from "../types";
import { jwt } from "../utils";
import { Kafka, Producer } from "kafkajs";
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

describe("AddFunds tests", () => {
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
      "localhost:1983",
      ServerCredentials.createInsecure(),
      (err) => {
        if (err) {
          return;
        }
      }
    );
    grpcClient = new AuthClient(
      `localhost:1983`,
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
    await redisClient.disconnect()
    await startedKafkaContainer.stop()
    await startedRedisContainer.stop();
    await mongoClient.close();
    await (() => new Promise(resolve => setTimeout(resolve, 1000)))();
  });

  it("test AddFunds increase valid access token", async () => {
    const users = dbInstanceFintech.collection<UserMongo>("users");
    const _id = new ObjectId();
    const id = crypto.randomUUID();
    await users.insertOne({
      _id,
      id,
      account_available: 100000,
      account_to_be_paid: 0,
      account_total: 100000,
      account_withheld: 0,
    });
    const refreshTokenExpireTime = new Date().getTime() / 1000 + REFRESH_TOKEN_EXP_NUMBER;
    const accessTokenExpireTime = new Date().getTime() / 1000 + ACCESS_TOKEN_EXP_NUMBER;
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
      .trustLocalhost()
      .send({
        extensions: {
          doc_id: "ccd989a67362a42de18960129992958e"
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
    const data = JSON.parse(stream[3].replace("data: ", ""));
    expect(data.data.addFunds.error).toBeFalsy();
  });

  /*it("test AddFunds decrease valid access token", async () => {
    const users = dbInstanceFintech.collection<UserMongo>("users");
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
    const response = await request
      .post("/graphql")
      .trustLocalhost()
      .send({
        query: `mutation addFundsMutation($input: AddFundsInput!) {
          addFunds(input: $input) {
            error
          }
        }`,
        variables: {
          input: {
            quantity: "-500.00",
          },
        },
        operationName: "addFundsMutation",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        jwt.sign(
          {
            id,
            isBorrower: false,
            isLender: true,
            isSupport: false,
          },
          "ACCESSSECRET",
          {
            expiresIn: "15m",
          }
        )
      )
      .set("Cookie", `id=` + id);
    expect(response.body.data.addFunds.error).toBeFalsy();
  });

  it("test AddFunds increase invalid access token", async () => {
    const users = dbInstanceFintech.collection<UserMongo>("users");
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
    const response = await request
      .post("/graphql")
      .trustLocalhost()
      .send({
        query: `mutation addFundsMutation($input: AddFundsInput!) {
          addFunds(input: $input) {
            error
          }
        }`,
        variables: {
          input: {
            quantity: "500.00",
          },
        },
        operationName: "addFundsMutation",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        jwt.sign(
          {
            id,
            isBorrower: false,
            isLender: true,
            isSupport: false,
          },
          "ACCESSSECRET",
          { expiresIn: "0s" }
        )
      )
      .set("Cookie", `id=` + id);
    expect(response.body.data.addFunds.error).toBeFalsy();
  });

  it("test AddFunds try decrease more than available valid refresh token", async () => {
    const users = dbInstanceFintech.collection<UserMongo>("users");
    const transactions = dbInstanceFintech.collection<TransactionMongo>("transactions");
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
    const response = await request
      .post("/graphql")
      .trustLocalhost()
      .send({
        query: `mutation addFundsMutation($input: AddFundsInput!) {
          addFunds(input: $input) {
            error
          }
        }`,
        variables: {
          input: {
            quantity: "-1500.00",
          },
        },
        operationName: "addFundsMutation",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        jwt.sign(
          {
            id,
            isBorrower: false,
            isLender: true,
            isSupport: false,
          },
          "ACCESSSECRET",
          { expiresIn: "15s" }
        )
      )
      .set("Cookie", `id=` + id);
    expect(response.body.data.addFunds.error).toBe("");
    const user = await users.findOne({
      id,
    });
    expect(user).toEqual({
      _id: user_oid,
      id,
      account_available: 100000,
      account_to_be_paid: 0,
      account_total: 100000,
      account_withheld: 0,
    });
    const allTransactions = await transactions.find({ user_id: id }).toArray();
    expect(allTransactions.length).toBe(0);
  });

  it("test AddFunds try increase cero valid refresh token", async () => {
    const user_oid = new ObjectId();
    const id = crypto.randomUUID();
    const users = dbInstanceFintech.collection<UserMongo>("users");
    await users.insertOne({
      _id: user_oid,
      id,
      account_available: 100000,
      account_to_be_paid: 0,
      account_total: 100000,
      account_withheld: 0,
    });
    const response = await request
      .post("/graphql")
      .trustLocalhost()
      .send({
        query: `mutation addFundsMutation($input: AddFundsInput!) {
          addFunds(input: $input) {
            error
          }
        }`,
        variables: {
          input: {
            quantity: "0.00",
          },
        },
        operationName: "addFundsMutation",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        jwt.sign(
          {
            id,
            isBorrower: false,
            isLender: true,
            isSupport: false,
          },
          "ACCESSSECRET",
          { expiresIn: "15s" }
        )
      )
      .set("Cookie", `id=` + id);
    expect(response.body.data.addFunds.error).toBe(
      "La cantidad no puede ser cero."
    );
    const user = await users.findOne({
      id,
    });
    expect(user).toEqual({
      _id: user_oid,
      id,
      account_available: 100000,
      account_to_be_paid: 0,
      account_total: 100000,
      account_withheld: 0,
    });

    const transactions = dbInstanceFintech.collection<TransactionMongo>("transactions");
    const allTransactions = await transactions.find({ user_id: id }).toArray();
    expect(allTransactions.length).toBe(0);
  });*/
});
