import { main } from "../app";
import supertest from "supertest";
import { MongoClient, Db, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { UserMongo } from "../types";
import TestAgent from "supertest/lib/agent";
import { RedisClientType } from "redis";
import { RedisContainer, StartedRedisContainer } from "@testcontainers/redis";
import { createClient } from "redis";
import { AccountClient, jwt } from "@lerna-monorepo/backend-utilities";
import { parse, serialize } from "cookie";

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
    const users = dbInstance.collection<UserMongo>("users");
    const _user_id = new ObjectId();
    const id = crypto.randomUUID();
    await users.insertOne({
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
    const refreshTokenExpireTime = new Date().getTime() / 1000 + 900;
    const accessTokenExpireTime = new Date().getTime() / 1000 + 180;
    const refreshToken = jwt.sign(
      {
        id,
        isBorrower: false,
        isLender: true,
        isSupport: false,
        refreshTokenExpireTime,
        exp: refreshTokenExpireTime,
      },
      "REFRESHSECRET"
    );
    const accessToken = jwt.sign(
      {
        id,
        isBorrower: false,
        isLender: true,
        isSupport: false,
        refreshTokenExpireTime,
        exp: accessTokenExpireTime,
      },
      "ACCESSSECRET"
    );
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
    const data = JSON.parse(stream[3].replace("data: ", ""));
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
    const data = JSON.parse(stream[3].replace("data: ", ""));
    expect(data.data.extendSession.error).toBeTruthy();
    expect(response.headers["set-cookie"]).toBeFalsy();
  });
});
