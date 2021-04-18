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
  });

  afterAll(async () => {
    delete app.locals.db;
    await client.close();
  });

  it("GetTokenMutation: user exists and password is correct", async (done) => {
    const users = dbInstance.collection("users");
    const mockUser = {
      email: "armandocorrect@hotmail.com",
      password: bcrypt.hashSync("correct", 12),
    };
    await users.insertOne(mockUser);
    const response = await request
      .post("/auth/graphql")
      .send({
        query:
          "mutation createUserMutation($input: CreateUserInput\u0021) {\n  createUser(input: $input) {\n    error\n    refreshToken\n    accessToken\n  }\n}\n\nmutation getTokenMutation($input: GetTokenInput\u0021) {\n  getToken(input: $input) {\n    error\n    refreshToken\n    accessToken\n  }\n}",
        variables: {
          input: {
            password: "correct",
            email: "armandocorrect@hotmail.com",
          },
        },
        operationName: "getTokenMutation",
      })
      .set("Accept", "application/json");
    expect(response.body.data.getToken.error).toBe(null);
    expect(response.body.data.getToken.refreshToken).toBeTruthy();
    expect(response.body.data.getToken.accessToken).toBeTruthy();
    done();
  });

  it("GetTokenMutation: user NOT exists", async (done) => {
    const response = await request
      .post("/auth/graphql")
      .send({
        query:
          "mutation createUserMutation($input: CreateUserInput\u0021) {\n  createUser(input: $input) {\n    error\n    refreshToken\n    accessToken\n  }\n}\n\nmutation getTokenMutation($input: GetTokenInput\u0021) {\n  getToken(input: $input) {\n    error\n    refreshToken\n    accessToken\n  }\n}",
        variables: {
          input: {
            password: "correct",
            email: "armandonfail@hotmail.com",
          },
        },
        operationName: "getTokenMutation",
      })
      .set("Accept", "application/json");
    expect(response.body.data.getToken.error).toBe("El usuario no existe.");
    expect(response.body.data.getToken.refreshToken).toBeFalsy();
    expect(response.body.data.getToken.accessToken).toBeFalsy();
    done();
  });

  it("GetTokenMutation: password is NOT correct", async (done) => {
    const response = await request
      .post("/auth/graphql")
      .send({
        query:
          "mutation createUserMutation($input: CreateUserInput\u0021) {\n  createUser(input: $input) {\n    error\n    refreshToken\n    accessToken\n  }\n}\n\nmutation getTokenMutation($input: GetTokenInput\u0021) {\n  getToken(input: $input) {\n    error\n    refreshToken\n    accessToken\n  }\n}",
        variables: {
          input: {
            password: "incorrect",
            email: "armandocorrect@hotmail.com",
          },
        },
        operationName: "getTokenMutation",
      })
      .set("Accept", "application/json");
    expect(response.body.data.getToken.error).toBe(
      "La contraseña no coincide."
    );
    expect(response.body.data.getToken.refreshToken).toBeFalsy();
    expect(response.body.data.getToken.accessToken).toBeFalsy();
    done();
  });

  it("CreateUserMutation: success", async (done) => {
    const response = await request
      .post("/auth/graphql")
      .send({
        query:
          "mutation createUserMutation($input: CreateUserInput\u0021) {\n  createUser(input: $input) {\n    error\n    refreshToken\n    accessToken\n  }\n}\n\nmutation getTokenMutation($input: GetTokenInput\u0021) {\n  getToken(input: $input) {\n    error\n    refreshToken\n    accessToken\n  }\n}",
        variables: {
          input: {
            password: "correct",
            email: "armandocorrect@gmail.com",
          },
        },
        operationName: "createUserMutation",
      })
      .set("Accept", "application/json");
    expect(response.body.data.createUser.error).toBe(null);
    expect(response.body.data.createUser.refreshToken).toBeTruthy();
    expect(response.body.data.createUser.accessToken).toBeTruthy();
    done();
  });

  it("CreateUserMutation: user already exists", async (done) => {
    const response = await request
      .post("/auth/graphql")
      .send({
        query:
          "mutation createUserMutation($input: CreateUserInput\u0021) {\n  createUser(input: $input) {\n    error\n    refreshToken\n    accessToken\n  }\n}\n\nmutation getTokenMutation($input: GetTokenInput\u0021) {\n  getToken(input: $input) {\n    error\n    refreshToken\n    accessToken\n  }\n}",
        variables: {
          input: {
            password: "correct",
            email: "armandocorrect@gmail.com",
          },
        },
        operationName: "createUserMutation",
      })
      .set("Accept", "application/json");
    expect(response.body.data.createUser.error).toBe(
      "El email ya esta siendo usado."
    );
    expect(response.body.data.createUser.refreshToken).toBeFalsy();
    expect(response.body.data.createUser.accessToken).toBeFalsy();
    done();
  });
});
