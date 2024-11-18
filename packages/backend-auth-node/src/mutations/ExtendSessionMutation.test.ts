import type { AccountClient } from "@repo/grpc-utils/protoAccount/account_grpc_pb";
import { getValidTokens } from "@repo/jwt-utils";
import { getAuthCollections } from "@repo/mongo-utils";
import { RedisContainer } from "@testcontainers/redis";
import { MongoDBContainer } from "@testcontainers/mongodb";
import bcrypt from "bcryptjs";
import { parse, serialize } from "cookie";
import { MongoClient, ObjectId } from "mongodb";
import { createClient } from "redis";
import supertest from "supertest";
import { main } from "../app.ts";
import { describe, it, after } from "node:test";
import { ok, strictEqual, notStrictEqual } from "node:assert";

describe("ExtendSessionMutation tests", async () => {
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
    strictEqual(data.data.extendSession.error, "");
    const responseCookies = response.headers["set-cookie"][0];
    ok(responseCookies);
    const parsedCookies = parse(responseCookies);
    notStrictEqual(parsedCookies.refreshToken, refreshToken);
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
    ok(data.data.extendSession.error);
    strictEqual(response.headers["set-cookie"], undefined);
  });
});
