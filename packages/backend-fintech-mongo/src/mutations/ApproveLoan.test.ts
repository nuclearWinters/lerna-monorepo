import { main } from "../app.ts";
import supertest from "supertest";
import { type Db, MongoClient, ObjectId } from "mongodb";
import type { Producer } from "kafkajs";
import {
  type StartedRedisContainer,
  RedisContainer,
} from "@testcontainers/redis";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { Redis, type RedisOptions } from "ioredis";
import type TestAgent from "supertest/lib/agent.js";
import { AuthService } from "@repo/grpc-utils/protoAuth/auth_grpc_pb";
import { base64Name } from "@repo/utils";
import { getValidTokens } from "@repo/jwt-utils";
import type { RedisClientType } from "@repo/redis-utils";
import { AuthServer, AuthClient } from "@repo/grpc-utils";
import { serialize } from "cookie";
import { credentials, Server, ServerCredentials } from "@grpc/grpc-js";
import { createClient } from "redis";
import { getFintechCollections } from "@repo/mongo-utils";

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
      retryStrategy: () => 10_000,
    };
    ioredisPublisherClient = new Redis(options);
    ioredisSubscriberClient = new Redis(options);
    pubsub = new RedisPubSub({
      publisher: ioredisPublisherClient,
      subscriber: ioredisSubscriberClient,
    });
    await new Promise((resolve) => setTimeout(resolve, 5_000));
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
  }, 20_000);

  afterAll(async () => {
    grpcClient.close();
    grpcServer.forceShutdown();
    await redisClient.disconnect();
    await startedRedisContainer.stop();
    await mongoClient.close();
  }, 10_000);

  it("test ApproveLoan valid access token", async () => {
    const { users, loans } = getFintechCollections(dbInstanceFintech);
    const support_oid = new ObjectId();
    const borrower_oid = new ObjectId();
    const support_id = crypto.randomUUID();
    const borrower_id = crypto.randomUUID();
    const loan_oid = new ObjectId();
    await users.insertMany([
      {
        _id: support_oid,
        id: support_id,
        account_available: 1_000_00,
        account_to_be_paid: 0,
        account_total: 1_000_00,
        account_withheld: 0,
      },
      {
        _id: borrower_oid,
        id: borrower_id,
        account_available: 1_000_00,
        account_to_be_paid: 0,
        account_total: 1_000_00,
        account_withheld: 0,
      },
    ]);
    await loans.insertOne({
      _id: loan_oid,
      user_id: borrower_id,
      score: "AAA",
      roi: 17,
      goal: 1_000_00,
      term: 2,
      raised: 0,
      expiry: new Date(),
      status: "waiting for approval",
      pending: 0,
      payments_delayed: 0,
      payments_done: 0,
    });
    const { refreshToken, accessToken } = getValidTokens({
      isBorrower: false,
      isLender: false,
      isSupport: true,
      id: support_id,
    });
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
      account_available: 1_000_00,
      account_to_be_paid: 0,
      account_total: 1_000_00,
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
        goal: 1_000_00,
        raised: 0,
        score: "AAA",
        status: "financing",
        term: 2,
      },
    ]);
  });
});
