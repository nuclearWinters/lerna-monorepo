import type { AccountClient } from "@repo/grpc-utils/protoAccount/account_grpc_pb";
import { getValidTokens } from "@repo/jwt-utils";
import type { AuthUserMongo, AuthUserSessions } from "@repo/mongo-utils";
import { base64Name } from "@repo/utils";
import { RedisContainer } from "@testcontainers/redis";
import bcrypt from "bcryptjs";
import { parse, serialize } from "cookie";
import { isBefore } from "date-fns";
import { MongoClient, ObjectId } from "mongodb";
import { createClient } from "redis";
import supertest from "supertest";
import { main } from "../app.ts";
import { after, describe, it } from "node:test";
import { MongoDBContainer } from "@testcontainers/mongodb";
import { ok, strictEqual } from "node:assert";

describe("RevokeSessionMutation tests", async () => {
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

  it("RevokeSessionMutation: is another user", async () => {
    const users = dbInstance.collection<AuthUserMongo>("users");
    const sessions = dbInstance.collection<AuthUserSessions>("sessions");
    const user_oid = new ObjectId();
    const user_id = crypto.randomUUID();
    const other_user_id = crypto.randomUUID();
    const other_session_oid = new ObjectId();
    const other_session_id = other_session_oid.toHexString();
    const other_session_gid = base64Name(other_session_id, "Session");
    const { refreshToken: otherRefreshToken } = getValidTokens({
      isBorrower: false,
      isLender: true,
      isSupport: false,
      id: other_user_id,
      invalidAccessToken: true,
    });
    await sessions.insertOne({
      _id: other_session_oid,
      applicationName: "Lerna Monorepo",
      deviceOS: "lender",
      deviceBrowser: "Lender",
      address: "::1",
      lastTimeAccessed: new Date(),
      userId: other_user_id,
      expirationDate: new Date(),
      refreshToken: otherRefreshToken,
    });
    await users.insertOne({
      _id: user_oid,
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
      id: user_id,
    });
    const { refreshToken, accessToken } = getValidTokens({
      isBorrower: false,
      isLender: true,
      isSupport: false,
      id: user_id,
    });
    const requestCookies = serialize("refreshToken", refreshToken);
    const response = await request
      .post("/graphql")
      .trustLocalhost()
      .send({
        extensions: {
          doc_id: "360b8a63b14154e6762d64c916371a6e",
        },
        query: "",
        variables: {
          input: {
            sessionId: other_session_gid,
          },
        },
        operationName: "revokeSessionMutation",
      })
      .set("Accept", "text/event-stream")
      .set("Authorization", accessToken)
      .set("Cookie", requestCookies);
    const stream = response.text.split("\n");
    const data = JSON.parse(stream[1].replace("data: ", ""));
    strictEqual(data.data.revokeSession.error, "");
    strictEqual(data.data.revokeSession.session.id, other_session_gid);
    ok(isBefore(data.data.revokeSession.session.expirationDate, new Date()));
  });

  it("RevokeSessionMutation: is same user", async () => {
    const users = dbInstance.collection<AuthUserMongo>("users");
    const sessions = dbInstance.collection<AuthUserSessions>("sessions");
    const user_oid = new ObjectId();
    const user_id = crypto.randomUUID();
    const other_session_oid = new ObjectId();
    const other_session_id = other_session_oid.toHexString();
    const other_session_gid = base64Name(other_session_id, "Session");
    await users.insertOne({
      _id: user_oid,
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
      id: user_id,
    });
    const { refreshToken, accessToken } = getValidTokens({
      isBorrower: false,
      isLender: true,
      isSupport: false,
      id: user_id,
    });
    await sessions.insertOne({
      _id: other_session_oid,
      applicationName: "Lerna Monorepo",
      deviceOS: "lender",
      deviceBrowser: "Lender",
      address: "::1",
      lastTimeAccessed: new Date(),
      userId: user_id,
      expirationDate: new Date(),
      refreshToken,
    });
    const requestCookies = serialize("refreshToken", refreshToken);
    const response = await request
      .post("/graphql")
      .trustLocalhost()
      .send({
        extensions: {
          doc_id: "360b8a63b14154e6762d64c916371a6e",
        },
        query: "",
        variables: {
          input: {
            sessionId: other_session_gid,
          },
        },
        operationName: "revokeSessionMutation",
      })
      .set("Accept", "text/event-stream")
      .set("Authorization", accessToken)
      .set("Cookie", requestCookies);
    const stream = response.text.split("\n");
    const data = JSON.parse(stream[1].replace("data: ", ""));
    strictEqual(data.data.revokeSession.error, "");
    strictEqual(data.data.revokeSession.session.id, other_session_gid);
    ok(isBefore(data.data.revokeSession.session.expirationDate, new Date()));
    const responseCookies = response.headers["set-cookie"][0];
    ok(responseCookies);
    const parsedCookies = parse(responseCookies);
    strictEqual(parsedCookies.refreshToken, "");
    const authorization = response.headers.authorization;
    strictEqual(authorization, undefined);
  });
});
