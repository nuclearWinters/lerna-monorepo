import { app } from "./app";
import supertest from "supertest";
import { Db, MongoClient, ObjectId } from "mongodb";
import { TransactionMongo, UserMongo } from "./types";
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

describe("QueryTransactions tests", () => {
  let client: MongoClient;
  let dbInstance: Db;

  beforeAll(async () => {
    client = await MongoClient.connect(
      (global as unknown as { __MONGO_URI__: string }).__MONGO_URI__,
      {}
    );
    dbInstance = client.db(
      (global as unknown as { __MONGO_DB_NAME__: string }).__MONGO_DB_NAME__
    );
    app.locals.db = dbInstance;
  });

  afterAll(async () => {
    await client.close();
  });

  it("test TransactionsConnection valid access token", async () => {
    const transactions =
      dbInstance.collection<TransactionMongo>("transactions");
    const users = dbInstance.collection<UserMongo>("users");
    await users.insertOne({
      id: "wHHR1SUBT0dspoF4YUO15",
      account_total: 0,
      account_available: 0,
      account_to_be_paid: 0,
      account_withheld: 0,
    });
    await transactions.insertMany([
      {
        user_id: "wHHR1SUBT0dspoF4YUO15",
        _id: new ObjectId(),
        type: "credit",
        quantity: 100,
        created_at: new Date(),
      },
      {
        user_id: "wHHR1SUBT0dspoF4YUO15",
        _id: new ObjectId(),
        type: "invest",
        quantity: -100,
        created_at: new Date(),
        loan_oid: new ObjectId(),
        borrower_id: "",
      },
      {
        user_id: "wHHR1SUBT0dspoF4YUO15",
        _id: new ObjectId(),
        type: "payment",
        quantity: -100,
        created_at: new Date(),
      },
      {
        user_id: "wHHR1SUBT0dspoF4YUO15",
        _id: new ObjectId(),
        type: "withdrawal",
        quantity: -100,
        created_at: new Date(),
      },
      {
        user_id: "wHHR1SUBT0dspoF4YUO15",
        _id: new ObjectId(),
        type: "credit",
        quantity: 100,
        created_at: new Date(),
      },
      {
        user_id: "wHHR1SUBT0dspoF4YUO15",
        _id: new ObjectId(),
        type: "credit",
        quantity: 200,
        created_at: new Date(),
      },
      {
        user_id: "wHHR1SUBT0dspoF4YUO15",
        _id: new ObjectId(),
        type: "invest",
        quantity: -200,
        created_at: new Date(),
        loan_oid: new ObjectId(),
        borrower_id: "",
      },
      {
        user_id: "wHHR1SUBT0dspoF4YUO15",
        _id: new ObjectId(),
        type: "payment",
        quantity: -200,
        created_at: new Date(),
      },
      {
        user_id: "wHHR1SUBT0dspoF4YUO15",
        _id: new ObjectId(),
        type: "withdrawal",
        quantity: -200,
        created_at: new Date(),
      },
      {
        user_id: "wHHR1SUBT0dspoF4YUO15",
        _id: new ObjectId(),
        type: "credit",
        quantity: 200,
        created_at: new Date(),
      },
    ]);
    const response = await request
      .post("/graphql")
      .send({
        query: `query GetTransactionsConnection($first: Int, $after: String) {
          user {
            transactions(first: $first, after: $after) {
              edges {
                cursor
                node {
                  ... on MoneyTransaction {
                    id
                    user_id
                    type
                    quantity
                    created_at
                  }
                  ... on InvestTransaction {
                    id
                    user_id
                    type
                    quantity
                    created_at
                    borrower_id
                    loan_id
                  }
                }
              }
            } 
          } 
        }`,
        variables: {
          first: 9,
          after: "",
        },
        operationName: "GetTransactionsConnection",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        jwt.sign(
          {
            id: "wHHR1SUBT0dspoF4YUO15",
            isBorrower: false,
            isLender: true,
            isSupport: false,
          },
          "ACCESSSECRET",
          {
            expiresIn: "15m",
          }
        )
      )
      .set("Cookie", `id=wHHR1SUBT0dspoF4YUO15`);
    expect(response.body.data.user.transactions.edges.length).toBe(9);
    expect(response.body.data.user.transactions.edges[0].cursor).toBeTruthy();
    expect(response.body.data.user.transactions.edges[0].node.id).toBeTruthy();
    expect(
      response.body.data.user.transactions.edges[0].node.user_id
    ).toBeTruthy();
    expect(response.body.data.user.transactions.edges[0].node.id).toBeTruthy();
    expect(response.body.data.user.transactions.edges[0].node.type).toBe(
      "CREDIT"
    );
    expect(response.body.data.user.transactions.edges[0].node.quantity).toBe(
      "$2.00"
    );
    expect(
      response.body.data.user.transactions.edges[0].node.created_at
    ).toBeTruthy();
  });
});
