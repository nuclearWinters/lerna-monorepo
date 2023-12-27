import { app } from "../app";
import supertest from "supertest";
import { Db, MongoClient, ObjectId } from "mongodb";
import { UserMongo } from "../types";

jest.mock("nanoid", () => ({
  customAlphabet: () => () => "wHHR1SUBT0dspoF4YUOw1",
}));

const request = supertest(app);

describe("UpdateUser tests", () => {
  let client: MongoClient;
  let dbInstance: Db;

  beforeAll(async () => {
    client = await MongoClient.connect(
      (global as unknown as { __MONGO_URI__: string }).__MONGO_URI__,
      {}
    );
    dbInstance = client.db("auth");
    app.locals.authdb = dbInstance;
  });

  afterAll(async () => {
    await client.close();
  });

  it("test UpdateUser valid access token", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    const _id = new ObjectId();
    const id = "wHHR1SUBT0dspoF4YUOw6";
    await users.insertOne({
      _id,
      name: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      RFC: "",
      CURP: "",
      clabe: "",
      mobile: "",
      isLender: true,
      isBorrower: false,
      isSupport: false,
      email: "armando10@gmail.com",
      password: "",
      language: "default",
      id,
    });
    const response = await request
      .post("/graphql")
      .send({
        query: `mutation UpdateUserMutation($input: UpdateUserInput!) {
          updateUser(input: $input) {
            error
          }
        }`,
        variables: {
          input: {
            name: "Armando Narcizo",
            apellidoPaterno: "Rueda",
            apellidoMaterno: "Peréz",
            RFC: "RFC",
            CURP: "CURP",
            clabe: "clabe",
            mobile: "9831228788",
            language: "ES",
            email: "armando10@gmail.com",
          },
        },
        operationName: "UpdateUserMutation",
      })
      .set("Accept", "application/json")
      .set("Cookie", "id=" + id);
    expect(response.body.data.updateUser.error).toBeFalsy();
    const user = await users.findOne({
      _id,
    });
    expect(user).toEqual({
      _id,
      email: "armando10@gmail.com",
      isBorrower: false,
      isLender: true,
      isSupport: false,
      password: "",
      language: "es",
      mobile: "9831228788",
      name: "Armando Narcizo",
      CURP: "CURP",
      RFC: "RFC",
      apellidoMaterno: "Peréz",
      apellidoPaterno: "Rueda",
      clabe: "clabe",
      id,
    });
  });
});
