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
    client = await MongoClient.connect(process.env.MONGO_URL as string, {});
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
        _id: new ObjectId("000000000000000000000051"),
        type: "credit",
        quantity: 100,
        created: new Date(),
      },
      {
        id_user: "wHHR1SUBT0dspoF4YUO15",
        _id: new ObjectId("000000000000000000000052"),
        type: "invest",
        quantity: -100,
        created: new Date(),
        _id_loan: new ObjectId(),
        id_borrower: "",
      },
      {
        id_user: "wHHR1SUBT0dspoF4YUO15",
        _id: new ObjectId("000000000000000000000053"),
        type: "payment",
        quantity: -100,
        created: new Date(),
      },
      {
        id_user: "wHHR1SUBT0dspoF4YUO15",
        _id: new ObjectId("000000000000000000000054"),
        type: "withdrawal",
        quantity: -100,
        created: new Date(),
      },
      {
        id_user: "wHHR1SUBT0dspoF4YUO15",
        _id: new ObjectId("000000000000000000000055"),
        type: "credit",
        quantity: 100,
        created: new Date(),
      },
      {
        id_user: "wHHR1SUBT0dspoF4YUO15",
        _id: new ObjectId("000000000000000000000151"),
        type: "credit",
        quantity: 200,
        created: new Date(),
      },
      {
        id_user: "wHHR1SUBT0dspoF4YUO15",
        _id: new ObjectId("000000000000000000000152"),
        type: "invest",
        quantity: -200,
        created: new Date(),
        _id_loan: new ObjectId(),
        id_borrower: "",
      },
      {
        id_user: "wHHR1SUBT0dspoF4YUO15",
        _id: new ObjectId("000000000000000000000153"),
        type: "payment",
        quantity: -200,
        created: new Date(),
      },
      {
        id_user: "wHHR1SUBT0dspoF4YUO15",
        _id: new ObjectId("000000000000000000000154"),
        type: "withdrawal",
        quantity: -200,
        created: new Date(),
      },
      {
        id_user: "wHHR1SUBT0dspoF4YUO15",
        _id: new ObjectId("000000000000000000000155"),
        type: "credit",
        quantity: 200,
        created: new Date(),
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
                    created
                  }
                  ... on InvestTransaction {
                    id
                    id_user
                    type
                    quantity
                    created
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
      response.body.data.user.transactions.edges[0].node.created
    ).toBeTruthy();
  });
});
