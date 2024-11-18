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

describe("QueryInvestments tests", async () => {
  const startedMongoContainer = await new MongoDBContainer().start();
  const mongoClient = await MongoClient.connect(startedMongoContainer.getConnectionString(), { directConnection: true });
  const pubsub = null as unknown as RedisPubSub;
  const dbInstanceAuth = mongoClient.db("auth");
  const dbInstanceFintech = mongoClient.db("fintech");
  const producer = null as unknown as Producer;
  const startedRedisContainer = await new RedisContainer().start();
  const grpcClient = new AuthClient("0.0.0.0:1988", credentials.createInsecure());
  const server = await main(dbInstanceFintech, producer, grpcClient, pubsub);
  const request = supertest(server, { http2: true });
  const grpcServer = new Server();
  const redisClient = createClient({
    url: startedRedisContainer.getConnectionUrl(),
  });
  await redisClient.connect();
  grpcServer.addService(AuthService, AuthServer(dbInstanceAuth, redisClient));
  grpcServer.bindAsync("0.0.0.0:1988", ServerCredentials.createInsecure(), (err) => {
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

  it("test InvestmentConnection valid access token", async () => {
    const { investments, users } = getFintechCollections(dbInstanceFintech);
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
        quantity: 500_00,
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
        quantity: 500_00,
        status: "up to date",
        created_at: new Date(),
        updated_at: new Date(),
        payments: 0,
        term: 500_00,
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
        quantity: 500_00,
        status: "up to date",
        created_at: new Date(),
        updated_at: new Date(),
        payments: 0,
        term: 500_00,
        roi: 17,
        moratory: 0,
        interest_to_earn: 0,
        to_be_paid: 0,
        paid_already: 0,
        amortize: 50989,
        status_type: "on_going",
      },
    ]);
    const { refreshToken, accessToken } = getValidTokens({
      isBorrower: false,
      isLender: true,
      isSupport: false,
      id: lender_id,
    });
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
    strictEqual(data.data.node.investments.edges.length, 2);
    ok(data.data.node.investments.edges[0].cursor);
    ok(data.data.node.investments.edges[0].node.id);
    ok(data.data.node.investments.edges[0].node.borrower_id);
    ok(data.data.node.investments.edges[0].node.loan_id);
    strictEqual(data.data.node.investments.edges[0].node.quantity, "$500.00");
    ok(data.data.node.investments.edges[0].node.created_at);
    ok(data.data.node.investments.edges[0].node.updated_at);
    strictEqual(data.data.node.investments.edges[0].node.status, "UP_TO_DATE");
  });
});
