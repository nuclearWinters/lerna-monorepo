import { app } from "./app";
import supertest from "supertest";
import { Db, MongoClient, ObjectId } from "mongodb";
import { BucketTransactionMongo } from "./types";
import { jwt } from "./utils";
import { ACCESSSECRET } from "./config";

const request = supertest(app);

describe("QueryTransactions tests", () => {
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

  it("test TransactionsConnection valid access token", async () => {
    const transactions =
      dbInstance.collection<BucketTransactionMongo>("transactions");
    await transactions.insertMany([
      {
        _id: "000000000000000000000050_0",
        _id_user: new ObjectId("000000000000000000000050"),
        count: 5,
        history: [
          {
            _id: new ObjectId("000000000000000000000051"),
            type: "CREDIT",
            quantity: 100,
            created: new Date(),
          },
          {
            _id: new ObjectId("000000000000000000000052"),
            type: "INVEST",
            quantity: -100,
            created: new Date(),
          },
          {
            _id: new ObjectId("000000000000000000000053"),
            type: "PAYMENT",
            quantity: -100,
            created: new Date(),
          },
          {
            _id: new ObjectId("000000000000000000000054"),
            type: "WITHDRAWAL",
            quantity: -100,
            created: new Date(),
          },
          {
            _id: new ObjectId("000000000000000000000055"),
            type: "CREDIT",
            quantity: 100,
            created: new Date(),
          },
        ],
      },
      {
        _id: "000000000000000000000050_1",
        _id_user: new ObjectId("000000000000000000000050"),
        count: 5,
        history: [
          {
            _id: new ObjectId("000000000000000000000051"),
            type: "CREDIT",
            quantity: 200,
            created: new Date(),
          },
          {
            _id: new ObjectId("000000000000000000000052"),
            type: "INVEST",
            quantity: -200,
            created: new Date(),
          },
          {
            _id: new ObjectId("000000000000000000000053"),
            type: "PAYMENT",
            quantity: -200,
            created: new Date(),
          },
          {
            _id: new ObjectId("000000000000000000000054"),
            type: "WITHDRAWAL",
            quantity: -200,
            created: new Date(),
          },
          {
            _id: new ObjectId("000000000000000000000055"),
            type: "CREDIT",
            quantity: 200,
            created: new Date(),
          },
        ],
      },
    ]);
    const response = await request
      .post("/api/graphql")
      .send({
        query: `query GetTransactionsConnection($first: Int, $after: String, $user_id: String!) {
          transactions(first: $first, after: $after, user_id: $user_id) {
            edges {
              cursor
              node {
                id
                _id_user
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
        }`,
        variables: {
          first: 1,
          after: "",
          user_id: "000000000000000000000050",
        },
        operationName: "GetTransactionsConnection",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        JSON.stringify({
          accessToken: jwt.sign(
            { _id: "000000000000000000000050", email: "" },
            ACCESSSECRET,
            { expiresIn: "15m" }
          ),
          refreshToken: "validRefreshToken",
        })
      );
    expect(response.body.data.transactions.edges.length).toBe(1);
    expect(response.body.data.transactions.edges[0].cursor).toBeTruthy();
    expect(response.body.data.transactions.edges[0].node.id).toBeTruthy();
    expect(response.body.data.transactions.edges[0].node._id_user).toBeTruthy();
    expect(response.body.data.transactions.edges[0].node.count).toBeTruthy();
    expect(response.body.data.transactions.edges[0].node.history.length).toBe(
      5
    );
    expect(
      response.body.data.transactions.edges[0].node.history[0].id
    ).toBeTruthy();
    expect(response.body.data.transactions.edges[0].node.history[0].type).toBe(
      "CREDIT"
    );
    expect(
      response.body.data.transactions.edges[0].node.history[0].quantity
    ).toBe("2.00");
    expect(
      response.body.data.transactions.edges[0].node.history[0].created
    ).toBeTruthy();
  });
});
