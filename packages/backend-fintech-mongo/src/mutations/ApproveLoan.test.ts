import { main } from "../app";
import supertest from "supertest";
import { Db, MongoClient, ObjectId } from "mongodb";
import { LoanMongo, UserMongo } from "../types";
import { base64Name, jwt } from "../utils";
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

describe("ApproveLoan tests", () => {
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
      "localhost:1987",
      ServerCredentials.createInsecure(),
      (err) => {
        if (err) {
          return;
        }
      }
    );
    grpcClient = new AuthClient(
      `localhost:1987`,
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

  it("test ApproveLoan valid access token", async () => {
    const users = dbInstanceFintech.collection<UserMongo>("users");
    const support_oid = new ObjectId();
    const borrower_oid = new ObjectId();
    const support_id = crypto.randomUUID();
    const borrower_id = crypto.randomUUID();
    const loan_oid = new ObjectId();
    await users.insertMany([
      {
        _id: support_oid,
        id: support_id,
        account_available: 100000,
        account_to_be_paid: 0,
        account_total: 100000,
        account_withheld: 0,
      },
      {
        _id: borrower_oid,
        id: borrower_id,
        account_available: 100000,
        account_to_be_paid: 0,
        account_total: 100000,
        account_withheld: 0,
      },
    ]);
    const loans = dbInstanceFintech.collection<LoanMongo>("loans");
    await loans.insertOne({
      _id: loan_oid,
      user_id: borrower_id,
      score: "AAA",
      roi: 17,
      goal: 100000,
      term: 2,
      raised: 0,
      expiry: new Date(),
      status: "waiting for approval",
      pending: 0,
      payments_delayed: 0,
      payments_done: 0,
    });
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
        query: `mutation ApproveLoanMutation($input: ApproveLoanInput!) {
          approveLoan(input: $input) {
            error
            loan {
              id
            }
          }
        }`,
        variables: {
          input: {
            loan_gid: base64Name(loan_oid.toHexString(), "Loan"),
          },
        },
        operationName: "ApproveLoanMutation",
      })
      .set("Accept", "text/event-stream")
      .set("Authorization", accessToken)
      .set("Cookie", requestCookies);
    expect(response.body.data.approveLoan.error).toBeFalsy();
    expect(response.body.data.approveLoan.loan).toBeTruthy();
    const user = await users.findOne({
      id: support_id,
    });
    expect(user).toEqual({
      _id: support_oid,
      id: support_id,
      account_available: 100000,
      account_to_be_paid: 0,
      account_total: 100000,
      account_withheld: 0,
    });
    const allLoans = await loans.find({ _id: loan_oid }).toArray();
    expect(allLoans.length).toBe(1);
    expect(
      allLoans.map((loan) => ({
        ROI: loan.roi,
        user_id: loan.user_id,
        goal: loan.goal,
        raised: loan.raised,
        score: loan.score,
        status: loan.status,
        term: loan.term,
      }))
    ).toEqual([
      {
        ROI: 17,
        user_id: borrower_id,
        goal: 100000,
        raised: 0,
        score: "AAA",
        status: "financing",
        term: 2,
      },
    ]);
  });
});
