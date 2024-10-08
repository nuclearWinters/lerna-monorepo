import { main } from "./app";
import supertest from "supertest";
import { Db, MongoClient, ObjectId } from "mongodb";
import { UserMongo } from "./types";
import TestAgent from "supertest/lib/agent";
import { RedisContainer, StartedRedisContainer } from "@testcontainers/redis";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { credentials, Server, ServerCredentials } from "@grpc/grpc-js";
import { Producer } from "kafkajs";
import { createClient } from "redis";
import { serialize } from "cookie";
import {
  REFRESH_TOKEN_EXP_NUMBER,
  ACCESS_TOKEN_EXP_NUMBER,
  ACCESSSECRET,
  REFRESHSECRET,
} from "@lerna-monorepo/backend-utilities/config";
import { AuthService } from "@lerna-monorepo/backend-utilities/protoAuth/auth_grpc_pb";
import { jwt } from "@lerna-monorepo/backend-utilities/index";
import { RedisClientType } from "@lerna-monorepo/backend-utilities/types";
import { AuthServer } from "@lerna-monorepo/backend-utilities/grpc";
import { AuthClient } from "@lerna-monorepo/backend-utilities/protoAuth/auth_grpc_pb";

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
    const users = dbInstanceFintech.collection<UserMongo>("users");
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
    const now = new Date();
    now.setMilliseconds(0);
    const refreshTokenExpireTime =
      now.getTime() / 1000 + REFRESH_TOKEN_EXP_NUMBER;
    const accessTokenExpireTime =
      now.getTime() / 1000 + ACCESS_TOKEN_EXP_NUMBER;
    const refreshToken = jwt.sign(
      {
        id: user_id,
        isBorrower: false,
        isLender: true,
        isSupport: false,
        refreshTokenExpireTime,
        exp: refreshTokenExpireTime,
      },
      REFRESHSECRET
    );
    const accessToken = jwt.sign(
      {
        id: user_id,
        isBorrower: false,
        isLender: true,
        isSupport: false,
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
