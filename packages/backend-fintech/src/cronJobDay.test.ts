import { addDays, addMonths, startOfDay } from "date-fns";
import { Db, MongoClient, ObjectId } from "mongodb";
import { dayFunction } from "./cronJobDay";
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
    client = await MongoClient.connect(
      (global as unknown as { __MONGO_URI__: string }).__MONGO_URI__,
      {}
    );
    dbInstance = client.db("fintech");
  });

  afterAll(async () => {
    await client.close();
  });

  it("dayFunction test", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    const transactions =
      dbInstance.collection<TransactionMongo>("transactions");
    const loans = dbInstance.collection<LoanMongo>("loans");
    const investments = dbInstance.collection<InvestmentMongo>("investments");
    const now = new Date();
    const user1_oid = new ObjectId();
    const user2_oid = new ObjectId();
    const user3_oid = new ObjectId();
    const user1_id = "wHHR1SUBT0dspoF4YUO11";
    const user2_id = "wHHR1SUBT0dspoF4YUO12";
    const user3_id = "wHHR1SUBT0dspoF4YUO13";
    await users.insertMany([
      {
        _id: user1_oid,
        id: user1_id,
        accountAvailable: 1000000,
        accountToBePaid: 0,
        accountTotal: 1000000,
      },
      {
        _id: user2_oid,
        id: user2_id,
        accountAvailable: 100000,
        accountToBePaid: 206125,
        accountTotal: 306125,
      },
      {
        _id: user3_oid,
        id: user3_id,
        accountAvailable: 0,
        accountToBePaid: 0,
        accountTotal: 0,
      },
    ]);
    const loan1_oid = new ObjectId();
    const loan2_oid = new ObjectId();
    const loan3_oid = new ObjectId();
    const loan4_oid = new ObjectId();
    await loans.insertMany([
      {
        _id: loan1_oid,
        id_user: user1_id,
        score: "AAA",
        ROI: 17,
        goal: 100000,
        expiry: now,
        term: 2,
        raised: 100000,
        status: "to be paid",
        scheduledPayments: [
          {
            amortize: 50989,
            scheduledDate: addDays(startOfDay(now), -30),
            status: "delayed",
          },
          {
            amortize: 50989,
            scheduledDate: startOfDay(now),
            status: "to be paid",
          },
        ],
        pending: 0,
      },
      {
        _id: loan2_oid,
        id_user: user1_id,
        score: "AAA",
        ROI: 17,
        goal: 100000,
        expiry: now,
        term: 2,
        raised: 100000,
        status: "to be paid",
        scheduledPayments: [
          {
            amortize: 50989,
            scheduledDate: startOfDay(addMonths(now, -2)),
            status: "paid",
          },
          {
            amortize: 50989,
            scheduledDate: addDays(startOfDay(now), -30),
            status: "delayed",
          },
        ],
        pending: 0,
      },
      {
        _id: loan3_oid,
        id_user: user3_id,
        score: "AAA",
        ROI: 17,
        goal: 100000,
        expiry: now,
        term: 2,
        raised: 100000,
        status: "to be paid",
        scheduledPayments: [
          {
            amortize: 50989,
            scheduledDate: startOfDay(addMonths(now, -2)),
            status: "paid",
          },
          {
            amortize: 50989,
            scheduledDate: addDays(startOfDay(now), -30),
            status: "delayed",
          },
        ],
        pending: 0,
      },
      {
        _id: loan4_oid,
        id_user: "wHHR1SUBT0dspoF4YUO14",
        score: "AAA",
        ROI: 17,
        goal: 100000,
        expiry: now,
        term: 2,
        raised: 0,
        status: "financing",
        scheduledPayments: null,
        pending: 100000,
      },
    ]);
    const invest1_oid = new ObjectId();
    const invest2_oid = new ObjectId();
    const invest3_oid = new ObjectId();
    await investments.insertMany([
      {
        _id: invest1_oid,
        id_borrower: user1_id,
        id_lender: user2_id,
        _id_loan: loan1_oid,
        quantity: 100000,
        status: "delay payment",
        created_at: now,
        updated_at: now,
        payments: 0,
        term: 2,
        ROI: 17,
        moratory: 720,
        interest_to_earn: 1978,
        paid_already: 0,
        to_be_paid: 0,
        amortize: 50989,
      },
      {
        _id: invest2_oid,
        id_borrower: user1_id,
        id_lender: user2_id,
        _id_loan: loan2_oid,
        quantity: 100000,
        status: "delay payment",
        created_at: now,
        updated_at: now,
        payments: 1,
        term: 2,
        ROI: 17,
        moratory: 720,
        interest_to_earn: 1978,
        paid_already: 0,
        to_be_paid: 0,
        amortize: 50989,
      },
      {
        _id: invest3_oid,
        id_borrower: user3_id,
        id_lender: user2_id,
        _id_loan: loan3_oid,
        quantity: 100000,
        status: "delay payment",
        created_at: now,
        updated_at: now,
        payments: 1,
        term: 2,
        ROI: 17,
        moratory: 720,
        interest_to_earn: 1978,
        paid_already: 50989,
        to_be_paid: 50989,
        amortize: 50989,
      },
    ]);
    await dayFunction(dbInstance);
    const user = await users.findOne({
      id: user1_id,
    });
    expect(user).toEqual({
      _id: user1_oid,
      id: user1_id,
      accountAvailable: 896578,
      accountToBePaid: 0,
      accountTotal: 896578,
    });
    const user2 = await users.findOne({
      id: user2_id,
    });
    expect(user2).toEqual({
      _id: user2_oid,
      id: user2_id,
      accountAvailable: 202026,
      accountToBePaid: 104123,
      accountTotal: 306149,
    });
    const transactions_borrower = await transactions
      .find({
        id_user: user1_id,
      })
      .toArray();
    expect(transactions_borrower.length).toEqual(2);
    expect(
      transactions_borrower.map((transaction) => ({
        ...transaction,
        _id: "",
        created_at: "",
      }))
    ).toEqual([
      {
        _id: "",
        created_at: "",
        quantity: -51711,
        type: "payment",
        id_user: user1_id,
      },
      {
        _id: "",
        created_at: "",
        quantity: -51711,
        type: "payment",
        id_user: user1_id,
      },
    ]);
    const transactions_lender = await transactions
      .find({
        id_user: user2_id,
      })
      .toArray();
    expect(transactions_lender.length).toEqual(2);
    expect(
      transactions_lender.map((transaction) => ({
        ...transaction,
        _id: "",
        created_at: "",
      }))
    ).toEqual([
      {
        _id: "",
        created_at: "",
        quantity: 50989,
        type: "collect",
        id_borrower: user1_id,
        _id_loan: loan1_oid,
        id_user: user2_id,
      },
      {
        _id: "",
        created_at: "",
        quantity: 50989,
        type: "collect",
        id_borrower: user1_id,
        _id_loan: loan2_oid,
        id_user: user2_id,
      },
    ]);
    const allLoans = await loans
      .find({
        id_user: {
          $in: [user1_id, user3_id],
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
        status: "to be paid",
        scheduledPayments: [
          {
            amortize: 50989,
            status: "paid",
            scheduledDate: addDays(startOfDay(now), -30),
          },
          {
            amortize: 50989,
            status: "to be paid",
            scheduledDate: startOfDay(now),
          },
        ],
      },
      {
        scheduledPayments: [
          {
            amortize: 50989,
            scheduledDate: startOfDay(addMonths(now, -2)),
            status: "paid",
          },
          {
            amortize: 50989,
            scheduledDate: addDays(startOfDay(now), -30),
            status: "paid",
          },
        ],
        status: "paid",
      },
      {
        scheduledPayments: [
          {
            amortize: 50989,
            scheduledDate: startOfDay(addMonths(now, -2)),
            status: "paid",
          },
          {
            amortize: 50989,
            scheduledDate: addDays(startOfDay(now), -30),
            status: "delayed",
          },
        ],
        status: "to be paid",
      },
    ]);
    const allInvestments = await investments
      .find({
        id_lender: user2_id,
      })
      .toArray();
    expect(allInvestments.length).toBe(3);
    expect(allInvestments).toEqual([
      {
        ROI: 17,
        _id: invest1_oid,
        id_borrower: user1_id,
        id_lender: user2_id,
        _id_loan: loan1_oid,
        moratory: 720,
        payments: 1,
        quantity: 100000,
        status: "up to date",
        term: 2,
        updated_at: now,
        created_at: now,
        interest_to_earn: 1978,
        to_be_paid: 50989,
        paid_already: 50989,
        amortize: 50989,
      },
      {
        ROI: 17,
        _id: invest2_oid,
        id_borrower: user1_id,
        id_lender: user2_id,
        _id_loan: loan2_oid,
        created_at: now,
        moratory: 720,
        payments: 2,
        quantity: 100000,
        status: "paid",
        term: 2,
        updated_at: now,
        interest_to_earn: 1978,
        to_be_paid: 0,
        paid_already: 101978,
        amortize: 50989,
      },
      {
        ROI: 17,
        _id: invest3_oid,
        id_borrower: user3_id,
        id_lender: user2_id,
        _id_loan: loan3_oid,
        created_at: now,
        moratory: 744,
        payments: 1,
        quantity: 100000,
        status: "delay payment",
        term: 2,
        updated_at: now,
        interest_to_earn: 1978,
        to_be_paid: 50989,
        paid_already: 50989,
        amortize: 50989,
      },
    ]);
  });
});
