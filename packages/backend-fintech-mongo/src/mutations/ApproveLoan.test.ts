import { Server, ServerCredentials, credentials } from "@grpc/grpc-js";
import { AuthClient, AuthServer } from "@repo/grpc-utils";
import { AuthService } from "@repo/grpc-utils/protoAuth/auth_grpc_pb";
import { getValidTokens } from "@repo/jwt-utils";
import { getFintechCollections } from "@repo/mongo-utils";
import { base64Name } from "@repo/utils";
import { RedisContainer } from "@testcontainers/redis";
import { serialize } from "cookie";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { Redis, type RedisOptions } from "ioredis";
import type { Producer } from "kafkajs";
import { MongoClient, ObjectId } from "mongodb";
import { createClient } from "redis";
import supertest from "supertest";
import { main } from "../app.ts";
import { after, it, describe } from "node:test";
import { MongoDBContainer } from "@testcontainers/mongodb";
import { deepStrictEqual, ok, strictEqual } from "node:assert";

describe("ApproveLoan tests", async () => {
  const startedMongoContainer = await new MongoDBContainer().start();
  const mongoClient = await MongoClient.connect(startedMongoContainer.getConnectionString(), { directConnection: true });
  const dbInstanceAuth = mongoClient.db("auth");
  const dbInstanceFintech = mongoClient.db("fintech");
  const producer = null as unknown as Producer;
  const startedRedisContainer = await new RedisContainer().start();
  const grpcClient = new AuthClient("0.0.0.0:1987", credentials.createInsecure());
  const options: RedisOptions = {
    host: startedRedisContainer.getHost(),
    port: startedRedisContainer.getMappedPort(6379),
    retryStrategy: () => 10_000,
  };
  const ioredisPublisherClient = new Redis(options);
  const ioredisSubscriberClient = new Redis(options);
  const pubsub = new RedisPubSub({
    publisher: ioredisPublisherClient,
    subscriber: ioredisSubscriberClient,
  });
  const server = await main(dbInstanceFintech, producer, grpcClient, pubsub);
  const request = supertest(server, { http2: true });
  const grpcServer = new Server();
  const redisClient = createClient({
    url: startedRedisContainer.getConnectionUrl(),
  });
  await redisClient.connect();
  grpcServer.addService(AuthService, AuthServer(dbInstanceAuth, redisClient));
  grpcServer.bindAsync("0.0.0.0:1987", ServerCredentials.createInsecure(), (err) => {
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
      await pubsub.close();
    },
    { timeout: 10_000 },
  );

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
    strictEqual(data.data.approveLoan.error, "");
    ok(data.data.approveLoan.loan);
    const user = await users.findOne({
      id: support_id,
    });
    deepStrictEqual(user, {
      _id: support_oid,
      id: support_id,
      account_available: 1_000_00,
      account_to_be_paid: 0,
      account_total: 1_000_00,
      account_withheld: 0,
    });
    const allLoans = await loans.find({ _id: loan_oid }).toArray();
    strictEqual(allLoans.length, 1);
    deepStrictEqual(
      allLoans.map((loan) => ({
        ...loan,
        _id: ObjectId.isValid(loan._id),
        expiry: loan.expiry instanceof Date,
      })),
      [
        {
          roi: 17,
          user_id: borrower_id,
          goal: 1_000_00,
          raised: 0,
          score: "AAA",
          status: "financing",
          term: 2,
          _id: true,
          expiry: true,
          pending: 0,
          payments_delayed: 0,
          payments_done: 0,
        },
      ],
    );
  });
});
