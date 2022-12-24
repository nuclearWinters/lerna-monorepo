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

describe("BlacklistUserMutation tests", () => {
  let client: MongoClient;
  let dbInstance: Db;

  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URL as string, {});
    dbInstance = client.db("auth");
    app.locals.db = dbInstance;
    app.locals.ch = { sendToQueue: jest.fn() };
    app.locals.rdb = { get: jest.fn(), set: jest.fn() };
  });

  afterAll(async () => {
    await client.close();
  });

  it("BlacklistUserMutation: success", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    await users.insertOne({
      _id: new ObjectId("000000000000000000000070"),
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
      id: "",
    });
    const response = await request
      .post("/graphql")
      .send({
        query: `mutation blacklistUserMutation($input: BlacklistUserInput!) {
          blacklistUser(input: $input) {
            error
          }
        }`,
        variables: {
          input: {},
        },
        operationName: "blacklistUserMutation",
      })
      .set("Accept", "application/json")
      .set(
        "Cookie",
        `refreshToken=${jwt.sign(
          {
            id: "wHHR1SUBT0dspoF4YUOw2",
            isBorrower: false,
            isLender: true,
            isSupport: false,
            refreshTokenExpireTime: 0,
          },
          "REFRESHSECRET",
          { expiresIn: "15m" }
        )}`
      )
      .set(
        "Authorization",
        jwt.sign(
          {
            id: "wHHR1SUBT0dspoF4YUOw2",
            isBorrower: false,
            isLender: true,
            isSupport: false,
            refreshTokenExpireTime: 0,
          },
          "ACCESSSECRET",
          { expiresIn: "3m" }
        )
      );
    expect(response.body.data.blacklistUser.error).toBeFalsy();
  });

  //
  it("BlacklistUserMutation: error", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: `mutation blacklistUserMutation($input: BlacklistUserInput!) {
          blacklistUser(input: $input) {
            error
          }
        }`,
        variables: {
          input: {},
        },
        operationName: "blacklistUserMutation",
      })
      .set("Accept", "application/json")
      .set("Cookie", `refreshToken=invalid`)
      .set("Authorization", "invalid");
    expect(response.body.data.blacklistUser.error).toBeTruthy();
  });
});
