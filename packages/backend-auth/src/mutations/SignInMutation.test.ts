import { app } from "../app";
import supertest from "supertest";
import { MongoClient, Db, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { UserMongo } from "../types";

const request = supertest(app);

describe("SignInMutation tests", () => {
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
      .deleteMany({ _id: new ObjectId("000000000000000000000020") });
    await client.close();
  });

  it("SignInMutation: user exists and password is correct", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    await users.insertOne({
      _id: new ObjectId("000000000000000000000020"),
      email: "armandocorrect@hotmail.com",
      password: bcrypt.hashSync("correct", 12),
      isLender: true,
      isBorrower: false,
      isSupport: false,
    });
    const response = await request
      .post("/auth/graphql")
      .send({
        query: `mutation signInMutation($input: SignInInput!) {
          signIn(input: $input) {
            error
            accessToken
            refreshToken
          }
        }`,
        variables: {
          input: {
            password: "correct",
            email: "armandocorrect@hotmail.com",
          },
        },
        operationName: "signInMutation",
      })
      .set("Accept", "application/json");
    expect(response.body.data.signIn.error).toBeFalsy();
    expect(response.body.data.signIn.refreshToken).toBeTruthy();
    expect(response.body.data.signIn.accessToken).toBeTruthy();
  });

  it("SignInMutation: user NOT exists", async () => {
    const response = await request
      .post("/auth/graphql")
      .send({
        query: `mutation signInMutation($input: SignInInput!) {
          signIn(input: $input) {
            error
            accessToken
            refreshToken
          }
        }`,
        variables: {
          input: {
            password: "correct",
            email: "armandonfail@hotmail.com",
          },
        },
        operationName: "signInMutation",
      })
      .set("Accept", "application/json");
    expect(response.body.data.signIn.error).toBe("El usuario no existe.");
    expect(response.body.data.signIn.refreshToken).toBeFalsy();
    expect(response.body.data.signIn.accessToken).toBeFalsy();
  });

  it("SignInMutation: password is NOT correct", async () => {
    const response = await request
      .post("/auth/graphql")
      .send({
        query: `mutation signInMutation($input: SignInInput!) {
          signIn(input: $input) {
            error
            accessToken
            refreshToken
          }
        }`,
        variables: {
          input: {
            password: "incorrect",
            email: "armandocorrect@hotmail.com",
          },
        },
        operationName: "signInMutation",
      })
      .set("Accept", "application/json");
    expect(response.body.data.signIn.error).toBe("La contraseña no coincide.");
    expect(response.body.data.signIn.refreshToken).toBeFalsy();
    expect(response.body.data.signIn.accessToken).toBeFalsy();
  });
});
