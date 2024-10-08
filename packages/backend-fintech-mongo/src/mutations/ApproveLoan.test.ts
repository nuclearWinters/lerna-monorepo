import { main } from "../app";
import supertest from "supertest";
import { Db, MongoClient, ObjectId } from "mongodb";
import { LoanMongo, UserMongo } from "../types";
import { Producer } from "kafkajs";
import { StartedRedisContainer, RedisContainer } from "@testcontainers/redis";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { Redis, RedisOptions } from "ioredis";
import TestAgent from "supertest/lib/agent";
import {
  REFRESH_TOKEN_EXP_NUMBER,
  ACCESS_TOKEN_EXP_NUMBER,
  ACCESSSECRET,
  REFRESHSECRET,
} from "@lerna-monorepo/backend-utilities/config";
import { AuthService } from "@lerna-monorepo/backend-utilities/protoAuth/auth_grpc_pb";
import { jwt, base64Name } from "@lerna-monorepo/backend-utilities/index";
import { RedisClientType } from "@lerna-monorepo/backend-utilities/types";
import { AuthServer } from "@lerna-monorepo/backend-utilities/grpc";
import { AuthClient } from "@lerna-monorepo/backend-utilities/protoAuth/auth_grpc_pb";
import { serialize } from "cookie";
import { credentials, Server, ServerCredentials } from "@grpc/grpc-js";
import { createClient } from "redis";

describe("ApproveLoan tests", () => {
  let mongoClient: MongoClient;
  let dbInstanceFintech: Db;
  let dbInstanceAuth: Db;
  let producer: Producer;
  let startedRedisContainer: StartedRedisContainer;
  let grpcClient: AuthClient;
  let pubsub: RedisPubSub;
  let request: TestAgent<supertest.Test>;
  let grpcServer: Server;
  let redisClient: RedisClientType;
  let ioredisPublisherClient: Redis;
  let ioredisSubscriberClient: Redis;

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
    await new Promise((resolve) => setTimeout(resolve, 5000));
    grpcServer = new Server();
    grpcServer.addService(AuthService, AuthServer(dbInstanceAuth, redisClient));
    grpcServer.bindAsync(
      "0.0.0.0:1987",
      ServerCredentials.createInsecure(),
      (err) => {
        if (err) {
          return;
        }
      }
    );
    grpcClient = new AuthClient(`0.0.0.0:1987`, credentials.createInsecure());
    const server = await main(dbInstanceFintech, producer, grpcClient, pubsub);
    request = supertest(server, { http2: true });
  }, 20000);

  afterAll(async () => {
    grpcClient.close();
    grpcServer.forceShutdown();
    await redisClient.disconnect();
    await startedRedisContainer.stop();
    await mongoClient.close();
  }, 10000);

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
    const refreshTokenExpireTime =
      now.getTime() / 1000 + REFRESH_TOKEN_EXP_NUMBER;
    const accessTokenExpireTime =
      now.getTime() / 1000 + ACCESS_TOKEN_EXP_NUMBER;
    const refreshToken = jwt.sign(
      {
        id: support_id,
        isBorrower: false,
        isLender: false,
        isSupport: true,
        refreshTokenExpireTime,
        exp: refreshTokenExpireTime,
      },
      REFRESHSECRET
    );
    const accessToken = jwt.sign(
      {
        id: support_id,
        isBorrower: false,
        isLender: false,
        isSupport: true,
        refreshTokenExpireTime,
        exp: accessTokenExpireTime,
      },
      ACCESSSECRET
    );
    const requestCookies = serialize("refreshToken", refreshToken);
    const response = await request
      .post("/graphql")
      .trustLocalhost()
      .send({
        extensions: {
          doc_id: "6fd0f5290ad731d160369f4bbae87b78",
        },
        query: "",
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
    const stream = response.text.split("\n");
    const data = JSON.parse(stream[1].replace("data: ", ""));
    expect(data.data.approveLoan.error).toBeFalsy();
    expect(data.data.approveLoan.loan).toBeTruthy();
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
