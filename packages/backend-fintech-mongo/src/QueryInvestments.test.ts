import { main } from "./app";
import supertest from "supertest";
import { Db, MongoClient, ObjectId } from "mongodb";
import { InvestmentMongo, FintechUserMongo } from "@repo/mongo-utils/types";
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
} from "@repo/utils/config";
import { AuthService } from "@repo/grpc-utils/protoAuth/auth_grpc_pb";
import { base64Name } from "@repo/utils/index";
import { jwt } from "@repo/jwt-utils/index";
import { RedisClientType } from "@repo/redis-utils/types";
import { AuthServer } from "@repo/grpc-utils/index";
import { AuthClient } from "@repo/grpc-utils/protoAuth/auth_grpc_pb";

describe("QueryInvestments tests", () => {
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

  it("test InvestmentConnection valid access token", async () => {
    const investments =
      dbInstanceFintech.collection<InvestmentMongo>("investments");
    const users = dbInstanceFintech.collection<FintechUserMongo>("users");
    const borrower_id_1 = crypto.randomUUID();
    const borrower_id_2 = crypto.randomUUID();
    const borrower_id_3 = crypto.randomUUID();
    const lender_id = crypto.randomUUID();
    await users.insertOne({
      id: lender_id,
      account_total: 0,
      account_available: 0,
      account_to_be_paid: 0,
      account_withheld: 0,
    });
    const invest1_oid = new ObjectId();
    const invest2_oid = new ObjectId();
    const invest3_oid = new ObjectId();
    const loan1_oid = new ObjectId();
    const loan2_oid = new ObjectId();
    const loan3_oid = new ObjectId();
    await investments.insertMany([
      {
        _id: invest1_oid,
        borrower_id: borrower_id_1,
        lender_id,
        loan_oid: loan1_oid,
        quantity: 50000,
        status: "up to date",
        created_at: new Date(),
        updated_at: new Date(),
        payments: 0,
        term: 3,
        roi: 17,
        moratory: 0,
        interest_to_earn: 0,
        to_be_paid: 0,
        paid_already: 0,
        amortize: 50989,
        status_type: "on_going",
      },
      {
        _id: invest2_oid,
        borrower_id: borrower_id_2,
        lender_id,
        loan_oid: loan2_oid,
        quantity: 50000,
        status: "up to date",
        created_at: new Date(),
        updated_at: new Date(),
        payments: 0,
        term: 50000,
        roi: 17,
        moratory: 0,
        interest_to_earn: 0,
        to_be_paid: 0,
        paid_already: 0,
        amortize: 50989,
        status_type: "on_going",
      },
      {
        _id: invest3_oid,
        borrower_id: borrower_id_3,
        lender_id,
        loan_oid: loan3_oid,
        quantity: 50000,
        status: "up to date",
        created_at: new Date(),
        updated_at: new Date(),
        payments: 0,
        term: 50000,
        roi: 17,
        moratory: 0,
        interest_to_earn: 0,
        to_be_paid: 0,
        paid_already: 0,
        amortize: 50989,
        status_type: "on_going",
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
        id: lender_id,
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
        id: lender_id,
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
          doc_id: "fa1e028210325a70201ab2012ab3ca9a",
        },
        query: "",
        variables: {
          id: base64Name(lender_id, "User"),
          count: 2,
          after: "",
          status: ["UP_TO_DATE"],
        },
        operationName: "GetInvestmentsConnection",
      })
      .set("Accept", "text/event-stream")
      .set("Authorization", accessToken)
      .set("Cookie", requestCookies);
    const stream = response.text.split("\n");
    const data = JSON.parse(stream[1].replace("data: ", ""));
    expect(data.data.node.investments.edges.length).toBe(2);
    expect(data.data.node.investments.edges[0].cursor).toBeTruthy();
    expect(data.data.node.investments.edges[0].node.id).toBeTruthy();
    expect(data.data.node.investments.edges[0].node.borrower_id).toBeTruthy();
    expect(data.data.node.investments.edges[0].node.loan_id).toBeTruthy();
    expect(data.data.node.investments.edges[0].node.quantity).toBe("$500.00");
    expect(data.data.node.investments.edges[0].node.created_at).toBeTruthy();
    expect(data.data.node.investments.edges[0].node.updated_at).toBeTruthy();
    expect(data.data.node.investments.edges[0].node.status).toBe("UP_TO_DATE");
  });
});
