import { app } from "./app";
import supertest from "supertest";
import { Db, MongoClient, ObjectId } from "mongodb";
import { UserMongo } from "./types";
import { jwt } from "./utils";

const request = supertest(app);

describe("QueryUser tests", () => {
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

  it("test QueryUser valid access token", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    await users.insertMany([
      {
        _id: new ObjectId("000000000000000000000060"),
        accountAvailable: 50000,
        investments: [],
      },
    ]);
    const response = await request
      .post("/api/graphql")
      .send({
        query: `query GetUser($id: String!) {
          user(id: $id) {
            id
            accountAvailable
            investments {
              _id_loan
            }
          }  
        }`,
        variables: {
          id: "000000000000000000000060",
        },
        operationName: "GetUser",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        JSON.stringify({
          accessToken: jwt.sign(
            { _id: "000000000000000000000060", email: "" },
            "ACCESSSECRET",
            { expiresIn: "15m" }
          ),
          refreshToken: "validRefreshToken",
        })
      );
    expect(response.body.data.user.id).toBeTruthy();
    expect(response.body.data.user.accountAvailable).toBe("$500.00");
    expect(response.body.data.user.investments.length).toBe(0);
  });
});
