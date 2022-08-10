import { addDays, addMonths, startOfDay } from "date-fns";
import { Db, MongoClient, ObjectId } from "mongodb";
import { dayFunction } from "./cronJobDay";
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
    dbInstance = client.db("fintech2");
  });

  afterAll(async () => {
    await client.close();
  });

  it("dayFunction test", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    const transactions =
      dbInstance.collection<BucketTransactionMongo>("transactions");
    const loans = dbInstance.collection<LoanMongo>("loans");
    const investments = dbInstance.collection<InvestmentMongo>("investments");
    await users.insertMany([
      {
        _id: new ObjectId("300000000000000000000011"),
        id: "wHHR1SUBT0dspoF4YUO11",
        accountAvailable: 1000000,
        investments: [],
      },
      {
        _id: new ObjectId("300000000000000000000100"),
        id: "wHHR1SUBT0dspoF4YUO12",
        accountAvailable: 100000,
        investments: [
          {
            _id_loan: new ObjectId("300000000000000000000012"),
            quantity: 10000,
            term: 2,
            ROI: 17,
            payments: 0,
          },
          {
            _id_loan: new ObjectId("300000000000000000000102"),
            quantity: 10000,
            term: 2,
            ROI: 17,
            payments: 1,
          },
          {
            _id_loan: new ObjectId("300000000000000000000021"),
            quantity: 10000,
            term: 2,
            ROI: 17,
            payments: 1,
          },
        ],
      },
      {
        _id: new ObjectId("300000000000000000000017"),
        id: "wHHR1SUBT0dspoF4YUO13",
        accountAvailable: 0,
        investments: [],
      },
    ]);
    await loans.insertMany([
      {
        _id: new ObjectId("300000000000000000000012"),
        id_user: "wHHR1SUBT0dspoF4YUO11",
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
            scheduledDate: addDays(startOfDay(new Date()), -30),
            status: "delayed",
          },
          {
            amortize: 50989,
            scheduledDate: startOfDay(new Date()),
            status: "to be paid",
          },
        ],
        investors: [
          {
            id_lender: "wHHR1SUBT0dspoF4YUO12",
            quantity: 10000,
          },
        ],
      },
      {
        _id: new ObjectId("300000000000000000000020"),
        id_user: "wHHR1SUBT0dspoF4YUO11",
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
            scheduledDate: startOfDay(addMonths(new Date(), -2)),
            status: "paid",
          },
          {
            amortize: 50989,
            scheduledDate: addDays(startOfDay(new Date()), -30),
            status: "delayed",
          },
        ],
        investors: [
          {
            id_lender: "wHHR1SUBT0dspoF4YUO12",
            quantity: 10000,
          },
        ],
      },
      {
        _id: new ObjectId("300000000000000000000022"),
        id_user: "wHHR1SUBT0dspoF4YUO13",
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
            scheduledDate: startOfDay(addMonths(new Date(), -2)),
            status: "paid",
          },
          {
            amortize: 50989,
            scheduledDate: addDays(startOfDay(new Date()), -30),
            status: "delayed",
          },
        ],
        investors: [
          {
            id_lender: "wHHR1SUBT0dspoF4YUO12",
            quantity: 10000,
          },
        ],
      },
      {
        _id: new ObjectId("300000000000000000000018"),
        id_user: "wHHR1SUBT0dspoF4YUO14",
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
    ]);
    const now = new Date();
    await investments.insertMany([
      {
        _id: new ObjectId("000000000000000000000110"),
        id_borrower: "wHHR1SUBT0dspoF4YUO11",
        id_lender: "wHHR1SUBT0dspoF4YUO12",
        _id_loan: new ObjectId("300000000000000000000012"),
        quantity: 10000,
        status: "delay payment",
        created: now,
        updated: now,
        payments: 0,
        term: 2,
        ROI: 17,
        moratory: 0,
      },
      {
        _id: new ObjectId("000000000000000000000115"),
        id_borrower: "wHHR1SUBT0dspoF4YUO11",
        id_lender: "wHHR1SUBT0dspoF4YUO12",
        _id_loan: new ObjectId("300000000000000000000020"),
        quantity: 10000,
        status: "delay payment",
        created: now,
        updated: now,
        payments: 0,
        term: 2,
        ROI: 17,
        moratory: 0,
      },
      {
        _id: new ObjectId("000000000000000000000116"),
        id_borrower: "wHHR1SUBT0dspoF4YUO13",
        id_lender: "wHHR1SUBT0dspoF4YUO12",
        _id_loan: new ObjectId("300000000000000000000022"),
        quantity: 10000,
        status: "delay payment",
        created: now,
        updated: now,
        payments: 0,
        term: 2,
        ROI: 17,
        moratory: 0,
      },
    ]);
    await dayFunction(dbInstance);
    const user = await users.findOne({
      id: "wHHR1SUBT0dspoF4YUO11",
    });
    expect(user).toEqual({
      _id: new ObjectId("300000000000000000000011"),
      id: "wHHR1SUBT0dspoF4YUO11",
      accountAvailable: 896576,
      investments: [],
    });
    const user2 = await users.findOne({
      id: "wHHR1SUBT0dspoF4YUO12",
    });
    expect(user2).toEqual({
      _id: new ObjectId("300000000000000000000100"),
      id: "wHHR1SUBT0dspoF4YUO12",
      accountAvailable: 110340,
      investments: [
        {
          ROI: 17,
          _id_loan: new ObjectId("300000000000000000000012"),
          payments: 1,
          quantity: 10000,
          term: 2,
        },
        {
          ROI: 17,
          _id_loan: new ObjectId("300000000000000000000102"),
          payments: 1,
          quantity: 10000,
          term: 2,
        },
        {
          ROI: 17,
          _id_loan: new ObjectId("300000000000000000000021"),
          payments: 1,
          quantity: 10000,
          term: 2,
        },
      ],
    });
    const transactions_borrower = await transactions
      .find({
        id_user: "wHHR1SUBT0dspoF4YUO11",
      })
      .toArray();
    expect(transactions_borrower.length).toEqual(1);
    expect(transactions_borrower[0].history.length).toEqual(2);
    expect(
      transactions_borrower[0].history.map((transaction) => ({
        ...transaction,
        _id: "",
        created: "",
      }))
    ).toEqual([
      {
        _id: "",
        created: "",
        quantity: -51712,
        type: "payment",
      },
      {
        _id: "",
        created: "",
        quantity: -51712,
        type: "payment",
      },
    ]);
    const transactions_lender = await transactions
      .find({
        id_user: "wHHR1SUBT0dspoF4YUO12",
      })
      .toArray();
    expect(transactions_lender.length).toEqual(1);
    expect(transactions_lender[0].history.length).toEqual(2);
    expect(
      transactions_lender[0].history.map((transaction) => ({
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
        id_borrower: "wHHR1SUBT0dspoF4YUO11",
        _id_loan: new ObjectId("300000000000000000000012"),
      },
      {
        _id: "",
        created: "",
        quantity: 5098,
        type: "collect",
        id_borrower: "wHHR1SUBT0dspoF4YUO11",
        _id_loan: new ObjectId("300000000000000000000020"),
      },
    ]);
    const allLoans = await loans
      .find({
        id_user: {
          $in: ["wHHR1SUBT0dspoF4YUO11", "wHHR1SUBT0dspoF4YUO13"],
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
            scheduledDate: addDays(startOfDay(new Date()), -30),
          },
          {
            amortize: 50989,
            status: "to be paid",
            scheduledDate: startOfDay(new Date()),
          },
        ],
      },
      {
        scheduledPayments: [
          {
            amortize: 50989,
            scheduledDate: startOfDay(addMonths(new Date(), -2)),
            status: "paid",
          },
          {
            amortize: 50989,
            scheduledDate: addDays(startOfDay(new Date()), -30),
            status: "paid",
          },
        ],
        status: "paid",
      },
      {
        scheduledPayments: [
          {
            amortize: 50989,
            scheduledDate: startOfDay(addMonths(new Date(), -2)),
            status: "paid",
          },
          {
            amortize: 50989,
            scheduledDate: addDays(startOfDay(new Date()), -30),
            status: "delayed",
          },
        ],
        status: "to be paid",
      },
    ]);
    const allInvestments = await investments
      .find({
        id_lender: "wHHR1SUBT0dspoF4YUO12",
      })
      .toArray();
    expect(allInvestments.length).toBe(3);
    expect(allInvestments).toEqual([
      {
        ROI: 17,
        _id: new ObjectId("000000000000000000000110"),
        id_borrower: "wHHR1SUBT0dspoF4YUO11",
        id_lender: "wHHR1SUBT0dspoF4YUO12",
        _id_loan: new ObjectId("300000000000000000000012"),
        moratory: 73,
        payments: 1,
        quantity: 10000,
        status: "up to date",
        term: 2,
        updated: now,
        created: now,
      },
      {
        ROI: 17,
        _id: new ObjectId("000000000000000000000115"),
        id_borrower: "wHHR1SUBT0dspoF4YUO11",
        id_lender: "wHHR1SUBT0dspoF4YUO12",
        _id_loan: new ObjectId("300000000000000000000020"),
        created: now,
        moratory: 73,
        payments: 1,
        quantity: 10000,
        status: "paid",
        term: 2,
        updated: now,
      },
      {
        ROI: 17,
        _id: new ObjectId("000000000000000000000116"),
        id_borrower: "wHHR1SUBT0dspoF4YUO13",
        id_lender: "wHHR1SUBT0dspoF4YUO12",
        _id_loan: new ObjectId("300000000000000000000022"),
        created: now,
        moratory: 0,
        payments: 0,
        quantity: 10000,
        status: "delay payment",
        term: 2,
        updated: now,
      },
    ]);
  });
});
