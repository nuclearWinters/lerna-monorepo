import { app } from "../app";
import supertest from "supertest";
import { MongoClient, Db, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { UserMongo } from "../types";
import { jwt } from "../utils";

jest.mock("nanoid", () => ({
  customAlphabet: () => () => "wHHR1SUBT0dspoF4YUOw1",
}));

const request = supertest(app);

describe("ExtendSessionMutation tests", () => {
  let client: MongoClient;
  let dbInstance: Db;

  beforeAll(async () => {
    client = await MongoClient.connect(
      (global as unknown as { __MONGO_URI__: string }).__MONGO_URI__,
      {}
    );
    dbInstance = client.db("auth");
    app.locals.authdb = dbInstance;
    app.locals.ch = { sendToQueue: jest.fn() };
    app.locals.rdb = { get: jest.fn(), set: jest.fn() };
  });

  afterAll(async () => {
    await client.close();
  });

  it("ExtendSessionMutation: success", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    const _user_id = new ObjectId();
    const id = "wHHR1SUBT0dspoF4YUOw5";
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
    const response = await request
      .post("/graphql")
      .send({
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
      .set("Accept", "application/json")
      .set(
        "Cookie",
        `id=${id}; refreshToken=${jwt.sign(
          {
            id,
            isBorrower: false,
            isLender: true,
            isSupport: false,
            refreshTokenExpireTime: new Date().getTime() / 1000 + 900,
            exp: new Date().getTime() / 1000 + 900,
          },
          "REFRESHSECRET"
        )}`
      );
    expect(response.body.data.extendSession.error).toBeFalsy();
    expect(response.headers["set-cookie"]).toBeTruthy();
  });

  it("ExtendSessionMutation: error", async () => {
    const response = await request
      .post("/graphql")
      .send({
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
      .set("Accept", "application/json");
    expect(response.body.data.extendSession.error).toBeTruthy();
    expect(response.headers["set-cookie"]).toBeFalsy();
  });
});
