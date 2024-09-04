import { main } from "../app";
import supertest from "supertest";
import { MongoClient, Db, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { UserMongo } from "../types";
import { createClient, RedisClientType } from "redis";
import TestAgent from "supertest/lib/agent";
import { RedisContainer, StartedRedisContainer } from "@testcontainers/redis";
import { AccountClient } from "@lerna-monorepo/backend-utilities";

describe("SignInMutation tests", () => {
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

  it("SignInMutation: user exists and password is correct", async () => {
    const users = dbInstance.collection<UserMongo>("users");
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
    const data = JSON.parse(stream[3].replace("data: ", ""));
    expect(data.data.signIn.error).toBeFalsy();
    expect(response.headers["set-cookie"]).toBeTruthy();
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
    const data = JSON.parse(stream[3].replace("data: ", ""));
    expect(data.data.signIn.error).toBe("User do not exists");
    expect(response.headers["set-cookie"]).toBeFalsy();
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
    const data = JSON.parse(stream[3].replace("data: ", ""));
    expect(data.data.signIn.error).toBe("Incorrect password");
    expect(response.headers["set-cookie"]).toBeFalsy();
  });
});
