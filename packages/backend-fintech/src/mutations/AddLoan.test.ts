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

  it("test AddLoan valid access token", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    const _id = new ObjectId();
    const id = "wHHR1SUBT0dspoF4YUO20";
    await users.insertOne({
      _id,
      id,
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
            id,
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
      .set("Cookie", `id=` + id);
    expect(response.body.data.addLoan.error).toBeFalsy();
    const user = await users.findOne({
      id,
    });
    expect(user).toEqual({
      _id,
      id,
      accountAvailable: 100000,
      accountToBePaid: 0,
      accountTotal: 100000,
    });
    const loans = dbInstance.collection<LoanMongo>("loans");
    const allLoans = await loans.find({ id_user: id }).toArray();
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
        id_user: id,
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
