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
    dbInstance = client.db("fintech");
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
        accountAvailable: 100000,
        accountToBePaid: 0,
        accountTotal: 100000,
      },
      {
        _id: borrower_oid,
        id: borrower_id,
        accountAvailable: 100000,
        accountToBePaid: 0,
        accountTotal: 100000,
      },
    ]);
    const loans = dbInstance.collection<LoanMongo>("loans");
    await loans.insertOne({
      _id: loan_oid,
      id_user: borrower_id,
      score: "AAA",
      ROI: 17,
      goal: 100000,
      term: 2,
      raised: 0,
      expiry: new Date(),
      status: "waiting for approval",
      scheduledPayments: null,
      pending: 0,
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
      accountAvailable: 100000,
      accountToBePaid: 0,
      accountTotal: 100000,
    });
    const allLoans = await loans.find({ _id: loan_oid }).toArray();
    expect(allLoans.length).toBe(1);
    expect(
      allLoans.map((loan) => ({
        ROI: loan.ROI,
        id_user: loan.id_user,
        goal: loan.goal,
        raised: loan.raised,
        scheduledPayments: loan.scheduledPayments,
        score: loan.score,
        status: loan.status,
        term: loan.term,
      }))
    ).toEqual([
      {
        ROI: 17,
        id_user: borrower_id,
        goal: 100000,
        raised: 0,
        scheduledPayments: null,
        score: "AAA",
        status: "financing",
        term: 2,
      },
    ]);
  });
});
