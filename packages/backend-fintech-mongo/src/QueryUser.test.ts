import { main } from "./app";
import supertest from "supertest";
import { Db, MongoClient, ObjectId } from "mongodb";
import { UserMongo } from "./types";
import { jwt } from "./utils";
import TestAgent from "supertest/lib/agent";
import { Producer } from "kafkajs";

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

describe("QueryUser tests", () => {
  let client: MongoClient;
  let dbInstance: Db;
  let request: TestAgent<supertest.Test>;
  let producer: Producer;

  beforeAll(async () => {
    client = await MongoClient.connect(
      (global as unknown as { __MONGO_URI__: string }).__MONGO_URI__,
      {}
    );
    dbInstance = client.db(
      (global as unknown as { __MONGO_DB_NAME__: string }).__MONGO_DB_NAME__
    );

    const server = await main(dbInstance, producer);
    request = supertest(server, { http2: true });
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
        account_available: 50000,
        account_to_be_paid: 0,
        account_total: 50000,
        account_withheld: 0,
      },
    ]);
    const response = await request
      .post("/graphql")
      .trustLocalhost()
      .send({
        query: "",
        variables: {},
        operationName: "AccountQueriesQuery",
        extensions: {
          doc_id: "aa6ec069076aa222be921f4b6568a17c"
        }
      })
      .set("Accept", "text/event-stream")
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
          { expiresIn: "3m" }
        )
      )
      .set("Cookie", `refreshToken=${jwt.sign(
        {
          id: user_id,
          isBorrower: false,
          isLender: true,
          isSupport: false,
        },
        "REFRESHSECRET",
        { expiresIn: "15m" }
      )}`);
    console.log(response.text);
    const stream = response.text.split("\n");
    const data = JSON.parse(stream[3].replace("data: ", ""));
    expect(data.data.user.id).toBeTruthy();
    expect(data.data.user.accountAvailable).toBe("$500.00");
    expect(data.data.user.accountToBePaid).toBe("$0.00");
    expect(data.data.user.accountTotal).toBe("$500.00");
  });
});
