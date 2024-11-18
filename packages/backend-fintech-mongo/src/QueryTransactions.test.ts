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
import { MongoDBContainer } from "@testcontainers/mongodb";
import { after, it, describe } from "node:test";
import { ok, strictEqual } from "node:assert";

describe("QueryTransactions tests", async () => {
  const startedMongoContainer = await new MongoDBContainer().start();
  const mongoClient = await MongoClient.connect(startedMongoContainer.getConnectionString(), { directConnection: true });
  const pubsub = null as unknown as RedisPubSub;
  const dbInstanceAuth = mongoClient.db("auth");
  const dbInstanceFintech = mongoClient.db("fintech");
  const producer = null as unknown as Producer;
  const startedRedisContainer = await new RedisContainer().start();
  const grpcClient = new AuthClient("0.0.0.0:1990", credentials.createInsecure());
  const server = await main(dbInstanceFintech, producer, grpcClient, pubsub);
  const request = supertest(server, { http2: true });
  const grpcServer = new Server();
  const redisClient = createClient({
    url: startedRedisContainer.getConnectionUrl(),
  });
  await redisClient.connect();
  grpcServer.addService(AuthService, AuthServer(dbInstanceAuth, redisClient));
  grpcServer.bindAsync("0.0.0.0:1990", ServerCredentials.createInsecure(), (err) => {
    if (err) {
      return;
    }
  });

  after(
    async () => {
      grpcClient.close();
      grpcServer.forceShutdown();
      await redisClient.disconnect();
      await startedRedisContainer.stop();
      await mongoClient.close();
    },
    { timeout: 10_000 },
  );

  it("test TransactionsConnection valid access token", async () => {
    const { transactions, users } = getFintechCollections(dbInstanceFintech);
    const user_id = crypto.randomUUID();
    await users.insertOne({
      id: user_id,
      account_total: 0,
      account_available: 0,
      account_to_be_paid: 0,
      account_withheld: 0,
    });
    await transactions.insertMany([
      {
        user_id,
        _id: new ObjectId(),
        type: "credit",
        quantity: 100,
        created_at: new Date(),
      },
      {
        user_id,
        _id: new ObjectId(),
        type: "invest",
        quantity: -100,
        created_at: new Date(),
        loan_oid: new ObjectId(),
        borrower_id: "",
      },
      {
        user_id,
        _id: new ObjectId(),
        type: "payment",
        quantity: -100,
        created_at: new Date(),
      },
      {
        user_id,
        _id: new ObjectId(),
        type: "withdrawal",
        quantity: -100,
        created_at: new Date(),
      },
      {
        user_id,
        _id: new ObjectId(),
        type: "credit",
        quantity: 100,
        created_at: new Date(),
      },
      {
        user_id,
        _id: new ObjectId(),
        type: "credit",
        quantity: 200,
        created_at: new Date(),
      },
      {
        user_id,
        _id: new ObjectId(),
        type: "invest",
        quantity: -200,
        created_at: new Date(),
        loan_oid: new ObjectId(),
        borrower_id: "",
      },
      {
        user_id,
        _id: new ObjectId(),
        type: "payment",
        quantity: -200,
        created_at: new Date(),
      },
      {
        user_id,
        _id: new ObjectId(),
        type: "withdrawal",
        quantity: -200,
        created_at: new Date(),
      },
      {
        user_id,
        _id: new ObjectId(),
        type: "credit",
        quantity: 200,
        created_at: new Date(),
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
          doc_id: "c4c8cc42f6f36174207c1b6dfc4adfae",
        },
        query: "",
        variables: {
          id: base64Name(user_id, "User"),
          count: 9,
          after: "",
          reset: Date.now(),
        },
        operationName: "GetTransactionsConnection",
      })
      .set("Accept", "text/event-stream")
      .set("Authorization", accessToken)
      .set("Cookie", requestCookies);
    const stream = response.text.split("\n");
    const data = JSON.parse(stream[1].replace("data: ", ""));
    strictEqual(data.data.node.transactions.edges.length, 9);
    ok(data.data.node.transactions.edges[0].cursor);
    ok(data.data.node.transactions.edges[0].node.id);
    ok(data.data.node.transactions.edges[0].node.user_id);
    ok(data.data.node.transactions.edges[0].node.id);
    strictEqual(data.data.node.transactions.edges[0].node.type, "CREDIT");
    strictEqual(data.data.node.transactions.edges[0].node.quantity, "$2.00");
    ok(data.data.node.transactions.edges[0].node.created_at);
  });
});
