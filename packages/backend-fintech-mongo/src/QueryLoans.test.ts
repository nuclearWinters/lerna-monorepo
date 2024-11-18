import { Server, ServerCredentials, credentials } from "@grpc/grpc-js";
import { AuthClient, AuthServer } from "@repo/grpc-utils";
import { AuthService } from "@repo/grpc-utils/protoAuth/auth_grpc_pb";
import { getValidTokens } from "@repo/jwt-utils";
import { getFintechCollections } from "@repo/mongo-utils";
import { base64Name } from "@repo/utils";
import { RedisContainer } from "@testcontainers/redis";
import { serialize } from "cookie";
import type { RedisPubSub } from "graphql-redis-subscriptions";
import type { Producer } from "kafkajs";
import { MongoClient, ObjectId } from "mongodb";
import { createClient } from "redis";
import supertest from "supertest";
import { main } from "./app.ts";
import { after, describe, it } from "node:test";
import { MongoDBContainer } from "@testcontainers/mongodb";
import { ok, strictEqual } from "node:assert";

describe("QueryLoans tests", async () => {
  const startedMongoContainer = await new MongoDBContainer().start();
  const mongoClient = await MongoClient.connect(startedMongoContainer.getConnectionString(), { directConnection: true });
  const pubsub = null as unknown as RedisPubSub;
  const dbInstanceAuth = mongoClient.db("auth");
  const dbInstanceFintech = mongoClient.db("fintech");
  const producer = null as unknown as Producer;
  const startedRedisContainer = await new RedisContainer().start();
  const grpcClient = new AuthClient("0.0.0.0:1989", credentials.createInsecure());
  const server = await main(dbInstanceFintech, producer, grpcClient, pubsub);
  const request = supertest(server, { http2: true });
  const grpcServer = new Server();
  const redisClient = createClient({
    url: startedRedisContainer.getConnectionUrl(),
  });
  await redisClient.connect();
  grpcServer.addService(AuthService, AuthServer(dbInstanceAuth, redisClient));
  grpcServer.bindAsync("0.0.0.0:1989", ServerCredentials.createInsecure(), (err) => {
    if (err) {
      return;
    }
  });

  after(async () => {
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
    strictEqual(data.data.node.loansFinancing.edges.length, 2);
    ok(data.data.node.loansFinancing.edges[0].cursor);
    ok(data.data.node.loansFinancing.edges[0].node.id);
    ok(data.data.node.loansFinancing.edges[0].node.user_id);
    ok(data.data.node.loansFinancing.edges[0].node.score);
    ok(data.data.node.loansFinancing.edges[0].node.ROI);
    ok(data.data.node.loansFinancing.edges[0].node.goal);
    ok(data.data.node.loansFinancing.edges[0].node.term);
    ok(data.data.node.loansFinancing.edges[0].node.raised);
    ok(data.data.node.loansFinancing.edges[0].node.expiry);
  });
});
