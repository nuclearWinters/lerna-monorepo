import { addDays, startOfDay } from "date-fns";
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
    client = await MongoClient.connect(process.env.MONGO_URL as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    dbInstance = client.db("fintech");
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
        _id: new ObjectId("000000000000000000000011"),
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
        _id: new ObjectId("000000000000000000000100"),
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
            _id_loan: new ObjectId("000000000000000000000012"),
            quantity: 10000,
            term: 3,
            ROI: 17,
            payments: 0,
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
      _id: new ObjectId("000000000000000000000012"),
      _id_user: new ObjectId("000000000000000000000011"),
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
          scheduledDate: addDays(startOfDay(new Date()), -60),
          status: "delayed",
        },
        {
          amortize: 34215,
          scheduledDate: addDays(startOfDay(new Date()), -30),
          status: "delayed",
        },

        {
          amortize: 34215,
          scheduledDate: startOfDay(new Date()),
          status: "to be paid",
        },
      ],
      investors: [
        {
          _id_lender: new ObjectId("000000000000000000000100"),
          quantity: 10000,
        },
      ],
    });
    const now = new Date();
    await investments.insertOne({
      _id: new ObjectId("000000000000000000000110"),
      _id_borrower: new ObjectId("000000000000000000000011"),
      _id_lender: new ObjectId("000000000000000000000100"),
      _id_loan: new ObjectId("000000000000000000000012"),
      quantity: 10000,
      status: "delay payment",
      created: now,
      updated: now,
      payments: 0,
      term: 3,
      ROI: 17,
      moratory: 0,
    });
    await dayFunction(dbInstance);
    const user = await users.findOne({
      _id: new ObjectId("000000000000000000000011"),
    });
    expect(user).toEqual({
      _id: new ObjectId("000000000000000000000011"),
      name: "Armando Narcizo",
      apellidoPaterno: "Rueda",
      apellidoMaterno: "Peréz",
      RFC: "",
      CURP: "",
      clabe: "",
      mobile: "",
      accountAvailable: 30115,
      investments: [],
    });
    const user2 = await users.findOne({
      _id: new ObjectId("000000000000000000000100"),
    });
    expect(user2).toEqual({
      _id: new ObjectId("000000000000000000000100"),
      name: "Luis Fernando",
      apellidoPaterno: "Rueda",
      apellidoMaterno: "Peréz",
      RFC: "",
      CURP: "",
      clabe: "",
      mobile: "",
      accountAvailable: 106986,
      investments: [
        {
          ROI: 17,
          _id_loan: new ObjectId("000000000000000000000012"),
          payments: 2,
          quantity: 10000,
          term: 3,
        },
        {
          ROI: 10,
          _id_loan: new ObjectId("000000000000000000000102"),
          payments: 0,
          quantity: 10000,
          term: 6,
        },
      ],
    });
    const allTransactions = await transactions
      .find({
        _id_user: new ObjectId("000000000000000000000011"),
      })
      .toArray();
    expect(allTransactions.length).toEqual(1);
    expect(allTransactions[0].history.length).toEqual(2);
    expect(
      allTransactions[0].history.map((transaction) => ({
        ...transaction,
        _id: "",
        created: "",
      }))
    ).toEqual([
      {
        _id: "",
        created: "",
        quantity: -35185,
        type: "PAYMENT",
      },
      {
        _id: "",
        created: "",
        quantity: -34700,
        type: "PAYMENT",
      },
    ]);
    const allLoans = await loans
      .find({
        _id_user: new ObjectId("000000000000000000000011"),
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
        status: "to be paid",
        scheduledPayments: [
          {
            amortize: 34215,
            status: "paid",
            scheduledDate: addDays(startOfDay(new Date()), -60),
          },
          {
            amortize: 34215,
            status: "paid",
            scheduledDate: addDays(startOfDay(new Date()), -30),
          },
          {
            amortize: 34215,
            status: "to be paid",
            scheduledDate: startOfDay(new Date()),
          },
        ],
      },
    ]);
    const allInvestments = await investments
      .find({
        _id: new ObjectId("000000000000000000000110"),
      })
      .toArray();
    expect(allInvestments.length).toBe(1);
    expect(allInvestments).toEqual([
      {
        ROI: 17,
        _id: new ObjectId("000000000000000000000110"),
        _id_borrower: new ObjectId("000000000000000000000011"),
        _id_lender: new ObjectId("000000000000000000000100"),
        _id_loan: new ObjectId("000000000000000000000012"),
        moratory: 146,
        payments: 2,
        quantity: 10000,
        status: "up to date",
        term: 3,
        updated: now,
        created: now,
      },
    ]);
  });
});
