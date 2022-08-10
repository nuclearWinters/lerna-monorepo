import { app } from "./app";
import supertest from "supertest";
import { Db, MongoClient, ObjectId } from "mongodb";
import { BucketTransactionMongo } from "./types";
import { jwt } from "./utils";

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
      dbInstance.collection<BucketTransactionMongo>("transactions");
    await transactions.insertMany([
      {
        _id: "000000000000000000000050_0",
        id_user: "wHHR1SUBT0dspoF4YUO15",
        count: 5,
        history: [
          {
            _id: new ObjectId("000000000000000000000051"),
            type: "credit",
            quantity: 100,
            created: new Date(),
          },
          {
            _id: new ObjectId("000000000000000000000052"),
            type: "invest",
            quantity: -100,
            created: new Date(),
          },
          {
            _id: new ObjectId("000000000000000000000053"),
            type: "payment",
            quantity: -100,
            created: new Date(),
          },
          {
            _id: new ObjectId("000000000000000000000054"),
            type: "withdrawal",
            quantity: -100,
            created: new Date(),
          },
          {
            _id: new ObjectId("000000000000000000000055"),
            type: "credit",
            quantity: 100,
            created: new Date(),
          },
        ],
      },
      {
        _id: "000000000000000000000050_1",
        id_user: "wHHR1SUBT0dspoF4YUO15",
        count: 5,
        history: [
          {
            _id: new ObjectId("000000000000000000000051"),
            type: "credit",
            quantity: 200,
            created: new Date(),
          },
          {
            _id: new ObjectId("000000000000000000000052"),
            type: "invest",
            quantity: -200,
            created: new Date(),
          },
          {
            _id: new ObjectId("000000000000000000000053"),
            type: "payment",
            quantity: -200,
            created: new Date(),
          },
          {
            _id: new ObjectId("000000000000000000000054"),
            type: "withdrawal",
            quantity: -200,
            created: new Date(),
          },
          {
            _id: new ObjectId("000000000000000000000055"),
            type: "credit",
            quantity: 200,
            created: new Date(),
          },
        ],
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
                  id
                  id_user
                  count
                  history {
                    id
                    type
                    quantity
                    created
                  }
                }
              }
            } 
          } 
        }`,
        variables: {
          first: 1,
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
      .set(
        "Cookie",
        `refreshToken=${jwt.sign(
          {
            id: "wHHR1SUBT0dspoF4YUO15",
            isBorrower: false,
            isLender: true,
            isSupport: false,
          },
          "REFRESHSECRET",
          { expiresIn: "15m" }
        )}`
      );
    expect(response.body.data.user.transactions.edges.length).toBe(1);
    expect(response.body.data.user.transactions.edges[0].cursor).toBeTruthy();
    expect(response.body.data.user.transactions.edges[0].node.id).toBeTruthy();
    expect(
      response.body.data.user.transactions.edges[0].node.id_user
    ).toBeTruthy();
    expect(
      response.body.data.user.transactions.edges[0].node.count
    ).toBeTruthy();
    expect(
      response.body.data.user.transactions.edges[0].node.history.length
    ).toBe(5);
    expect(
      response.body.data.user.transactions.edges[0].node.history[0].id
    ).toBeTruthy();
    expect(
      response.body.data.user.transactions.edges[0].node.history[0].type
    ).toBe("CREDIT");
    expect(
      response.body.data.user.transactions.edges[0].node.history[0].quantity
    ).toBe("$2.00");
    expect(
      response.body.data.user.transactions.edges[0].node.history[0].created
    ).toBeTruthy();
  });
});
