import { app } from "./app";
import supertest from "supertest";
import { Db, MongoClient, ObjectId } from "mongodb";
import { UserMongo } from "./types";
import { jwt } from "./utils";

jest.mock("graphql-redis-subscriptions", () => ({
  RedisPubSub: jest.fn().mockImplementation(() => {
    return {};
  }),
}));

jest.mock("ioredis", () =>
  jest.fn().mockImplementation(() => {
    return {};
  })
);

const request = supertest(app);

describe("QueryUser tests", () => {
  let client: MongoClient;
  let dbInstance: Db;

  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URL as string, {});
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
        id: "wHHR1SUBT0dspoF4YUO24",
        accountAvailable: 50000,
        accountToBePaid: 0,
        accountTotal: 50000,
        transactions: [],
        myLoans: [],
        myInvestments: [],
      },
    ]);
    const response = await request
      .post("/graphql")
      .send({
        query: `query GetUser {
          user {
            id
            accountAvailable
            accountToBePaid
            accountTotal
          }  
        }`,
        variables: {},
        operationName: "GetUser",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        jwt.sign(
          {
            id: "wHHR1SUBT0dspoF4YUO24",
            isBorrower: false,
            isLender: true,
            isSupport: false,
          },
          "ACCESSSECRET",
          { expiresIn: "15m" }
        )
      )
      .set(
        "Cookie",
        `refreshToken=${jwt.sign(
          {
            id: "wHHR1SUBT0dspoF4YUO24",
            isBorrower: false,
            isLender: true,
            isSupport: false,
          },
          "REFRESHSECRET",
          { expiresIn: "15m" }
        )}`
      );
    expect(response.body.data.user.id).toBeTruthy();
    expect(response.body.data.user.accountAvailable).toBe("$500.00");
    expect(response.body.data.user.accountToBePaid).toBe("$0.00");
    expect(response.body.data.user.accountTotal).toBe("$500.00");
  });
});
