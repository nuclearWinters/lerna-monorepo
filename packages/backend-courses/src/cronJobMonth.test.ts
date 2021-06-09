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
    client = await MongoClient.connect(process.env.MONGO_URL as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
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
        name: "Armando Narcizo",
        apellidoPaterno: "Rueda",
        apellidoMaterno: "Peréz",
        RFC: "",
        CURP: "",
        clabe: "",
        mobile: "",
        accountAvailable: 100000,
        investments: [],
      },
      {
        _id: new ObjectId("000000000000000000000101"),
        name: "Luis Fernando",
        apellidoPaterno: "Rueda",
        apellidoMaterno: "Peréz",
        RFC: "",
        CURP: "",
        clabe: "",
        mobile: "",
        accountAvailable: 100000,
        investments: [
          {
            _id_loan: new ObjectId("000000000000000000000014"),
            quantity: 10000,
            term: 3,
            ROI: 17,
            payments: 2,
          },
          {
            _id_loan: new ObjectId("000000000000000000000102"),
            quantity: 10000,
            term: 6,
            ROI: 10,
            payments: 0,
          },
        ],
      },
    ]);
    await loans.insertOne({
      _id: new ObjectId("000000000000000000000014"),
      _id_user: new ObjectId("000000000000000000000013"),
      score: "AAA",
      ROI: 17,
      goal: 100000,
      expiry: new Date(),
      term: 3,
      raised: 100000,
      status: "to be paid",
      scheduledPayments: [
        {
          amortize: 34215,
          scheduledDate: addMonths(startOfDay(new Date()), -2),
          status: "paid",
        },
        {
          amortize: 34215,
          scheduledDate: addMonths(startOfDay(new Date()), -1),
          status: "paid",
        },
        {
          amortize: 34215,
          scheduledDate: startOfDay(new Date()),
          status: "to be paid",
        },
      ],
      investors: [
        {
          _id_lender: new ObjectId("000000000000000000000101"),
          quantity: 10000,
        },
      ],
    });
    const now = new Date();
    await investments.insertOne({
      _id: new ObjectId("000000000000000000000111"),
      _id_borrower: new ObjectId("000000000000000000000013"),
      _id_lender: new ObjectId("000000000000000000000101"),
      _id_loan: new ObjectId("000000000000000000000014"),
      quantity: 10000,
      status: "up to date",
      created: now,
      updated: now,
      payments: 2,
      term: 3,
      ROI: 17,
      moratory: 0,
    });
    await monthFunction(dbInstance);
    const user = await users.findOne({
      _id: new ObjectId("000000000000000000000013"),
    });
    expect(user).toEqual({
      _id: new ObjectId("000000000000000000000013"),
      name: "Armando Narcizo",
      apellidoPaterno: "Rueda",
      apellidoMaterno: "Peréz",
      RFC: "",
      CURP: "",
      clabe: "",
      mobile: "",
      accountAvailable: 65785,
      investments: [],
    });
    const user2 = await users.findOne({
      _id: new ObjectId("000000000000000000000101"),
    });
    expect(user2).toEqual({
      _id: new ObjectId("000000000000000000000101"),
      name: "Luis Fernando",
      apellidoPaterno: "Rueda",
      apellidoMaterno: "Peréz",
      RFC: "",
      CURP: "",
      clabe: "",
      mobile: "",
      accountAvailable: 103421,
      investments: [
        {
          ROI: 10,
          _id_loan: new ObjectId("000000000000000000000102"),
          payments: 0,
          quantity: 10000,
          term: 6,
        },
      ],
    });
    const borrower_transactions = await transactions
      .find({
        _id_user: new ObjectId("000000000000000000000013"),
      })
      .toArray();
    expect(borrower_transactions.length).toEqual(1);
    expect(borrower_transactions[0].history.length).toEqual(1);
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
        quantity: -34215,
        type: "PAYMENT",
      },
    ]);
    const lender_transactions = await transactions
      .find({
        _id_user: new ObjectId("000000000000000000000101"),
      })
      .toArray();
    expect(lender_transactions.length).toEqual(1);
    expect(lender_transactions[0].history.length).toEqual(1);
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
        quantity: 3421,
        type: "CREDIT",
      },
    ]);
    const allLoans = await loans
      .find({
        _id_user: new ObjectId("000000000000000000000013"),
      })
      .toArray();
    expect(allLoans.length).toEqual(1);
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
            amortize: 34215,
            status: "paid",
            scheduledDate: addMonths(startOfDay(new Date()), -2),
          },
          {
            amortize: 34215,
            status: "paid",
            scheduledDate: addMonths(startOfDay(new Date()), -1),
          },
          {
            amortize: 34215,
            status: "paid",
            scheduledDate: startOfDay(new Date()),
          },
        ],
      },
    ]);
    const allInvestments = await investments
      .find({
        _id: new ObjectId("000000000000000000000111"),
      })
      .toArray();
    expect(allInvestments.length).toBe(1);
    expect(allInvestments).toEqual([
      {
        ROI: 17,
        _id: new ObjectId("000000000000000000000111"),
        _id_borrower: new ObjectId("000000000000000000000013"),
        _id_lender: new ObjectId("000000000000000000000101"),
        _id_loan: new ObjectId("000000000000000000000014"),
        moratory: 0,
        payments: 3,
        quantity: 10000,
        status: "paid",
        term: 3,
        updated: now,
        created: now,
      },
    ]);
  });
});
