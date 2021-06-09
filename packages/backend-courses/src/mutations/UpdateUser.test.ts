import { app } from "../app";
import supertest from "supertest";
import { Db, MongoClient, ObjectId } from "mongodb";
import { UserMongo } from "../types";
import { base64Name, jwt } from "../utils";
import { ACCESSSECRET } from "../config";

const request = supertest(app);

describe("UpdateUser tests", () => {
  let client: MongoClient;
  let dbInstance: Db;

  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URL as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    dbInstance = client.db("fintech");
    app.locals.db = dbInstance;
  });

  afterAll(async () => {
    await client.close();
  });

  it("test UpdateUser valid access token", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    await users.insertOne({
      _id: new ObjectId("000000000000000000000007"),
      name: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      RFC: "",
      CURP: "",
      clabe: "",
      mobile: "",
      accountAvailable: 0,
      investments: [],
    });
    const response = await request
      .post("/api/graphql")
      .send({
        query: `mutation UpdateUserMutation($input: UpdateUserInput!) {
          updateUser(input: $input) {
            error
            validAccessToken
          }
        }`,
        variables: {
          input: {
            user_gid: base64Name("000000000000000000000007", "User"),
            name: "Armando Narcizo",
            apellidoPaterno: "Rueda",
            apellidoMaterno: "Peréz",
            RFC: "RFC",
            CURP: "CURP",
            clabe: "clabe",
            mobile: "9831228788",
          },
        },
        operationName: "UpdateUserMutation",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        JSON.stringify({
          accessToken: jwt.sign(
            { _id: "000000000000000000000007", email: "" },
            ACCESSSECRET,
            { expiresIn: "15m" }
          ),
          refreshToken: "validRefreshToken",
        })
      );
    expect(response.body.data.updateUser.error).toBeFalsy();
    expect(response.body.data.updateUser.validAccessToken).toBeTruthy();
  });
});
