import { main } from "../app.ts";
import supertest from "supertest";
import { MongoClient, type Db, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { createClient, type RedisClientType } from "redis";
import type TestAgent from "supertest/lib/agent.js";
import {
  RedisContainer,
  type StartedRedisContainer,
} from "@testcontainers/redis";
import { getValidTokens } from "@repo/jwt-utils";
import type { AccountClient } from "@repo/grpc-utils/protoAccount/account_grpc_pb";
import { parse, serialize } from "cookie";
import type { AuthUserMongo } from "@repo/mongo-utils";

describe("LogOutMutation tests", () => {
  let client: MongoClient;
  let dbInstance: Db;
  let request: TestAgent<supertest.Test>;
  let grpcClient: AccountClient;
  let redisClient: RedisClientType;
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

  it("LogOutMutation: user has refresh token and access token", async () => {
    const users = dbInstance.collection<AuthUserMongo>("users");
    const _id = new ObjectId();
    const id = crypto.randomUUID();
    await users.insertOne({
      _id,
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
          doc_id: "62f48d6f993235723f255966785c11c1",
        },
        query: "",
        variables: {
          input: {},
        },
        operationName: "logOutMutation",
      })
      .set("Accept", "text/event-stream")
      .set("Authorization", accessToken)
      .set("Cookie", requestCookies);
    const stream = response.text.split("\n");
    const data = JSON.parse(stream[1].replace("data: ", ""));
    expect(data.data.logOut.error).toBeFalsy();
    const responseCookies = response.headers["set-cookie"][0];
    expect(responseCookies).toBeTruthy();
    const parsedCookies = parse(responseCookies);
    expect(parsedCookies.refreshToken).toBe("");
    const authorization = response.headers["authorization"];
    expect(authorization).toBeFalsy();
  });
});
