import { main } from "./app";
import supertest from "supertest";
import { Db, MongoClient, ObjectId } from "mongodb";
import { TransactionMongo, UserMongo } from "./types";
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
import { jwt, base64Name } from "@lerna-monorepo/backend-utilities/index";
import { RedisClientType } from "@lerna-monorepo/backend-utilities/types";
import { AuthServer } from "@lerna-monorepo/backend-utilities/grpc";
import { AuthClient } from "@lerna-monorepo/backend-utilities/protoAuth/auth_grpc_pb";

describe("QueryTransactions tests", () => {
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

  it("test TransactionsConnection valid access token", async () => {
    const transactions =
      dbInstanceFintech.collection<TransactionMongo>("transactions");
    const users = dbInstanceFintech.collection<UserMongo>("users");
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
    expect(data.data.node.transactions.edges.length).toBe(9);
    expect(data.data.node.transactions.edges[0].cursor).toBeTruthy();
    expect(data.data.node.transactions.edges[0].node.id).toBeTruthy();
    expect(data.data.node.transactions.edges[0].node.user_id).toBeTruthy();
    expect(data.data.node.transactions.edges[0].node.id).toBeTruthy();
    expect(data.data.node.transactions.edges[0].node.type).toBe("CREDIT");
    expect(data.data.node.transactions.edges[0].node.quantity).toBe("$2.00");
    expect(data.data.node.transactions.edges[0].node.created_at).toBeTruthy();
  });
});
