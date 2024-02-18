import { app } from "../app";
import supertest from "supertest";
import { Db, MongoClient, ObjectId } from "mongodb";
import { LoanMongo, UserMongo } from "../types";
import { base64Name, jwt } from "../utils";

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

jest.mock("../subscriptions/subscriptionsUtils", () => ({
  publishLoanUpdate: jest.fn,
  publishLoanInsert: jest.fn,
}));

const request = supertest(app);

describe("ApproveLoan tests", () => {
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

  it("test ApproveLoan valid access token", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    const support_oid = new ObjectId();
    const borrower_oid = new ObjectId();
    const support_id = "wHHR1SUBT0dspoF4YUO21";
    const borrower_id = "wHHR1SUBT0dspoF4YUO22";
    const loan_oid = new ObjectId();
    await users.insertMany([
      {
        _id: support_oid,
        id: support_id,
        account_available: 100000,
        account_to_be_paid: 0,
        account_total: 100000,
        account_withheld: 0,
      },
      {
        _id: borrower_oid,
        id: borrower_id,
        account_available: 100000,
        account_to_be_paid: 0,
        account_total: 100000,
        account_withheld: 0,
      },
    ]);
    const loans = dbInstance.collection<LoanMongo>("loans");
    await loans.insertOne({
      _id: loan_oid,
      user_id: borrower_id,
      score: "AAA",
      roi: 17,
      goal: 100000,
      term: 2,
      raised: 0,
      expiry: new Date(),
      status: "waiting for approval",
      pending: 0,
      payments_delayed: 0,
      payments_done: 0,
    });
    const response = await request
      .post("/graphql")
      .send({
        query: `mutation ApproveLoanMutation($input: ApproveLoanInput!) {
          approveLoan(input: $input) {
            error
            loan {
              id
            }
          }
        }`,
        variables: {
          input: {
            loan_gid: base64Name(loan_oid.toHexString(), "Loan"),
          },
        },
        operationName: "ApproveLoanMutation",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        jwt.sign(
          {
            id: support_id,
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
      .set("Cookie", `id=${support_id}; isSupport=true`);
    expect(response.body.data.approveLoan.error).toBeFalsy();
    expect(response.body.data.approveLoan.loan).toBeTruthy();
    const user = await users.findOne({
      id: support_id,
    });
    expect(user).toEqual({
      _id: support_oid,
      id: support_id,
      account_available: 100000,
      account_to_be_paid: 0,
      account_total: 100000,
      account_withheld: 0,
    });
    const allLoans = await loans.find({ _id: loan_oid }).toArray();
    expect(allLoans.length).toBe(1);
    expect(
      allLoans.map((loan) => ({
        ROI: loan.roi,
        user_id: loan.user_id,
        goal: loan.goal,
        raised: loan.raised,
        score: loan.score,
        status: loan.status,
        term: loan.term,
      }))
    ).toEqual([
      {
        ROI: 17,
        user_id: borrower_id,
        goal: 100000,
        raised: 0,
        score: "AAA",
        status: "financing",
        term: 2,
      },
    ]);
  });
});
