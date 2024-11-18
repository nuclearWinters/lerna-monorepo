import { Server, ServerCredentials, credentials } from "@grpc/grpc-js";
import { AuthClient, AuthServer } from "@repo/grpc-utils";
import { AuthService } from "@repo/grpc-utils/protoAuth/auth_grpc_pb";
import { getValidTokens } from "@repo/jwt-utils";
import { getFintechCollections } from "@repo/mongo-utils";
import { RedisContainer } from "@testcontainers/redis";
import { serialize } from "cookie";
import type { RedisPubSub } from "graphql-redis-subscriptions";
import type { Producer } from "kafkajs";
import { MongoClient, ObjectId } from "mongodb";
import { createClient } from "redis";
import supertest from "supertest";
import { main } from "./app.ts";
import { after, it, describe } from "node:test";
import { ok, strictEqual } from "node:assert";
import { MongoDBContainer } from "@testcontainers/mongodb";

describe("QueryUser tests", async () => {
  const startedMongoContainer = await new MongoDBContainer().start();
  const mongoClient = await MongoClient.connect(startedMongoContainer.getConnectionString(), { directConnection: true });
  const pubsub = null as unknown as RedisPubSub;
  const dbInstanceAuth = mongoClient.db("auth");
  const dbInstanceFintech = mongoClient.db("fintech");
  const producer = null as unknown as Producer;
  const startedRedisContainer = await new RedisContainer().start();
  const grpcClient = new AuthClient("0.0.0.0:1991", credentials.createInsecure());
  const server = await main(dbInstanceFintech, producer, grpcClient, pubsub);
  const request = supertest(server, { http2: true });
  const grpcServer = new Server();
  const redisClient = createClient({
    url: startedRedisContainer.getConnectionUrl(),
  });
  await redisClient.connect();
  grpcServer.addService(AuthService, AuthServer(dbInstanceAuth, redisClient));
  grpcServer.bindAsync("0.0.0.0:1991", ServerCredentials.createInsecure(), (err) => {
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

  it("test QueryUser valid access token", async () => {
    const { users } = getFintechCollections(dbInstanceFintech);
    const user_oid = new ObjectId();
    const user_id = crypto.randomUUID();
    await users.insertMany([
      {
        _id: user_oid,
        id: user_id,
        account_available: 500_00,
        account_to_be_paid: 0,
        account_total: 500_00,
        account_withheld: 0,
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
          doc_id: "aa6ec069076aa222be921f4b6568a17c",
        },
        query: "",
        variables: {},
        operationName: "AccountQueriesQuery",
      })
      .set("Accept", "text/event-stream")
      .set("Authorization", accessToken)
      .set("Cookie", requestCookies);
    const stream = response.text.split("\n");
    const data = JSON.parse(stream[1].replace("data: ", ""));
    ok(data.data.user.id);
    strictEqual(data.data.user.accountAvailable, "$500.00");
    strictEqual(data.data.user.accountToBePaid, "$0.00");
    strictEqual(data.data.user.accountTotal, "$500.00");
  });
});
