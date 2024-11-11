import { main } from "./app.ts";
import supertest from "supertest";
import { Db, MongoClient, ObjectId } from "mongodb";
import { FintechUserMongo } from "@repo/mongo-utils";
import TestAgent from "supertest/lib/agent.js";
import { RedisContainer, StartedRedisContainer } from "@testcontainers/redis";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { credentials, Server, ServerCredentials } from "@grpc/grpc-js";
import { Producer } from "kafkajs";
import { createClient } from "redis";
import { serialize } from "cookie";
import { AuthService } from "@repo/grpc-utils/protoAuth/auth_grpc_pb";
import { getValidTokens } from "@repo/jwt-utils";
import type { RedisClientType } from "@repo/redis-utils";
import { AuthServer, AuthClient } from "@repo/grpc-utils";

describe("QueryUser tests", () => {
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
    const redisContainer = new RedisContainer();
    startedRedisContainer = await redisContainer.start();
    redisClient = createClient({
      url: startedRedisContainer.getConnectionUrl(),
    });
    await redisClient.connect();
    grpcServer = new Server();
    grpcServer.addService(AuthService, AuthServer(dbInstanceAuth, redisClient));
    grpcServer.bindAsync(
      "0.0.0.0:1985",
      ServerCredentials.createInsecure(),
      (err) => {
        if (err) {
          return;
        }
      }
    );
    grpcClient = new AuthClient("0.0.0.0:1985", credentials.createInsecure());
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

  it("test QueryUser valid access token", async () => {
    const users = dbInstanceFintech.collection<FintechUserMongo>("users");
    const user_oid = new ObjectId();
    const user_id = crypto.randomUUID();
    await users.insertMany([
      {
        _id: user_oid,
        id: user_id,
        account_available: 50000,
        account_to_be_paid: 0,
        account_total: 50000,
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
    expect(data.data.user.id).toBeTruthy();
    expect(data.data.user.accountAvailable).toBe("$500.00");
    expect(data.data.user.accountToBePaid).toBe("$0.00");
    expect(data.data.user.accountTotal).toBe("$500.00");
  });
});
