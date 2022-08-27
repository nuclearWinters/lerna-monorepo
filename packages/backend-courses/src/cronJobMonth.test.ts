import { addMonths, startOfDay } from "date-fns";
import { Db, MongoClient, ObjectId } from "mongodb";
import { monthFunction } from "./cronJobMonth";
import {
  TransactionMongo,
  InvestmentMongo,
  LoanMongo,
  UserMongo,
} from "./types";

jest.mock("./subscriptions/subscriptionsUtils", () => ({
  publishUser: jest.fn,
  publishTransactionInsert: jest.fn,
  publishLoanUpdate: jest.fn,
  publishInvestmentUpdate: jest.fn,
}));

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

describe("cronJobs tests", () => {
  let client: MongoClient;
  let dbInstance: Db;

  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URL as string, {});
    dbInstance = client.db("fintech");
  });

  afterAll(async () => {
    await client.close();
  });

  it("monthFunction test", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    const transactions =
      dbInstance.collection<TransactionMongo>("transactions");
    const loans = dbInstance.collection<LoanMongo>("loans");
    const investments = dbInstance.collection<InvestmentMongo>("investments");
    await users.insertMany([
      {
        _id: new ObjectId("000000000000000000000013"),
        id: "wHHR1SUBT0dspoF4YUOw7",
        accountAvailable: 1000000,
        accountToBePaid: 0,
        accountTotal: 1000000,
      },
      {
        _id: new ObjectId("000000000000000000000101"),
        id: "wHHR1SUBT0dspoF4YUOw8",
        accountAvailable: 100000,
        accountToBePaid: 203956,
        accountTotal: 303956,
      },
      {
        _id: new ObjectId("000000000000000000000113"),
        id: "wHHR1SUBT0dspoF4YUOw9",
        accountAvailable: 0,
        accountToBePaid: 0,
        accountTotal: 0,
      },
    ]);
    await loans.insertMany([
      {
        _id: new ObjectId("000000000000000000000014"),
        id_user: "wHHR1SUBT0dspoF4YUOw7",
        score: "AAA",
        ROI: 17,
        goal: 100000,
        expiry: new Date(),
        term: 2,
        raised: 100000,
        status: "to be paid",
        scheduledPayments: [
          {
            amortize: 50989,
            scheduledDate: addMonths(startOfDay(new Date()), -1),
            status: "paid",
          },
          {
            amortize: 50989,
            scheduledDate: startOfDay(new Date()),
            status: "to be paid",
          },
        ],
        pending: 0,
      },
      {
        _id: new ObjectId("000000000000000000000015"),
        id_user: "wHHR1SUBT0dspoF4YUOw7",
        score: "AAA",
        ROI: 17,
        goal: 100000,
        expiry: new Date(),
        term: 2,
        raised: 100000,
        status: "to be paid",
        scheduledPayments: [
          {
            amortize: 50989,
            scheduledDate: startOfDay(new Date()),
            status: "to be paid",
          },
          {
            amortize: 50989,
            scheduledDate: addMonths(startOfDay(new Date()), -1),
            status: "to be paid",
          },
        ],
        pending: 0,
      },
      {
        _id: new ObjectId("000000000000000000000016"),
        id_user: "wHHR1SUBT0dspoF4YUO10",
        score: "AAA",
        ROI: 17,
        goal: 100000,
        expiry: new Date(),
        term: 2,
        raised: 0,
        status: "financing",
        scheduledPayments: null,
        pending: 0,
      },
      {
        _id: new ObjectId("000000000000000000000102"),
        id_user: "wHHR1SUBT0dspoF4YUOw9",
        score: "AAA",
        ROI: 17,
        goal: 100000,
        expiry: new Date(),
        term: 2,
        raised: 100000,
        status: "to be paid",
        scheduledPayments: [
          {
            amortize: 50989,
            scheduledDate: addMonths(startOfDay(new Date()), -1),
            status: "paid",
          },
          {
            amortize: 50989,
            scheduledDate: startOfDay(new Date()),
            status: "to be paid",
          },
        ],
        pending: 0,
      },
    ]);
    const now = new Date();
    await investments.insertMany([
      {
        _id: new ObjectId("000000000000000000000111"),
        id_borrower: "wHHR1SUBT0dspoF4YUOw7",
        id_lender: "wHHR1SUBT0dspoF4YUOw8",
        _id_loan: new ObjectId("000000000000000000000014"),
        quantity: 100000,
        status: "up to date",
        created: now,
        updated: now,
        payments: 1,
        term: 2,
        ROI: 17,
        moratory: 0,
        interest_to_earn: 1978,
        to_be_paid: 50989,
        paid_already: 50989,
        amortize: 50989,
      },
      {
        _id: new ObjectId("000000000000000000000114"),
        id_borrower: "wHHR1SUBT0dspoF4YUOw7",
        id_lender: "wHHR1SUBT0dspoF4YUOw8",
        _id_loan: new ObjectId("000000000000000000000015"),
        quantity: 100000,
        status: "up to date",
        created: now,
        updated: now,
        payments: 0,
        term: 2,
        ROI: 17,
        moratory: 0,
        interest_to_earn: 1978,
        to_be_paid: 101978,
        paid_already: 0,
        amortize: 50989,
      },
      {
        _id: new ObjectId("000000000000000000000112"),
        id_borrower: "wHHR1SUBT0dspoF4YUOw9",
        id_lender: "wHHR1SUBT0dspoF4YUOw8",
        _id_loan: new ObjectId("000000000000000000000102"),
        quantity: 100000,
        status: "up to date",
        created: now,
        updated: now,
        payments: 1,
        term: 2,
        ROI: 17,
        moratory: 0,
        interest_to_earn: 1978,
        to_be_paid: 50989,
        paid_already: 50989,
        amortize: 50989,
      },
    ]);
    await monthFunction(dbInstance);
    const user = await users.findOne({
      id: "wHHR1SUBT0dspoF4YUOw7",
    });
    expect(user).toEqual({
      _id: new ObjectId("000000000000000000000013"),
      id: "wHHR1SUBT0dspoF4YUOw7",
      accountAvailable: 898022,
      accountToBePaid: 0,
      accountTotal: 898022,
    });
    const user2 = await users.findOne({
      id: "wHHR1SUBT0dspoF4YUOw8",
    });
    expect(user2).toEqual({
      _id: new ObjectId("000000000000000000000101"),
      id: "wHHR1SUBT0dspoF4YUOw8",
      accountAvailable: 201978,
      accountToBePaid: 101978,
      accountTotal: 303956,
    });
    const borrower_transactions = await transactions
      .find({
        id_user: "wHHR1SUBT0dspoF4YUOw7",
      })
      .toArray();
    expect(borrower_transactions.length).toEqual(2);
    expect(
      borrower_transactions.map((transaction) => ({
        ...transaction,
        _id: "",
        created: "",
      }))
    ).toEqual([
      {
        _id: "",
        created: "",
        quantity: -50989,
        type: "payment",
        id_user: "wHHR1SUBT0dspoF4YUOw7",
      },
      {
        _id: "",
        created: "",
        quantity: -50989,
        type: "payment",
        id_user: "wHHR1SUBT0dspoF4YUOw7",
      },
    ]);
    const lender_transactions = await transactions
      .find({
        id_user: "wHHR1SUBT0dspoF4YUOw8",
      })
      .toArray();
    expect(lender_transactions.length).toEqual(2);
    expect(
      lender_transactions.map((transaction) => ({
        ...transaction,
        _id: "",
        created: "",
      }))
    ).toEqual([
      {
        _id: "",
        created: "",
        quantity: 50989,
        type: "collect",
        id_borrower: "wHHR1SUBT0dspoF4YUOw7",
        _id_loan: new ObjectId("000000000000000000000014"),
        id_user: "wHHR1SUBT0dspoF4YUOw8",
      },
      {
        _id: "",
        id_borrower: "wHHR1SUBT0dspoF4YUOw7",
        _id_loan: new ObjectId("000000000000000000000015"),
        created: "",
        quantity: 50989,
        type: "collect",
        id_user: "wHHR1SUBT0dspoF4YUOw8",
      },
    ]);
    const allLoans = await loans
      .find({
        id_user: {
          $in: ["wHHR1SUBT0dspoF4YUOw7", "wHHR1SUBT0dspoF4YUOw9"],
        },
      })
      .toArray();
    expect(allLoans.length).toEqual(3);
    expect(
      allLoans.map((loan) => ({
        status: loan.status,
        scheduledPayments: loan.scheduledPayments,
      }))
    ).toEqual([
      {
        status: "paid",
        scheduledPayments: [
          {
            amortize: 50989,
            status: "paid",
            scheduledDate: addMonths(startOfDay(new Date()), -1),
          },
          {
            amortize: 50989,
            status: "paid",
            scheduledDate: startOfDay(new Date()),
          },
        ],
      },
      {
        status: "to be paid",
        scheduledPayments: [
          {
            amortize: 50989,
            status: "paid",
            scheduledDate: startOfDay(new Date()),
          },
          {
            amortize: 50989,
            status: "to be paid",
            scheduledDate: addMonths(startOfDay(new Date()), -1),
          },
        ],
      },
      {
        scheduledPayments: [
          {
            amortize: 50989,
            scheduledDate: addMonths(startOfDay(new Date()), -1),
            status: "paid",
          },
          {
            amortize: 50989,
            scheduledDate: startOfDay(new Date()),
            status: "delayed",
          },
        ],
        status: "to be paid",
      },
    ]);
    const allInvestments = await investments
      .find({
        id_lender: "wHHR1SUBT0dspoF4YUOw8",
      })
      .toArray();
    expect(allInvestments.length).toBe(3);
    expect(allInvestments).toEqual([
      {
        ROI: 17,
        _id: new ObjectId("000000000000000000000111"),
        id_borrower: "wHHR1SUBT0dspoF4YUOw7",
        id_lender: "wHHR1SUBT0dspoF4YUOw8",
        _id_loan: new ObjectId("000000000000000000000014"),
        moratory: 0,
        payments: 2,
        quantity: 100000,
        status: "paid",
        term: 2,
        updated: now,
        created: now,
        interest_to_earn: 1978,
        to_be_paid: 0,
        paid_already: 101978,
        amortize: 50989,
      },
      {
        ROI: 17,
        _id: new ObjectId("000000000000000000000114"),
        id_borrower: "wHHR1SUBT0dspoF4YUOw7",
        id_lender: "wHHR1SUBT0dspoF4YUOw8",
        _id_loan: new ObjectId("000000000000000000000015"),
        moratory: 0,
        payments: 1,
        quantity: 100000,
        status: "up to date",
        term: 2,
        updated: now,
        created: now,
        interest_to_earn: 1978,
        to_be_paid: 50989,
        paid_already: 50989,
        amortize: 50989,
      },
      {
        ROI: 17,
        _id: new ObjectId("000000000000000000000112"),
        id_borrower: "wHHR1SUBT0dspoF4YUOw9",
        id_lender: "wHHR1SUBT0dspoF4YUOw8",
        _id_loan: new ObjectId("000000000000000000000102"),
        created: now,
        moratory: 0,
        payments: 1,
        quantity: 100000,
        status: "delay payment",
        term: 2,
        updated: now,
        interest_to_earn: 1978,
        to_be_paid: 50989,
        paid_already: 50989,
        amortize: 50989,
      },
    ]);
  });
});
