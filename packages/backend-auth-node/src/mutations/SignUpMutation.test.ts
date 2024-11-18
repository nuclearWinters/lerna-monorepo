import { Server, ServerCredentials, credentials } from "@grpc/grpc-js";
import { AccountServer } from "@repo/grpc-utils";
import { AccountClient, AccountService } from "@repo/grpc-utils/protoAccount/account_grpc_pb";
import type { AuthUserMongo } from "@repo/mongo-utils";
import { RedisContainer } from "@testcontainers/redis";
import { MongoClient, ObjectId } from "mongodb";
import { createClient } from "redis";
import supertest from "supertest";
import { main } from "../app.ts";
import { MongoDBContainer } from "@testcontainers/mongodb";
import { after, describe, it } from "node:test";
import { ok, strictEqual, deepStrictEqual } from "node:assert";

describe("SignUpMutation tests", async () => {
  const startedRedisContainer = await new RedisContainer().start();
  const startedMongoContainer = await new MongoDBContainer().start();
  const client = await MongoClient.connect(startedMongoContainer.getConnectionString(), { directConnection: true });
  const dbInstance = client.db("auth");
  const dbInstanceFintech = client.db("fintech");
  const redisClient = createClient({
    url: startedRedisContainer.getConnectionUrl(),
  });
  await redisClient.connect();
  const grpcClient = new AccountClient("localhost:1973", credentials.createInsecure());
  const grpcServer = new Server();
  grpcServer.addService(AccountService, AccountServer(dbInstanceFintech));
  grpcServer.bindAsync("localhost:1973", ServerCredentials.createInsecure(), (err) => {
    if (err) {
      return;
    }
  });
  const server = await main(dbInstance, redisClient, grpcClient);
  const request = supertest(server, { http2: true });

  after(async () => {
    grpcClient.close();
    grpcServer.forceShutdown();
    await redisClient.disconnect();
    await startedRedisContainer.stop();
    await client.close();
  });

  it("SignUpMutation: success", async () => {
    const email = "anrp1@gmail.com";
    const users = dbInstance.collection<AuthUserMongo>("users");
    const response = await request
      .post("/graphql")
      .trustLocalhost()
      .send({
        extensions: {
          doc_id: "0780cb2c2df8b07a96bc5e98037d56fa",
        },
        query: "",
        variables: {
          input: {
            password: "correct",
            email,
            isLender: true,
            language: "EN",
          },
        },
        operationName: "signUpMutation",
      })
      .set("Accept", "text/event-stream");
    const stream = response.text.split("\n");
    const data = JSON.parse(stream[1].replace("data: ", ""));
    strictEqual(data.data.signUp.error, "");
    const new_user_data = await users.findOne({ email });
    if (!new_user_data) {
      throw new Error("User not found.");
    }
    const { _id: new_user_oid, password: new_password, id: new_user_id, ...new_user_other_data } = new_user_data;
    ok(ObjectId.isValid(new_user_oid));
    ok(new_password);
    ok(new_user_id);
    deepStrictEqual(new_user_other_data, {
      email,
      isBorrower: false,
      isLender: true,
      isSupport: false,
      language: "en",
      mobile: "",
      name: "",
      CURP: "",
      RFC: "",
      apellidoMaterno: "",
      apellidoPaterno: "",
      clabe: "",
    });
  });

  it("SignUpMutation: user already exists", async () => {
    const email = "anrp1@gmail.com";
    const users = dbInstance.collection<AuthUserMongo>("users");
    const response = await request
      .post("/graphql")
      .trustLocalhost()
      .send({
        extensions: {
          doc_id: "0780cb2c2df8b07a96bc5e98037d56fa",
        },
        query: "",
        variables: {
          input: {
            password: "correct",
            email,
            isLender: true,
            language: "EN",
          },
        },
        operationName: "signUpMutation",
      })
      .set("Accept", "text/event-stream");
    const stream = response.text.split("\n");
    const data = JSON.parse(stream[1].replace("data: ", ""));
    strictEqual(data.data.signUp.error, "Email already in use");
    strictEqual(data.data.signUp.refreshToken, undefined);
    const new_user_data = await users.findOne({ email: "anrp1@gmail.com" });
    if (!new_user_data) {
      throw new Error("User not found.");
    }
    const { _id: new_user_oid, password: new_password, id: new_user_id, ...new_user_other_data } = new_user_data;
    ok(ObjectId.isValid(new_user_oid));
    ok(new_password);
    ok(new_user_id);
    deepStrictEqual(new_user_other_data, {
      email,
      isBorrower: false,
      isLender: true,
      isSupport: false,
      language: "en",
      mobile: "",
      name: "",
      CURP: "",
      RFC: "",
      apellidoMaterno: "",
      apellidoPaterno: "",
      clabe: "",
    });
  });

  it("SignUpMutation: success is borrower", async () => {
    const email = "anrp2@gmail.com";
    const users = dbInstance.collection<AuthUserMongo>("users");
    const response = await request
      .post("/graphql")
      .trustLocalhost()
      .send({
        extensions: {
          doc_id: "0780cb2c2df8b07a96bc5e98037d56fa",
        },
        query: "",
        variables: {
          input: {
            password: "correct",
            email,
            isLender: false,
            language: "EN",
          },
        },
        operationName: "signUpMutation",
      })
      .set("Accept", "text/event-stream");
    const stream = response.text.split("\n");
    const data = JSON.parse(stream[1].replace("data: ", ""));
    strictEqual(data.data.signUp.error, "");
    const new_user_data = await users.findOne({ email: "anrp2@gmail.com" });
    if (!new_user_data) {
      throw new Error("User not found.");
    }
    const { _id: new_user_oid, password: new_password, id: new_user_id, ...new_user_other_data } = new_user_data;
    ok(ObjectId.isValid(new_user_oid));
    ok(new_password);
    ok(new_user_id);
    deepStrictEqual(new_user_other_data, {
      email,
      isBorrower: true,
      isLender: false,
      isSupport: false,
      language: "en",
      mobile: "",
      name: "",
      CURP: "",
      RFC: "",
      apellidoMaterno: "",
      apellidoPaterno: "",
      clabe: "",
    });
  });
});
