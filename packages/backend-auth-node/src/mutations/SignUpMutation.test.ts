import { main } from "../app";
import supertest from "supertest";
import { MongoClient, Db, ObjectId } from "mongodb";
import { UserMongo } from "../types";
import { RedisContainer, StartedRedisContainer } from "@testcontainers/redis";
import { createClient, RedisClientType } from "redis";
import TestAgent from "supertest/lib/agent";
import {
  AccountClient,
  AccountService,
} from "@lerna-monorepo/backend-utilities/protoAccount/account_grpc_pb";
import { AccountServer } from "@lerna-monorepo/backend-utilities/grpc";
import { credentials, Server, ServerCredentials } from "@grpc/grpc-js";

describe("SignUpMutation tests", () => {
  let client: MongoClient;
  let dbInstance: Db;
  let dbInstanceFintech: Db;
  let redisClient: RedisClientType;
  let request: TestAgent<supertest.Test>;
  let grpcClient: AccountClient;
  let startedRedisContainer: StartedRedisContainer;
  let grpcServer: Server;

  beforeAll(async () => {
    client = await MongoClient.connect(
      (global as unknown as { __MONGO_URI__: string }).__MONGO_URI__,
      {}
    );
    dbInstance = client.db(
      (global as unknown as { __MONGO_DB_NAME__: string }).__MONGO_DB_NAME__
    );
    dbInstanceFintech = client.db(
      (global as unknown as { __MONGO_DB_NAME__: string }).__MONGO_DB_NAME__ +
        "-fintech"
    );
    startedRedisContainer = await new RedisContainer().start();
    redisClient = createClient({
      url: startedRedisContainer.getConnectionUrl(),
    });
    await redisClient.connect();
    grpcServer = new Server();
    grpcServer.addService(AccountService, AccountServer(dbInstanceFintech));
    grpcServer.bindAsync(
      "localhost:1973",
      ServerCredentials.createInsecure(),
      (err) => {
        if (err) {
          return;
        }
      }
    );
    grpcClient = new AccountClient(
      `localhost:1973`,
      credentials.createInsecure()
    );
    const server = await main(dbInstance, redisClient, grpcClient);
    request = supertest(server, { http2: true });
  });

  afterAll(async () => {
    grpcClient.close();
    grpcServer.forceShutdown();
    await redisClient.disconnect();
    await startedRedisContainer.stop();
    await client.close();
  });

  it("SignUpMutation: success", async () => {
    const email = "anrp1@gmail.com";
    const users = dbInstance.collection<UserMongo>("users");
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
    expect(data.data.signUp.error).toBeFalsy();
    const new_user_data = await users.findOne({ email });
    if (!new_user_data) {
      throw new Error("User not found.");
    }
    const {
      _id: new_user_oid,
      password: new_password,
      id: new_user_id,
      ...new_user_other_data
    } = new_user_data;
    expect(ObjectId.isValid(new_user_oid)).toBeTruthy();
    expect(new_password).toBeTruthy();
    expect(new_user_id).toBeTruthy();
    expect(new_user_other_data).toEqual({
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
    const users = dbInstance.collection<UserMongo>("users");
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
    expect(data.data.signUp.error).toBe("Email already in use");
    expect(data.data.signUp.refreshToken).toBeFalsy();
    const new_user_data = await users.findOne({ email: "anrp1@gmail.com" });
    if (!new_user_data) {
      throw new Error("User not found.");
    }
    const {
      _id: new_user_oid,
      password: new_password,
      id: new_user_id,
      ...new_user_other_data
    } = new_user_data;
    expect(ObjectId.isValid(new_user_oid)).toBeTruthy();
    expect(new_password).toBeTruthy();
    expect(new_user_id).toBeTruthy();
    expect(new_user_other_data).toEqual({
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
    const users = dbInstance.collection<UserMongo>("users");
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
    expect(data.data.signUp.error).toBeFalsy();
    const new_user_data = await users.findOne({ email: "anrp2@gmail.com" });
    if (!new_user_data) {
      throw new Error("User not found.");
    }
    const {
      _id: new_user_oid,
      password: new_password,
      id: new_user_id,
      ...new_user_other_data
    } = new_user_data;
    expect(ObjectId.isValid(new_user_oid)).toBeTruthy();
    expect(new_password).toBeTruthy();
    expect(new_user_id).toBeTruthy();
    expect(new_user_other_data).toEqual({
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
