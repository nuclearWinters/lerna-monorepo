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
    await client.close();
  });

  it("SignUpMutation: success", async () => {
    const users = dbInstance.collection<UserMongo>("users");
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
            isLender: true,
          },
        },
        operationName: "signUpMutation",
      })
      .set("Accept", "application/json");
    expect(response.body.data.signUp.error).toBeFalsy();
    expect(response.body.data.signUp.refreshToken).toBeTruthy();
    expect(response.body.data.signUp.accessToken).toBeTruthy();
    const user = await users.findOne({ email: "anrp1@gmail.com" });
    expect({ ...user, _id: "", password: "" }).toEqual({
      _id: "",
      email: "anrp1@gmail.com",
      isBorrower: false,
      isLender: true,
      isSupport: false,
      password: "",
    });
  });

  it("SignUpMutation: user already exists", async () => {
    const users = dbInstance.collection<UserMongo>("users");
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
            isLender: true,
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
    const user = await users.findOne({ email: "anrp1@gmail.com" });
    expect({ ...user, _id: "", password: "" }).toEqual({
      _id: "",
      email: "anrp1@gmail.com",
      isBorrower: false,
      isLender: true,
      isSupport: false,
      password: "",
    });
  });

  it("SignUpMutation: success is borrower", async () => {
    const users = dbInstance.collection<UserMongo>("users");
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
            email: "anrp2@gmail.com",
            isLender: false,
          },
        },
        operationName: "signUpMutation",
      })
      .set("Accept", "application/json");
    expect(response.body.data.signUp.error).toBeFalsy();
    expect(response.body.data.signUp.refreshToken).toBeTruthy();
    expect(response.body.data.signUp.accessToken).toBeTruthy();
    const user = await users.findOne({ email: "anrp2@gmail.com" });
    expect({ ...user, _id: "", password: "" }).toEqual({
      _id: "",
      email: "anrp2@gmail.com",
      isBorrower: true,
      isLender: false,
      isSupport: false,
      password: "",
    });
  });
});
