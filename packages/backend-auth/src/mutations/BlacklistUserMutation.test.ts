import { app } from "../app";
import supertest from "supertest";
import { MongoClient, Db, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { UserMongo } from "../types";
import { base64Name, jwt } from "../utils";
import { ACCESSSECRET } from "../config";

const request = supertest(app);

describe("BlacklistUserMutation tests", () => {
  let client: MongoClient;
  let dbInstance: Db;

  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URL as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    dbInstance = client.db("auth");
    app.locals.db = dbInstance;
    app.locals.ch = { sendToQueue: jest.fn() };
    app.locals.rdb = { get: jest.fn(), set: jest.fn() };
  });

  afterAll(async () => {
    delete app.locals.db;
    await dbInstance
      .collection<UserMongo>("users")
      .deleteMany({ _id: new ObjectId("000000000000000000000070") });
    await client.close();
  });

  it("BlacklistUserMutation: success", async (done) => {
    const users = dbInstance.collection<UserMongo>("users");
    await users.insertOne({
      _id: new ObjectId("000000000000000000000070"),
      email: "armandocorrect@hotmail.com",
      password: bcrypt.hashSync("correct", 12),
      isLender: true,
      isBorrower: false,
      isSupport: false,
    });
    const response = await request
      .post("/auth/graphql")
      .send({
        query: `mutation blacklistUserMutation($input: BlacklistUserInput!) {
          blacklistUser(input: $input) {
            error
            validAccessToken
          }
        }`,
        variables: {
          input: {
            user_gid: base64Name("000000000000000000000070", "User"),
          },
        },
        operationName: "blacklistUserMutation",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        JSON.stringify({
          accessToken: jwt.sign(
            {
              _id: "000000000000000000000070",
              email: "",
              isSupport: false,
              isBorrower: false,
              isLender: true,
            },
            ACCESSSECRET,
            { expiresIn: "15m" }
          ),
          refreshToken: "validRefreshToken",
        })
      );
    expect(response.body.data.blacklistUser.error).toBeFalsy();
    expect(response.body.data.blacklistUser.validAccessToken).toBeFalsy();
    done();
  });

  it("BlacklistUserMutation: error", async (done) => {
    const response = await request
      .post("/auth/graphql")
      .send({
        query: `mutation blacklistUserMutation($input: BlacklistUserInput!) {
          blacklistUser(input: $input) {
            error
            validAccessToken
          }
        }`,
        variables: {
          input: {
            user_gid: base64Name("000000000000000000000080", "User"),
          },
        },
        operationName: "blacklistUserMutation",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        JSON.stringify({
          accessToken: jwt.sign(
            {
              _id: "000000000000000000000060",
              email: "",
              isSupport: false,
              isBorrower: false,
              isLender: true,
            },
            ACCESSSECRET,
            { expiresIn: "15m" }
          ),
          refreshToken: "validRefreshToken",
        })
      );
    expect(response.body.data.blacklistUser.error).toBeTruthy();
    expect(response.body.data.blacklistUser.validAccessToken).toBeFalsy();
    done();
  });
});
