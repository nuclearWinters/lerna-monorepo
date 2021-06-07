import { app } from "../app";
import supertest from "supertest";
import { MongoClient, Db } from "mongodb";
import { UserMongo } from "../types";

const request = supertest(app);

describe("SignUpMutation tests", () => {
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
    app.locals.rdb = { get: jest.fn() };
  });

  afterAll(async () => {
    delete app.locals.db;
    await dbInstance
      .collection<UserMongo>("users")
      .deleteMany({ email: "anrp1@gmail.com" });
    await client.close();
  });

  it("SignUpMutation: success", async () => {
    const response = await request
      .post("/auth/graphql")
      .send({
        query: `mutation signUpMutation($input: SignUpInput!) {
          signUp(input: $input) {
            error
            accessToken
            refreshToken
          }
        }`,
        variables: {
          input: {
            password: "correct",
            email: "anrp1@gmail.com",
          },
        },
        operationName: "signUpMutation",
      })
      .set("Accept", "application/json");
    expect(response.body.data.signUp.error).toBeFalsy();
    expect(response.body.data.signUp.refreshToken).toBeTruthy();
    expect(response.body.data.signUp.accessToken).toBeTruthy();
  });

  it("SignUpMutation: user already exists", async () => {
    const response = await request
      .post("/auth/graphql")
      .send({
        query: `mutation signUpMutation($input: SignUpInput!) {
          signUp(input: $input) {
            error
            accessToken
            refreshToken
          }
        }`,
        variables: {
          input: {
            password: "correct",
            email: "anrp1@gmail.com",
          },
        },
        operationName: "signUpMutation",
      })
      .set("Accept", "application/json");
    expect(response.body.data.signUp.error).toBe(
      "El email ya esta siendo usado."
    );
    expect(response.body.data.signUp.refreshToken).toBeFalsy();
    expect(response.body.data.signUp.accessToken).toBeFalsy();
  });
});
