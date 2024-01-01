import { app } from "./app";
import supertest from "supertest";
import { Db, MongoClient, ObjectId } from "mongodb";
import { TransactionMongo } from "./types";
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
    dbInstance = client.db("fintech");
    app.locals.db = dbInstance;
  });

  afterAll(async () => {
    await client.close();
  });

  it("test TransactionsConnection valid access token", async () => {
    const transactions =
      dbInstance.collection<TransactionMongo>("transactions");
    await transactions.insertMany([
      {
        id_user: "wHHR1SUBT0dspoF4YUO15",
        _id: new ObjectId(),
        type: "credit",
        quantity: 100,
        created_at: new Date(),
      },
      {
        id_user: "wHHR1SUBT0dspoF4YUO15",
        _id: new ObjectId(),
        type: "invest",
        quantity: -100,
        created_at: new Date(),
        _id_loan: new ObjectId(),
        id_borrower: "",
      },
      {
        id_user: "wHHR1SUBT0dspoF4YUO15",
        _id: new ObjectId(),
        type: "payment",
        quantity: -100,
        created_at: new Date(),
      },
      {
        id_user: "wHHR1SUBT0dspoF4YUO15",
        _id: new ObjectId(),
        type: "withdrawal",
        quantity: -100,
        created_at: new Date(),
      },
      {
        id_user: "wHHR1SUBT0dspoF4YUO15",
        _id: new ObjectId(),
        type: "credit",
        quantity: 100,
        created_at: new Date(),
      },
      {
        id_user: "wHHR1SUBT0dspoF4YUO15",
        _id: new ObjectId(),
        type: "credit",
        quantity: 200,
        created_at: new Date(),
      },
      {
        id_user: "wHHR1SUBT0dspoF4YUO15",
        _id: new ObjectId(),
        type: "invest",
        quantity: -200,
        created_at: new Date(),
        _id_loan: new ObjectId(),
        id_borrower: "",
      },
      {
        id_user: "wHHR1SUBT0dspoF4YUO15",
        _id: new ObjectId(),
        type: "payment",
        quantity: -200,
        created_at: new Date(),
      },
      {
        id_user: "wHHR1SUBT0dspoF4YUO15",
        _id: new ObjectId(),
        type: "withdrawal",
        quantity: -200,
        created_at: new Date(),
      },
      {
        id_user: "wHHR1SUBT0dspoF4YUO15",
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
                    id_user
                    type
                    quantity
                    created_at
                  }
                  ... on InvestTransaction {
                    id
                    id_user
                    type
                    quantity
                    created_at
                    id_borrower
                    _id_loan
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
      response.body.data.user.transactions.edges[0].node.id_user
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
