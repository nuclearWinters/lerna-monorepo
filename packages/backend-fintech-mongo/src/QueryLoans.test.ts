import { main } from "./app.ts";
import supertest from "supertest";
import { type Db, MongoClient, ObjectId } from "mongodb";
import type TestAgent from "supertest/lib/agent.js";
import {
  RedisContainer,
  type StartedRedisContainer,
} from "@testcontainers/redis";
import type { RedisPubSub } from "graphql-redis-subscriptions";
import { credentials, Server, ServerCredentials } from "@grpc/grpc-js";
import type { Producer } from "kafkajs";
import { createClient } from "redis";
import { serialize } from "cookie";
import { AuthService } from "@repo/grpc-utils/protoAuth/auth_grpc_pb";
import { base64Name } from "@repo/utils";
import { getValidTokens } from "@repo/jwt-utils";
import type { RedisClientType } from "@repo/redis-utils";
import { AuthServer, AuthClient } from "@repo/grpc-utils";
import { getFintechCollections } from "@repo/mongo-utils";

describe("QueryLoans tests", () => {
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
    grpcServer = new Server();
    grpcServer.addService(AuthService, AuthServer(dbInstanceAuth, redisClient));
    grpcServer.bindAsync(
      "0.0.0.0:1986",
      ServerCredentials.createInsecure(),
      (err) => {
        if (err) {
          return;
        }
      }
    );
    grpcClient = new AuthClient("0.0.0.0:1986", credentials.createInsecure());
    const server = await main(dbInstanceFintech, producer, grpcClient, pubsub);
    request = supertest(server, { http2: true });
  });

  afterAll(async () => {
    grpcClient.close();
    grpcServer.forceShutdown();
    await redisClient.disconnect();
    await startedRedisContainer.stop();
    await mongoClient.close();
  });

  it("test LoanConnection valid access token", async () => {
    const { loans, users } = getFintechCollections(dbInstanceFintech);
    const user_id = crypto.randomUUID();
    await users.insertOne({
      id: user_id,
      account_total: 0,
      account_available: 0,
      account_to_be_paid: 0,
      account_withheld: 0,
    });
    const loan1_oid = new ObjectId();
    const loan2_oid = new ObjectId();
    const loan3_oid = new ObjectId();
    const loan4_oid = new ObjectId();
    const loan5_oid = new ObjectId();
    await loans.insertMany([
      {
        _id: loan1_oid,
        user_id,
        score: "AAA",
        roi: 17,
        goal: 1_000_00,
        term: 3,
        raised: 0,
        status: "to be paid",
        expiry: new Date(),
        pending: 0,
        payments_done: 0,
        payments_delayed: 0,
      },
      {
        _id: loan2_oid,
        user_id,
        score: "BBB",
        roi: 20,
        goal: 500_00,
        term: 3,
        raised: 0,
        status: "waiting for approval",
        expiry: new Date(),
        pending: 0,
        payments_done: 0,
        payments_delayed: 0,
      },
      {
        _id: loan3_oid,
        user_id,
        score: "CCC",
        roi: 24,
        goal: 1_500_00,
        term: 3,
        raised: 0,
        status: "financing",
        expiry: new Date(),
        pending: 0,
        payments_done: 0,
        payments_delayed: 0,
      },
      {
        _id: loan4_oid,
        user_id,
        score: "CCC",
        roi: 24,
        goal: 1_500_00,
        term: 3,
        raised: 0,
        status: "financing",
        expiry: new Date(),
        pending: 0,
        payments_done: 0,
        payments_delayed: 0,
      },
      {
        _id: loan5_oid,
        user_id,
        score: "CCC",
        roi: 24,
        goal: 1_500_00,
        term: 3,
        raised: 0,
        status: "financing",
        expiry: new Date(),
        pending: 0,
        payments_done: 0,
        payments_delayed: 0,
      },
    ]);
    const { refreshToken, accessToken } = getValidTokens({
      isBorrower: false,
      isLender: true,
      isSupport: false,
      id: user_id,
    });
    const requestCookies = serialize("refreshToken", refreshToken);
    const response = await request
      .post("/graphql")
      .trustLocalhost()
      .send({
        extensions: {
          doc_id: "74997cad3da3ce985529fbd30726bd41",
        },
        query: "",
        variables: {
          id: base64Name(user_id, "User"),
          count: 2,
          after: "",
          reset: Date.now(),
        },
        operationName: "GetLoansConnection",
      })
      .set("Accept", "text/event-stream")
      .set("Authorization", accessToken)
      .set("Cookie", requestCookies);
    const stream = response.text.split("\n");
    const data = JSON.parse(stream[1].replace("data: ", ""));
    expect(data.data.node.loansFinancing.edges.length).toBe(2);
    expect(data.data.node.loansFinancing.edges[0].cursor).toBeTruthy();
    expect(data.data.node.loansFinancing.edges[0].node.id).toBeTruthy();
    expect(data.data.node.loansFinancing.edges[0].node.user_id).toBeTruthy();
    expect(data.data.node.loansFinancing.edges[0].node.score).toBeTruthy();
    expect(data.data.node.loansFinancing.edges[0].node.ROI).toBeTruthy();
    expect(data.data.node.loansFinancing.edges[0].node.goal).toBeTruthy();
    expect(data.data.node.loansFinancing.edges[0].node.term).toBeTruthy();
    expect(data.data.node.loansFinancing.edges[0].node.raised).toBeTruthy();
    expect(data.data.node.loansFinancing.edges[0].node.expiry).toBeTruthy();
  });
});
