import { app } from "./app";
import supertest from "supertest";
import { Db, MongoClient, ObjectId } from "mongodb";
import { LoanMongo } from "./types";
import { jwt } from "./utils";

const request = supertest(app);

describe("QueryLoans tests", () => {
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

  it("test LoanConnection valid access token", async () => {
    const loans = dbInstance.collection<LoanMongo>("loans");
    await loans.insertMany([
      {
        _id: new ObjectId("000000000000000000000041"),
        _id_user: new ObjectId("000000000000000000000040"),
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
        investors: [],
      },
      {
        _id: new ObjectId("000000000000000000000042"),
        _id_user: new ObjectId("000000000000000000000040"),
        score: "BBB",
        ROI: 20,
        goal: 50000,
        term: 3,
        raised: 0,
        status: "waiting for approval",
        scheduledPayments: null,
        expiry: new Date(),
        investors: [],
      },
      {
        _id: new ObjectId("000000000000000000000043"),
        _id_user: new ObjectId("000000000000000000000040"),
        score: "CCC",
        ROI: 24,
        goal: 150000,
        term: 3,
        raised: 0,
        status: "financing",
        scheduledPayments: null,
        expiry: new Date(),
        investors: [],
      },
    ]);
    const response = await request
      .post("/api/graphql")
      .send({
        query: `query GetLoansConnection($first: Int, $after: String!, $status: [LoanStatus!]!) {
          loans(first: $first, after: $after, status: $status) {
            edges {
              cursor
              node {
                id
                _id_user
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
        }`,
        variables: {
          first: 2,
          after: "",
          status: ["FINANCING", "WAITING_FOR_APPROVAL", "TO_BE_PAID"],
        },
        operationName: "GetLoansConnection",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        JSON.stringify({
          accessToken: jwt.sign({ _id: "", email: "" }, "ACCESSSECRET", {
            expiresIn: "15m",
          }),
          refreshToken: "validRefreshToken",
        })
      );
    expect(response.body.data.loans.edges.length).toBe(2);
    expect(response.body.data.loans.edges[0].cursor).toBeTruthy();
    expect(response.body.data.loans.edges[0].node.id).toBeTruthy();
    expect(response.body.data.loans.edges[0].node._id_user).toBeTruthy();
    expect(response.body.data.loans.edges[0].node.score).toBeTruthy();
    expect(response.body.data.loans.edges[0].node.ROI).toBeTruthy();
    expect(response.body.data.loans.edges[0].node.goal).toBeTruthy();
    expect(response.body.data.loans.edges[0].node.term).toBeTruthy();
    expect(response.body.data.loans.edges[0].node.raised).toBeTruthy();
    expect(response.body.data.loans.edges[0].node.expiry).toBeTruthy();
    expect(response.body.data.loans.edges[0].node.status).toBeTruthy();
  });
});
