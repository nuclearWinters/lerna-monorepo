import { app } from "./app";
import supertest from "supertest";
import { MongoClient, Db } from "mongodb";
import bcrypt from "bcryptjs";

const request = supertest(app);

describe("supertest example with mongodb", () => {
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
  });

  afterAll(async () => {
    delete app.locals.db;
    await client.close();
  });

  it("SignInMutation: user exists and password is correct", async (done) => {
    const users = dbInstance.collection("users");
    const mockUser = {
      email: "armandocorrect@hotmail.com",
      password: bcrypt.hashSync("correct", 12),
    };
    await users.insertOne(mockUser);
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
    done();
  });

  it("SignInMutation: user NOT exists", async (done) => {
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
    done();
  });

  it("SignInMutation: password is NOT correct", async (done) => {
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
    done();
  });

  it("SignUpMutation: success", async (done) => {
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
            email: "armandocorrect@gmail.com",
          },
        },
        operationName: "signUpMutation",
      })
      .set("Accept", "application/json");
    expect(response.body.data.signUp.error).toBeFalsy();
    expect(response.body.data.signUp.refreshToken).toBeTruthy();
    expect(response.body.data.signUp.accessToken).toBeTruthy();
    done();
  });

  it("SignUpMutation: user already exists", async (done) => {
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
            email: "armandocorrect@gmail.com",
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
    done();
  });
});
