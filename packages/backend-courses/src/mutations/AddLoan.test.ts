import { app } from "../app";
import supertest from "supertest";
import { Db, MongoClient, ObjectId } from "mongodb";
import { LoanMongo, UserMongo } from "../types";
import { jwt } from "../utils";

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
  publishMyLoanInsert: jest.fn,
}));

const request = supertest(app);

describe("AddLoan tests", () => {
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

  it("test AddLoan valid access token", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    await users.insertOne({
      _id: new ObjectId("000000000000000000000006"),
      id: "wHHR1SUBT0dspoF4YUO20",
      accountAvailable: 100000,
      accountToBePaid: 0,
      accountTotal: 100000,
    });
    const response = await request
      .post("/graphql")
      .send({
        query: `mutation AddLoanMutation($input: AddLoanInput!) {
          addLoan(input: $input) {
            error
            validAccessToken
          }
        }`,
        variables: {
          input: {
            goal: "1000.00",
            term: 2,
          },
        },
        operationName: "AddLoanMutation",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        jwt.sign(
          {
            id: "wHHR1SUBT0dspoF4YUO20",
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
            id: "wHHR1SUBT0dspoF4YUO20",
            isBorrower: false,
            isLender: true,
            isSupport: false,
          },
          "REFRESHSECRET",
          { expiresIn: "15m" }
        )}`
      );
    expect(response.body.data.addLoan.error).toBeFalsy();
    expect(response.body.data.addLoan.validAccessToken).toBeTruthy();
    const user = await users.findOne({
      id: "wHHR1SUBT0dspoF4YUO20",
    });
    expect(user).toEqual({
      _id: new ObjectId("000000000000000000000006"),
      id: "wHHR1SUBT0dspoF4YUO20",
      accountAvailable: 100000,
      accountToBePaid: 0,
      accountTotal: 100000,
    });
    const loans = dbInstance.collection<LoanMongo>("loans");
    const allLoans = await loans
      .find({ id_user: "wHHR1SUBT0dspoF4YUO20" })
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
        pending: loan.pending,
      }))
    ).toEqual([
      {
        ROI: 17,
        id_user: "wHHR1SUBT0dspoF4YUO20",
        goal: 100000,
        raised: 0,
        scheduledPayments: null,
        score: "AAA",
        status: "waiting for approval",
        term: 2,
        pending: 100000,
      },
    ]);
  });
});
