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
}));

const request = supertest(app);

describe("ApproveLoan tests", () => {
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

  it("test ApproveLoan valid access token", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    await users.insertMany([
      {
        _id: new ObjectId("000000000000000000000009"),
        id: "wHHR1SUBT0dspoF4YUO21",
        accountAvailable: 100000,
        accountToBePaid: 0,
        accountTotal: 100000,
        transactions: [],
        myLoans: [],
        myInvestments: [],
      },
      {
        _id: new ObjectId("000000000000000000000010"),
        id: "wHHR1SUBT0dspoF4YUO22",
        accountAvailable: 100000,
        accountToBePaid: 0,
        accountTotal: 100000,
        transactions: [],
        myLoans: [
          {
            _id: new ObjectId("000000000000000000000008"),
            id_user: "wHHR1SUBT0dspoF4YUO22",
            score: "AAA",
            ROI: 17,
            goal: 100000,
            term: 2,
            raised: 0,
            expiry: new Date(),
            status: "waiting for approval",
            scheduledPayments: null,
            pending: 0,
          },
        ],
        myInvestments: [],
      },
    ]);
    const loans = dbInstance.collection<LoanMongo>("loans");
    await loans.insertOne({
      _id: new ObjectId("000000000000000000000008"),
      id_user: "wHHR1SUBT0dspoF4YUO22",
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
            validAccessToken
            loan {
              id
            }
          }
        }`,
        variables: {
          input: {
            loan_gid: base64Name("000000000000000000000008", "Loan"),
          },
        },
        operationName: "ApproveLoanMutation",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        jwt.sign(
          {
            id: "wHHR1SUBT0dspoF4YUO21",
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
            id: "wHHR1SUBT0dspoF4YUO21",
            isBorrower: false,
            isLender: true,
            isSupport: false,
          },
          "REFRESHSECRET",
          { expiresIn: "15m" }
        )}`
      );
    expect(response.body.data.approveLoan.error).toBeFalsy();
    expect(response.body.data.approveLoan.validAccessToken).toBeTruthy();
    expect(response.body.data.approveLoan.loan).toBeTruthy();
    const user = await users.findOne({
      id: "wHHR1SUBT0dspoF4YUO22",
    });
    const _id_loan = new ObjectId("000000000000000000000000");
    const date_loan = new Date("2001-01-01");
    if (user) {
      user.myLoans = user?.myLoans.map((loan) => ({
        ...loan,
        _id: _id_loan,
        expiry: date_loan,
      }));
    }
    expect(user).toEqual({
      _id: new ObjectId("000000000000000000000010"),
      id: "wHHR1SUBT0dspoF4YUO22",
      accountAvailable: 100000,
      accountToBePaid: 0,
      accountTotal: 100000,
      myInvestments: [],
      myLoans: [
        {
          ROI: 17,
          _id: _id_loan,
          expiry: date_loan,
          goal: 100000,
          id_user: "wHHR1SUBT0dspoF4YUO22",
          pending: 0,
          raised: 0,
          scheduledPayments: null,
          score: "AAA",
          status: "financing",
          term: 2,
        },
      ],
      transactions: [],
    });
    const allLoans = await loans
      .find({ _id: new ObjectId("000000000000000000000008") })
      .toArray();
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
        id_user: "wHHR1SUBT0dspoF4YUO22",
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
