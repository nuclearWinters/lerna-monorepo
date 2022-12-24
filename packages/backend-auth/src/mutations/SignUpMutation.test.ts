import { app } from "../app";
import supertest from "supertest";
import { MongoClient, Db } from "mongodb";
import { UserMongo } from "../types";
import { client as grpcClient } from "../utils";
import { SurfaceCall } from "@grpc/grpc-js/build/src/call";

jest.mock("nanoid", () => ({
  customAlphabet: () => () => "wHHR1SUBT0dspoF4YUOwm",
}));

const request = supertest(app);

describe("SignUpMutation tests", () => {
  let client: MongoClient;
  let dbInstance: Db;

  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URL as string, {});
    dbInstance = client.db("auth");
    app.locals.db = dbInstance;
    app.locals.ch = { sendToQueue: jest.fn() };
    app.locals.rdb = { get: jest.fn() };
  });

  afterAll(async () => {
    await client.close();
  });

  it("SignUpMutation: success", async () => {
    jest
      .spyOn(grpcClient, "createUser")
      .mockImplementationOnce((_request, callback: unknown) => {
        const callbackTyped = callback as (
          error: null,
          response: { getDone: () => string }
        ) => void;
        callbackTyped(null, {
          getDone: () => "",
        });
        return {} as SurfaceCall;
      });
    const users = dbInstance.collection<UserMongo>("users");
    const response = await request
      .post("/graphql")
      .send({
        query: `mutation signUpMutation($input: SignUpInput!) {
          signUp(input: $input) {
            error
          }
        }`,
        variables: {
          input: {
            password: "correct",
            email: "anrp1@gmail.com",
            isLender: true,
            language: "EN",
          },
        },
        operationName: "signUpMutation",
      })
      .set("Accept", "application/json");
    expect(response.body.data.signUp.error).toBeFalsy();
    const user = await users.findOne({ email: "anrp1@gmail.com" });
    expect({ ...user, _id: "", password: "" }).toEqual({
      _id: "",
      email: "anrp1@gmail.com",
      isBorrower: false,
      isLender: true,
      isSupport: false,
      password: "",
      language: "en",
      mobile: "",
      name: "",
      CURP: "",
      RFC: "",
      apellidoMaterno: "",
      apellidoPaterno: "",
      clabe: "",
      id: "wHHR1SUBT0dspoF4YUOwm",
    });
  });

  it("SignUpMutation: user already exists", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    const response = await request
      .post("/graphql")
      .send({
        query: `mutation signUpMutation($input: SignUpInput!) {
          signUp(input: $input) {
            error
          }
        }`,
        variables: {
          input: {
            password: "correct",
            email: "anrp1@gmail.com",
            isLender: true,
            language: "EN",
          },
        },
        operationName: "signUpMutation",
      })
      .set("Accept", "application/json");
    expect(response.body.data.signUp.error).toBe(
      "El email ya esta siendo usado."
    );
    expect(response.body.data.signUp.refreshToken).toBeFalsy();
    const user = await users.findOne({ email: "anrp1@gmail.com" });
    expect({ ...user, _id: "", password: "" }).toEqual({
      _id: "",
      email: "anrp1@gmail.com",
      isBorrower: false,
      isLender: true,
      isSupport: false,
      password: "",
      language: "en",
      mobile: "",
      name: "",
      CURP: "",
      RFC: "",
      apellidoMaterno: "",
      apellidoPaterno: "",
      clabe: "",
      id: "wHHR1SUBT0dspoF4YUOwm",
    });
  });

  it("SignUpMutation: success is borrower", async () => {
    jest
      .spyOn(grpcClient, "createUser")
      .mockImplementationOnce((_request, callback: unknown) => {
        const callbackTyped = callback as (
          error: null,
          response: { getDone: () => string }
        ) => void;
        callbackTyped(null, {
          getDone: () => "",
        });
        return {} as SurfaceCall;
      });
    const users = dbInstance.collection<UserMongo>("users");
    const response = await request
      .post("/graphql")
      .send({
        query: `mutation signUpMutation($input: SignUpInput!) {
          signUp(input: $input) {
            error
          }
        }`,
        variables: {
          input: {
            password: "correct",
            email: "anrp2@gmail.com",
            isLender: false,
            language: "EN",
          },
        },
        operationName: "signUpMutation",
      })
      .set("Accept", "application/json");
    expect(response.body.data.signUp.error).toBeFalsy();
    const user = await users.findOne({ email: "anrp2@gmail.com" });
    expect({ ...user, _id: "", password: "" }).toEqual({
      _id: "",
      email: "anrp2@gmail.com",
      isBorrower: true,
      isLender: false,
      isSupport: false,
      password: "",
      language: "en",
      mobile: "",
      name: "",
      CURP: "",
      RFC: "",
      apellidoMaterno: "",
      apellidoPaterno: "",
      clabe: "",
      id: "wHHR1SUBT0dspoF4YUOwm",
    });
  });
});
