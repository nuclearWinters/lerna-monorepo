import { app } from "./app";
import supertest from "supertest";
import { Db, MongoClient, ObjectId } from "mongodb";
import { InvestmentMongo } from "./types";
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

describe("QueryInvestments tests", () => {
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

  it("test InvestmentConnection valid access token", async () => {
    const investments = dbInstance.collection<InvestmentMongo>("investments");
    const invest1_oid = new ObjectId();
    const invest2_oid = new ObjectId();
    const invest3_oid = new ObjectId();
    const loan1_oid = new ObjectId();
    const loan2_oid = new ObjectId();
    const loan3_oid = new ObjectId();
    await investments.insertMany([
      {
        _id: invest1_oid,
        borrower_id: "wHHR1SUBT0dspoF4YUO17",
        lender_id: "wHHR1SUBT0dspoF4YUO16",
        loan_oid: loan1_oid,
        quantity: 50000,
        status: "up to date",
        created_at: new Date(),
        updated_at: new Date(),
        payments: 0,
        term: 3,
        roi: 17,
        moratory: 0,
        interest_to_earn: 0,
        to_be_paid: 0,
        paid_already: 0,
        amortize: 50989,
        status_type: "on_going",
      },
      {
        _id: invest2_oid,
        borrower_id: "wHHR1SUBT0dspoF4YUO18",
        lender_id: "wHHR1SUBT0dspoF4YUO16",
        loan_oid: loan2_oid,
        quantity: 50000,
        status: "up to date",
        created_at: new Date(),
        updated_at: new Date(),
        payments: 0,
        term: 50000,
        roi: 17,
        moratory: 0,
        interest_to_earn: 0,
        to_be_paid: 0,
        paid_already: 0,
        amortize: 50989,
        status_type: "on_going",
      },
      {
        _id: invest3_oid,
        borrower_id: "wHHR1SUBT0dspoF4YUO19",
        lender_id: "wHHR1SUBT0dspoF4YUO16",
        loan_oid: loan3_oid,
        quantity: 50000,
        status: "up to date",
        created_at: new Date(),
        updated_at: new Date(),
        payments: 0,
        term: 50000,
        roi: 17,
        moratory: 0,
        interest_to_earn: 0,
        to_be_paid: 0,
        paid_already: 0,
        amortize: 50989,
        status_type: "on_going",
      },
    ]);
    const response = await request
      .post("/graphql")
      .send({
        query: `query GetInvestmentsConnection($first: Int, $after: String, $status: [InvestmentStatus!]) {
          user {
            investments(first: $first, after: $after, status: $status) {
              edges {
                cursor
                node {
                  id
                  borrower_id
                  lender_id
                  loan_id
                  quantity
                  created_at
                  updated_at
                  status
                }
              }
            } 
          }
        }`,
        variables: {
          first: 2,
          after: "",
          status: ["UP_TO_DATE"],
        },
        operationName: "GetInvestmentsConnection",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        jwt.sign(
          {
            id: "wHHR1SUBT0dspoF4YUO16",
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
      .set("Cookie", `id=wHHR1SUBT0dspoF4YUO16`);
    expect(response.body.data.user.investments.edges.length).toBe(2);
    expect(response.body.data.user.investments.edges[0].cursor).toBeTruthy();
    expect(response.body.data.user.investments.edges[0].node.id).toBeTruthy();
    expect(
      response.body.data.user.investments.edges[0].node.borrower_id
    ).toBeTruthy();
    expect(
      response.body.data.user.investments.edges[0].node.lender_id
    ).toBeTruthy();
    expect(
      response.body.data.user.investments.edges[0].node.loan_id
    ).toBeTruthy();
    expect(response.body.data.user.investments.edges[0].node.quantity).toBe(
      "$500.00"
    );
    expect(
      response.body.data.user.investments.edges[0].node.created_at
    ).toBeTruthy();
    expect(
      response.body.data.user.investments.edges[0].node.updated_at
    ).toBeTruthy();
    expect(response.body.data.user.investments.edges[0].node.status).toBe(
      "UP_TO_DATE"
    );
  });
});
