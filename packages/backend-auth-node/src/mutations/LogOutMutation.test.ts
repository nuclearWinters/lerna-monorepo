import type { AccountClient } from "@repo/grpc-utils/protoAccount/account_grpc_pb";
import { getValidTokens } from "@repo/jwt-utils";
import type { AuthUserMongo } from "@repo/mongo-utils";
import { RedisContainer } from "@testcontainers/redis";
import bcrypt from "bcryptjs";
import { parse, serialize } from "cookie";
import { MongoClient, ObjectId } from "mongodb";
import { createClient } from "redis";
import supertest from "supertest";
import { main } from "../app.ts";
import { after, describe, it } from "node:test";
import { MongoDBContainer } from "@testcontainers/mongodb";
import { ok, strictEqual } from "node:assert";

describe("LogOutMutation tests", async () => {
  const startedRedisContainer = await new RedisContainer().start();
  const startedMongoContainer = await new MongoDBContainer().start();
  const client = await MongoClient.connect(startedMongoContainer.getConnectionString(), { directConnection: true });
  const dbInstance = client.db("auth");
  const redisClient = createClient({
    url: startedRedisContainer.getConnectionUrl(),
  });
  await redisClient.connect();
  const server = await main(dbInstance, redisClient, {} as AccountClient);
  const request = supertest(server, { http2: true });

  after(async () => {
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
    strictEqual(data.data.logOut.error, "");
    const responseCookies = response.headers["set-cookie"][0];
    ok(responseCookies);
    const parsedCookies = parse(responseCookies);
    strictEqual(parsedCookies.refreshToken, "");
    const authorization = response.headers.authorization;
    strictEqual(authorization, undefined);
  });
});
