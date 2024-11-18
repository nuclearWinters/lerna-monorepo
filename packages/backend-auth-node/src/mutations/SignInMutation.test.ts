import type { AccountClient } from "@repo/grpc-utils/protoAccount/account_grpc_pb";
import type { AuthUserMongo } from "@repo/mongo-utils";
import { RedisContainer } from "@testcontainers/redis";
import bcrypt from "bcryptjs";
import { MongoClient, ObjectId } from "mongodb";
import { createClient } from "redis";
import supertest from "supertest";
import { main } from "../app.ts";
import { MongoDBContainer } from "@testcontainers/mongodb";
import { after, describe, it } from "node:test";
import { ok, strictEqual } from "node:assert";

describe("SignInMutation tests", async () => {
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

  it("SignInMutation: user exists and password is correct", async () => {
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
    const response = await request
      .post("/graphql")
      .trustLocalhost()
      .send({
        extensions: {
          doc_id: "95e2b3e28198459a859cd2b7075ac533",
        },
        query: "",
        variables: {
          input: {
            password: "correct",
            email: "armandocorrect@hotmail.com",
          },
        },
        operationName: "signInMutation",
      })
      .set("Accept", "text/event-stream");
    const stream = response.text.split("\n");
    const data = JSON.parse(stream[1].replace("data: ", ""));
    strictEqual(data.data.signIn.error, "");
    ok(response.headers["set-cookie"]);
  });

  it("SignInMutation: user NOT exists", async () => {
    const response = await request
      .post("/graphql")
      .trustLocalhost()
      .send({
        extensions: {
          doc_id: "95e2b3e28198459a859cd2b7075ac533",
        },
        query: "",
        variables: {
          input: {
            password: "correct",
            email: "armandonfail@hotmail.com",
          },
        },
        operationName: "signInMutation",
      })
      .set("Accept", "text/event-stream");
    const stream = response.text.split("\n");
    const data = JSON.parse(stream[1].replace("data: ", ""));
    strictEqual(data.data.signIn.error, "User do not exists");
    strictEqual(response.headers["set-cookie"], undefined);
  });

  it("SignInMutation: password is NOT correct", async () => {
    const response = await request
      .post("/graphql")
      .trustLocalhost()
      .send({
        extensions: {
          doc_id: "95e2b3e28198459a859cd2b7075ac533",
        },
        query: "",
        variables: {
          input: {
            password: "incorrect",
            email: "armandocorrect@hotmail.com",
          },
        },
        operationName: "signInMutation",
      })
      .set("Accept", "text/event-stream");
    const stream = response.text.split("\n");
    const data = JSON.parse(stream[1].replace("data: ", ""));
    strictEqual(data.data.signIn.error, "Incorrect password");
    strictEqual(response.headers["set-cookie"], undefined);
  });
});
