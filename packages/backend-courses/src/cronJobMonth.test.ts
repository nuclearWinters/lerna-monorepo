import { addMonths, startOfDay } from "date-fns";
import { Db, MongoClient, ObjectId } from "mongodb";
import { monthFunction } from "./cronJobMonth";
import {
  BucketTransactionMongo,
  InvestmentMongo,
  LoanMongo,
  UserMongo,
} from "./types";

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
      dbInstance.collection<BucketTransactionMongo>("transactions");
    const loans = dbInstance.collection<LoanMongo>("loans");
    const investments = dbInstance.collection<InvestmentMongo>("investments");
    await users.insertMany([
      {
        _id: new ObjectId("000000000000000000000013"),
        id: "wHHR1SUBT0dspoF4YUOw7",
        accountAvailable: 1000000,
        investments: [],
      },
      {
        _id: new ObjectId("000000000000000000000101"),
        id: "wHHR1SUBT0dspoF4YUOw8",
        accountAvailable: 100000,
        investments: [
          {
            _id_loan: new ObjectId("000000000000000000000014"),
            quantity: 10000,
            term: 2,
            ROI: 17,
            payments: 1,
          },
          {
            _id_loan: new ObjectId("000000000000000000000015"),
            quantity: 10000,
            term: 2,
            ROI: 17,
            payments: 0,
          },
          {
            _id_loan: new ObjectId("000000000000000000000102"),
            quantity: 10000,
            term: 2,
            ROI: 17,
            payments: 1,
          },
        ],
      },
      {
        _id: new ObjectId("000000000000000000000113"),
        id: "wHHR1SUBT0dspoF4YUOw9",
        accountAvailable: 0,
        investments: [],
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
        investors: [
          {
            id_lender: "wHHR1SUBT0dspoF4YUOw8",
            quantity: 10000,
          },
        ],
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
        investors: [
          {
            id_lender: "wHHR1SUBT0dspoF4YUOw8",
            quantity: 10000,
          },
        ],
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
        investors: [],
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
        investors: [
          {
            id_lender: "wHHR1SUBT0dspoF4YUOw8",
            quantity: 10000,
          },
        ],
      },
    ]);
    const now = new Date();
    await investments.insertMany([
      {
        _id: new ObjectId("000000000000000000000111"),
        id_borrower: "wHHR1SUBT0dspoF4YUOw7",
        id_lender: "wHHR1SUBT0dspoF4YUOw8",
        _id_loan: new ObjectId("000000000000000000000014"),
        quantity: 10000,
        status: "up to date",
        created: now,
        updated: now,
        payments: 1,
        term: 2,
        ROI: 17,
        moratory: 0,
      },
      {
        _id: new ObjectId("000000000000000000000114"),
        id_borrower: "wHHR1SUBT0dspoF4YUOw7",
        id_lender: "wHHR1SUBT0dspoF4YUOw8",
        _id_loan: new ObjectId("000000000000000000000015"),
        quantity: 10000,
        status: "up to date",
        created: now,
        updated: now,
        payments: 0,
        term: 2,
        ROI: 17,
        moratory: 0,
      },
      {
        _id: new ObjectId("000000000000000000000112"),
        id_borrower: "wHHR1SUBT0dspoF4YUOw9",
        id_lender: "wHHR1SUBT0dspoF4YUOw8",
        _id_loan: new ObjectId("000000000000000000000102"),
        quantity: 10000,
        status: "up to date",
        created: now,
        updated: now,
        payments: 1,
        term: 2,
        ROI: 17,
        moratory: 0,
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
      investments: [],
    });
    const user2 = await users.findOne({
      id: "wHHR1SUBT0dspoF4YUOw8",
    });
    expect(user2).toEqual({
      _id: new ObjectId("000000000000000000000101"),
      id: "wHHR1SUBT0dspoF4YUOw8",
      accountAvailable: 110196,
      investments: [
        {
          ROI: 17,
          _id_loan: new ObjectId("000000000000000000000015"),
          payments: 1,
          quantity: 10000,
          term: 2,
        },
        {
          ROI: 17,
          _id_loan: new ObjectId("000000000000000000000102"),
          payments: 1,
          quantity: 10000,
          term: 2,
        },
      ],
    });
    const borrower_transactions = await transactions
      .find({
        id_user: "wHHR1SUBT0dspoF4YUOw7",
      })
      .toArray();
    expect(borrower_transactions.length).toEqual(1);
    expect(borrower_transactions[0].history.length).toEqual(2);
    expect(
      borrower_transactions[0].history.map((transaction) => ({
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
      },
      {
        _id: "",
        created: "",
        quantity: -50989,
        type: "payment",
      },
    ]);
    const lender_transactions = await transactions
      .find({
        id_user: "wHHR1SUBT0dspoF4YUOw8",
      })
      .toArray();
    expect(lender_transactions.length).toEqual(1);
    expect(lender_transactions[0].history.length).toEqual(2);
    expect(
      lender_transactions[0].history.map((transaction) => ({
        ...transaction,
        _id: "",
        created: "",
      }))
    ).toEqual([
      {
        _id: "",
        created: "",
        quantity: 5098,
        type: "collect",
        id_borrower: "wHHR1SUBT0dspoF4YUOw7",
        _id_loan: new ObjectId("000000000000000000000014"),
      },
      {
        _id: "",
        id_borrower: "wHHR1SUBT0dspoF4YUOw7",
        _id_loan: new ObjectId("000000000000000000000015"),
        created: "",
        quantity: 5098,
        type: "collect",
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
        quantity: 10000,
        status: "paid",
        term: 2,
        updated: now,
        created: now,
      },
      {
        ROI: 17,
        _id: new ObjectId("000000000000000000000114"),
        id_borrower: "wHHR1SUBT0dspoF4YUOw7",
        id_lender: "wHHR1SUBT0dspoF4YUOw8",
        _id_loan: new ObjectId("000000000000000000000015"),
        moratory: 0,
        payments: 1,
        quantity: 10000,
        status: "up to date",
        term: 2,
        updated: now,
        created: now,
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
        quantity: 10000,
        status: "delay payment",
        term: 2,
        updated: now,
      },
    ]);
  });
});
