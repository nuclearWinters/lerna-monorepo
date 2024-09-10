import { main } from "../app.js";
import supertest from "supertest";
import { Db, MongoClient, ObjectId } from "mongodb";
import { UserMongo } from "../types.js";
import { createClient, RedisClientType } from "redis";
import TestAgent from "supertest/lib/agent.js";
import { RedisContainer, StartedRedisContainer } from "@testcontainers/redis";
import { jwt } from "@lerna-monorepo/backend-utilities/index";
import { AccountClient } from "@lerna-monorepo/backend-utilities/protoAccount/account_grpc_pb";
import { serialize } from "cookie";

describe("UpdateUser tests", () => {
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

  it("test UpdateUser valid access token", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    const _id = new ObjectId();
    const id = crypto.randomUUID();
    await users.insertOne({
      _id,
      name: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      RFC: "",
      CURP: "",
      clabe: "",
      mobile: "",
      isLender: true,
      isBorrower: false,
      isSupport: false,
      email: "armando10@gmail.com",
      password: "",
      language: "default",
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
          doc_id: "42158b2d4898c10429bee6ac923b8bbc",
        },
        query: "",
        variables: {
          input: {
            name: "Armando Narcizo",
            apellidoPaterno: "Rueda",
            apellidoMaterno: "Peréz",
            RFC: "RFC",
            CURP: "CURP",
            clabe: "clabe",
            mobile: "9831228788",
            language: "ES",
            email: "armando10@gmail.com",
          },
        },
        operationName: "UpdateUserMutation",
      })
      .set("Accept", "text/event-stream")
      .set("Authorization", accessToken)
      .set("Cookie", requestCookies);
    const stream = response.text.split("\n");
    const data = JSON.parse(stream[3].replace("data: ", ""));
    expect(data.data.updateUser.error).toBeFalsy();
    expect(data.data.updateUser.authUser).toBeTruthy();
    const user = await users.findOne({
      _id,
    });
    expect(user).toEqual({
      _id,
      email: "armando10@gmail.com",
      isBorrower: false,
      isLender: true,
      isSupport: false,
      password: "",
      language: "es",
      mobile: "9831228788",
      name: "Armando Narcizo",
      CURP: "CURP",
      RFC: "RFC",
      apellidoMaterno: "Peréz",
      apellidoPaterno: "Rueda",
      clabe: "clabe",
      id,
    });
  });
});
