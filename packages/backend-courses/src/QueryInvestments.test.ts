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
    client = await MongoClient.connect(process.env.MONGO_URL as string, {});
    dbInstance = client.db("fintech");
    app.locals.db = dbInstance;
  });

  afterAll(async () => {
    await client.close();
  });

  it("test InvestmentConnection valid access token", async () => {
    const investments = dbInstance.collection<InvestmentMongo>("investments");
    await investments.insertMany([
      {
        _id: new ObjectId("000000000000000000000032"),
        id_borrower: "wHHR1SUBT0dspoF4YUO17",
        id_lender: "wHHR1SUBT0dspoF4YUO16",
        _id_loan: new ObjectId("000000000000000000000033"),
        quantity: 50000,
        status: "up to date",
        created: new Date(),
        updated: new Date(),
        payments: 0,
        term: 3,
        ROI: 17,
        moratory: 0,
        interest_to_earn: 0,
        to_be_paid: 0,
        paid_already: 0,
        amortize: 50989,
      },
      {
        _id: new ObjectId("000000000000000000000034"),
        id_borrower: "wHHR1SUBT0dspoF4YUO18",
        id_lender: "wHHR1SUBT0dspoF4YUO16",
        _id_loan: new ObjectId("000000000000000000000038"),
        quantity: 50000,
        status: "up to date",
        created: new Date(),
        updated: new Date(),
        payments: 0,
        term: 50000,
        ROI: 17,
        moratory: 0,
        interest_to_earn: 0,
        to_be_paid: 0,
        paid_already: 0,
        amortize: 50989,
      },
      {
        _id: new ObjectId("000000000000000000000035"),
        id_borrower: "wHHR1SUBT0dspoF4YUO19",
        id_lender: "wHHR1SUBT0dspoF4YUO16",
        _id_loan: new ObjectId("000000000000000000000039"),
        quantity: 50000,
        status: "up to date",
        created: new Date(),
        updated: new Date(),
        payments: 0,
        term: 50000,
        ROI: 17,
        moratory: 0,
        interest_to_earn: 0,
        to_be_paid: 0,
        paid_already: 0,
        amortize: 50989,
      },
    ]);
    const response = await request
      .post("/graphql")
      .send({
        query: `query GetInvestmentsConnection($first: Int, $after: String, $status: [InvestmentStatus!]!) {
          user {
            investments(first: $first, after: $after, status: $status) {
              edges {
                cursor
                node {
                  id
                  id_borrower
                  id_lender
                  _id_loan
                  quantity
                  created
                  updated
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
      .set(
        "Cookie",
        `refreshToken=${jwt.sign(
          {
            id: "wHHR1SUBT0dspoF4YUO16",
            isBorrower: false,
            isLender: true,
            isSupport: false,
          },
          "REFRESHSECRET",
          { expiresIn: "15m" }
        )}`
      );
    expect(response.body.data.user.investments.edges.length).toBe(2);
    expect(response.body.data.user.investments.edges[0].cursor).toBeTruthy();
    expect(response.body.data.user.investments.edges[0].node.id).toBeTruthy();
    expect(
      response.body.data.user.investments.edges[0].node.id_borrower
    ).toBeTruthy();
    expect(
      response.body.data.user.investments.edges[0].node.id_lender
    ).toBeTruthy();
    expect(
      response.body.data.user.investments.edges[0].node._id_loan
    ).toBeTruthy();
    expect(response.body.data.user.investments.edges[0].node.quantity).toBe(
      "$500.00"
    );
    expect(
      response.body.data.user.investments.edges[0].node.created
    ).toBeTruthy();
    expect(
      response.body.data.user.investments.edges[0].node.updated
    ).toBeTruthy();
    expect(response.body.data.user.investments.edges[0].node.status).toBe(
      "UP_TO_DATE"
    );
  });
});
