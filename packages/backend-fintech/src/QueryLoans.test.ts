import { app } from "./app";
import supertest from "supertest";
import { Db, MongoClient, ObjectId } from "mongodb";
import { LoanMongo } from "./types";
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
    dbInstance = client.db("fintech");
    app.locals.db = dbInstance;
  });

  afterAll(async () => {
    await client.close();
  });

  it("test LoanConnection valid access token", async () => {
    const loans = dbInstance.collection<LoanMongo>("loans");
    const loan1_oid = new ObjectId();
    const loan2_oid = new ObjectId();
    const loan3_oid = new ObjectId();
    await loans.insertMany([
      {
        _id: loan1_oid,
        id_user: "wHHR1SUBT0dspoF4YUO23",
        score: "AAA",
        ROI: 17,
        goal: 100000,
        term: 3,
        raised: 0,
        status: "to be paid",
        scheduledPayments: [
          {
            scheduledDate: new Date(),
            amortize: 100,
            status: "to be paid",
          },
        ],
        expiry: new Date(),
        pending: 0,
      },
      {
        _id: loan2_oid,
        id_user: "wHHR1SUBT0dspoF4YUO23",
        score: "BBB",
        ROI: 20,
        goal: 50000,
        term: 3,
        raised: 0,
        status: "waiting for approval",
        scheduledPayments: null,
        expiry: new Date(),
        pending: 0,
      },
      {
        _id: loan3_oid,
        id_user: "wHHR1SUBT0dspoF4YUO23",
        score: "CCC",
        ROI: 24,
        goal: 150000,
        term: 3,
        raised: 0,
        status: "financing",
        scheduledPayments: null,
        expiry: new Date(),
        pending: 0,
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
                  id_user
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
      .set("Cookie", `id=wHHR1SUBT0dspoF4YUO23`);
    expect(response.body.data.user.myLoans.edges.length).toBe(2);
    expect(response.body.data.user.myLoans.edges[0].cursor).toBeTruthy();
    expect(response.body.data.user.myLoans.edges[0].node.id).toBeTruthy();
    expect(response.body.data.user.myLoans.edges[0].node.id_user).toBeTruthy();
    expect(response.body.data.user.myLoans.edges[0].node.score).toBeTruthy();
    expect(response.body.data.user.myLoans.edges[0].node.ROI).toBeTruthy();
    expect(response.body.data.user.myLoans.edges[0].node.goal).toBeTruthy();
    expect(response.body.data.user.myLoans.edges[0].node.term).toBeTruthy();
    expect(response.body.data.user.myLoans.edges[0].node.raised).toBeTruthy();
    expect(response.body.data.user.myLoans.edges[0].node.expiry).toBeTruthy();
    expect(response.body.data.user.myLoans.edges[0].node.status).toBeTruthy();
  });
});
