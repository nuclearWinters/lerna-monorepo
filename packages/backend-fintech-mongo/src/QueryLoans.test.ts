import { app } from "./app";
import supertest from "supertest";
import { Db, MongoClient, ObjectId } from "mongodb";
import { LoanMongo, UserMongo } from "./types";
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

describe("QueryLoans tests", () => {
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

  it("test LoanConnection valid access token", async () => {
    const loans = dbInstance.collection<LoanMongo>("loans");
    const users = dbInstance.collection<UserMongo>("users");
    await users.insertOne({
      id: "wHHR1SUBT0dspoF4YUO23",
      account_total: 0,
      account_available: 0,
      account_to_be_paid: 0,
      account_withheld: 0,
    });
    const loan1_oid = new ObjectId();
    const loan2_oid = new ObjectId();
    const loan3_oid = new ObjectId();
    await loans.insertMany([
      {
        _id: loan1_oid,
        user_id: "wHHR1SUBT0dspoF4YUO23",
        score: "AAA",
        roi: 17,
        goal: 100000,
        term: 3,
        raised: 0,
        status: "to be paid",
        expiry: new Date(),
        pending: 0,
        payments_done: 0,
        payments_delayed: 0,
      },
      {
        _id: loan2_oid,
        user_id: "wHHR1SUBT0dspoF4YUO23",
        score: "BBB",
        roi: 20,
        goal: 50000,
        term: 3,
        raised: 0,
        status: "waiting for approval",
        expiry: new Date(),
        pending: 0,
        payments_done: 0,
        payments_delayed: 0,
      },
      {
        _id: loan3_oid,
        user_id: "wHHR1SUBT0dspoF4YUO23",
        score: "CCC",
        roi: 24,
        goal: 150000,
        term: 3,
        raised: 0,
        status: "financing",
        expiry: new Date(),
        pending: 0,
        payments_done: 0,
        payments_delayed: 0,
      },
    ]);
    const response = await request
      .post("/graphql")
      .send({
        query: `query GetLoansConnection($first: Int, $after: String!) {
          user {
            myLoans(first: $first, after: $after) {
              edges {
                cursor
                node {
                  id
                  user_id
                  score
                  ROI
                  goal
                  term
                  raised
                  expiry
                  status
                }
              }
            }
          }
        }`,
        variables: {
          first: 2,
          after: "",
        },
        operationName: "GetLoansConnection",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        jwt.sign(
          {
            id: "wHHR1SUBT0dspoF4YUO23",
            isBorrower: true,
            isLender: false,
            isSupport: false,
          },
          "ACCESSSECRET",
          {
            expiresIn: "15m",
          }
        )
      )
      .set("Cookie", `id=wHHR1SUBT0dspoF4YUO23;isBorrower=true;`);
    expect(response.body.data.user.myLoans.edges.length).toBe(2);
    expect(response.body.data.user.myLoans.edges[0].cursor).toBeTruthy();
    expect(response.body.data.user.myLoans.edges[0].node.id).toBeTruthy();
    expect(response.body.data.user.myLoans.edges[0].node.user_id).toBeTruthy();
    expect(response.body.data.user.myLoans.edges[0].node.score).toBeTruthy();
    expect(response.body.data.user.myLoans.edges[0].node.ROI).toBeTruthy();
    expect(response.body.data.user.myLoans.edges[0].node.goal).toBeTruthy();
    expect(response.body.data.user.myLoans.edges[0].node.term).toBeTruthy();
    expect(response.body.data.user.myLoans.edges[0].node.raised).toBeTruthy();
    expect(response.body.data.user.myLoans.edges[0].node.expiry).toBeTruthy();
    expect(response.body.data.user.myLoans.edges[0].node.status).toBeTruthy();
  });
});
