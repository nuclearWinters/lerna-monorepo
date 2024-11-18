import { Server, ServerCredentials, credentials } from "@grpc/grpc-js";
import { AuthClient, AuthServer } from "@repo/grpc-utils";
import { AuthService } from "@repo/grpc-utils/protoAuth/auth_grpc_pb";
import { getValidTokens } from "@repo/jwt-utils";
import { getFintechCollections } from "@repo/mongo-utils";
import { RedisContainer } from "@testcontainers/redis";
import { serialize } from "cookie";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { Redis, type RedisOptions } from "ioredis";
import type { Producer } from "kafkajs";
import { MongoClient, ObjectId } from "mongodb";
import { createClient } from "redis";
import supertest from "supertest";
import { main } from "../app.ts";
import { MongoDBContainer } from "@testcontainers/mongodb";
import { after, describe, it } from "node:test";
import { deepStrictEqual, strictEqual } from "node:assert";

describe("AddLoan tests", async () => {
  const startedRedisContainer = await new RedisContainer().start();
  const startedMongoContainer = await new MongoDBContainer().start();
  const mongoClient = await MongoClient.connect(startedMongoContainer.getConnectionString(), { directConnection: true });
  const dbInstanceAuth = mongoClient.db("auth");
  const dbInstanceFintech = mongoClient.db("fintech");
  const redisClient = createClient({
    url: startedRedisContainer.getConnectionUrl(),
  });
  await redisClient.connect();
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
  const grpcServer = new Server();
  grpcServer.addService(AuthService, AuthServer(dbInstanceAuth, redisClient));
  grpcServer.bindAsync("0.0.0.0:1983", ServerCredentials.createInsecure(), (err) => {
    if (err) {
      return;
    }
  });
  const grpcClient = new AuthClient("0.0.0.0:1983", credentials.createInsecure());
  const server = await main(dbInstanceFintech, null as unknown as Producer, grpcClient, pubsub);
  const request = supertest(server, { http2: true });

  after(async () => {
    grpcClient.close();
    grpcServer.forceShutdown();
    await redisClient.disconnect();
    await startedRedisContainer.stop();
    await mongoClient.close();
    await pubsub.close();
  });

  it("test AddLoan valid access token", async () => {
    const { users, loans } = getFintechCollections(dbInstanceFintech);
    const _id = new ObjectId();
    const id = crypto.randomUUID();
    await users.insertOne({
      _id,
      id,
      account_available: 1_000_00,
      account_to_be_paid: 0,
      account_total: 1_000_00,
      account_withheld: 0,
    });
    const { refreshToken, accessToken } = getValidTokens({
      isBorrower: false,
      isLender: true,
      isSupport: false,
      id,
    });
    const requestCookies = serialize("refreshToken", refreshToken);
    const response = await request
      .post("/graphql")
      .trustLocalhost()
      .send({
        extensions: {
          doc_id: "8fb70b700252819b04a0357e79c75aa6",
        },
        query: "",
        variables: {
          input: {
            goal: "1000.00",
            term: 2,
          },
        },
        operationName: "AddLoanMutation",
      })
      .set("Accept", "text/event-stream")
      .set("Authorization", accessToken)
      .set("Cookie", requestCookies);
    const stream = response.text.split("\n");
    const data = JSON.parse(stream[1].replace("data: ", ""));
    strictEqual(data.data.addLoan.error, "");
    const user = await users.findOne({
      id,
    });
    deepStrictEqual(user, {
      _id,
      id,
      account_available: 1_000_00,
      account_to_be_paid: 0,
      account_total: 1_000_00,
      account_withheld: 0,
    });
    const allLoans = await loans.find({ user_id: id }).toArray();
    strictEqual(allLoans.length, 1);
    deepStrictEqual(
      allLoans.map((loan) => ({
        ...loan,
        _id: ObjectId.isValid(_id),
        expiry: loan.expiry instanceof Date,
      })),
      [
        {
          _id: true,
          expiry: true,
          roi: 17,
          user_id: id,
          goal: 1_000_00,
          raised: 0,
          score: "AAA",
          status: "waiting for approval",
          term: 2,
          pending: 1_000_00,
          payments_delayed: 0,
          payments_done: 0,
        },
      ],
    );
  });
});
