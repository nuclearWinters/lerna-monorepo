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
    client = await MongoClient.connect(
      (global as unknown as { __MONGO_URI__: string }).__MONGO_URI__,
      {}
    );
    dbInstance = client.db("fintech");
    app.locals.db = dbInstance;
  });

  afterAll(async () => {
    await client.close();
  });

  it("test QueryUser valid access token", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    const user_oid = new ObjectId();
    const user_id = "wHHR1SUBT0dspoF4YUO24";
    await users.insertMany([
      {
        _id: user_oid,
        id: user_id,
        accountAvailable: 50000,
        accountToBePaid: 0,
        accountTotal: 50000,
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
            id: user_id,
            isBorrower: false,
            isLender: true,
            isSupport: false,
          },
          "ACCESSSECRET",
          { expiresIn: "15m" }
        )
      )
      .set("Cookie", `id=` + user_id);
    expect(response.body.data.user.id).toBeTruthy();
    expect(response.body.data.user.accountAvailable).toBe("$500.00");
    expect(response.body.data.user.accountToBePaid).toBe("$0.00");
    expect(response.body.data.user.accountTotal).toBe("$500.00");
  });
});
