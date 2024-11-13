import { main } from "../app.ts";
import supertest from "supertest";
import { MongoClient, type Db, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import type TestAgent from "supertest/lib/agent.js";
import type { RedisClientType } from "redis";
import {
  RedisContainer,
  type StartedRedisContainer,
} from "@testcontainers/redis";
import { createClient } from "redis";
import { getValidTokens } from "@repo/jwt-utils";
import type { AccountClient } from "@repo/grpc-utils/protoAccount/account_grpc_pb";
import { parse, serialize } from "cookie";
import { getAuthCollections } from "@repo/mongo-utils";

describe("ExtendSessionMutation tests", () => {
  let client: MongoClient;
  let dbInstance: Db;
  let redisClient: RedisClientType;
  let request: TestAgent<supertest.Test>;
  let grpcClient: AccountClient;
  let startedRedisContainer: StartedRedisContainer;

  beforeAll(async () => {
    client = await MongoClient.connect(
      (global as unknown as { __MONGO_URI__: string }).__MONGO_URI__,
      {}
    );
    dbInstance = client.db(
      (global as unknown as { __MONGO_DB_NAME__: string }).__MONGO_DB_NAME__
    );
    startedRedisContainer = await new RedisContainer().start();
    redisClient = createClient({
      url: startedRedisContainer.getConnectionUrl(),
    });
    await redisClient.connect();
    const server = await main(dbInstance, redisClient, grpcClient);
    request = supertest(server, { http2: true });
  });

  afterAll(async () => {
    await redisClient.disconnect();
    await startedRedisContainer.stop();
    await client.close();
  });

  it("ExtendSessionMutation: success", async () => {
    const { authusers } = getAuthCollections(dbInstance);
    const _user_id = new ObjectId();
    const id = crypto.randomUUID();
    await authusers.insertOne({
      _id: _user_id,
      email: "armandocorrect@hotmail.com",
      password: bcrypt.hashSync("correct", 12),
      isLender: true,
      isBorrower: false,
      isSupport: false,
      language: "en",
      mobile: "",
      name: "",
      CURP: "",
      RFC: "",
      apellidoMaterno: "",
      apellidoPaterno: "",
      clabe: "",
      id,
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
          doc_id: "4e65856e4f21af21cfd702bbdea624e4",
        },
        query: "",
        variables: {
          input: {},
        },
        operationName: "extendSessionMutation",
      })
      .set("Accept", "text/event-stream")
      .set("Authorization", accessToken)
      .set("Cookie", requestCookies);
    const stream = response.text.split("\n");
    const data = JSON.parse(stream[1].replace("data: ", ""));
    expect(data.data.extendSession.error).toBeFalsy();
    const responseCookies = response.headers["set-cookie"][0];
    expect(responseCookies).toBeTruthy();
    const parsedCookies = parse(responseCookies);
    expect(parsedCookies.refreshToken).not.toBe(refreshToken);
  });

  it("ExtendSessionMutation: error", async () => {
    const response = await request
      .post("/graphql")
      .trustLocalhost()
      .send({
        extensions: {
          doc_id: "4e65856e4f21af21cfd702bbdea624e4",
        },
        query: `mutation extendSessionMutation($input: ExtendSessionInput!) {
          extendSession(input: $input) {
            error
          }
        }`,
        variables: {
          input: {},
        },
        operationName: "extendSessionMutation",
      })
      .set("Accept", "text/event-stream");
    const stream = response.text.split("\n");
    const data = JSON.parse(stream[1].replace("data: ", ""));
    expect(data.data.extendSession.error).toBeTruthy();
    expect(response.headers["set-cookie"]).toBeFalsy();
  });
});
