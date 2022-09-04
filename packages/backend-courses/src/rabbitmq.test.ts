import { Db, MongoClient, ObjectId } from "mongodb";
import {
  TransactionMongo,
  InvestmentMongo,
  LoanMongo,
  UserMongo,
} from "./types";
import { sendLend } from "./rabbitmq";

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

describe("rabbitMQ tests", () => {
  let client: MongoClient;
  let dbInstance: Db;

  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URL as string, {});
    dbInstance = client.db("fintech2");
  });

  afterAll(async () => {
    await client.close();
  });

  it("sendLend test", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    await users.insertMany([
      {
        _id: new ObjectId("000000000000000000000004"),
        id: "wHHR1SUBT0dspoF4YUO31",
        accountAvailable: 100000,
        accountToBePaid: 0,
        accountTotal: 100000,
        transactions: [],
        myLoans: [],
        myInvestments: [],
      },
      {
        _id: new ObjectId("000000000000000000000005"),
        id: "wHHR1SUBT0dspoF4YUO32",
        accountAvailable: 100000,
        accountToBePaid: 0,
        accountTotal: 100000,
        transactions: [],
        myLoans: [],
        myInvestments: [],
      },
    ]);
    const loans = dbInstance.collection<LoanMongo>("loans");
    await loans.insertMany([
      {
        _id: new ObjectId("000000000000000000000002"),
        id_user: "wHHR1SUBT0dspoF4YUO32",
        score: "AAA",
        ROI: 10,
        goal: 50000,
        term: 2,
        raised: 0,
        expiry: new Date(),
        status: "financing",
        scheduledPayments: null,
        pending: 50000,
      },
      {
        _id: new ObjectId("000000000000000000000003"),
        id_user: "wHHR1SUBT0dspoF4YUO32",
        score: "AAA",
        ROI: 10,
        goal: 50000,
        term: 2,
        raised: 0,
        expiry: new Date(),
        status: "financing",
        scheduledPayments: null,
        pending: 50000,
      },
    ]);
    const transactions =
      dbInstance.collection<TransactionMongo>("transactions");
    await sendLend(
      {
        content: Buffer.from(
          JSON.stringify({
            id_lender: "wHHR1SUBT0dspoF4YUO31",
            id_borrower: "wHHR1SUBT0dspoF4YUO32",
            quantity: 10000,
            id_loan: "000000000000000000000002",
            goal: 50000,
            raised: 0,
            term: 2,
            ROI: 10,
            TEM: 0.007974140428903764,
          })
        ),
      } as any,
      dbInstance,
      {
        ack: jest.fn(),
      } as any
    );
    await sendLend(
      {
        content: Buffer.from(
          JSON.stringify({
            id_lender: "wHHR1SUBT0dspoF4YUO31",
            id_borrower: "wHHR1SUBT0dspoF4YUO32",
            quantity: 5000,
            id_loan: "000000000000000000000003",
            goal: 50000,
            raised: 0,
            term: 2,
            ROI: 10,
            TEM: 0.007974140428903764,
          })
        ),
      } as any,
      dbInstance,
      {
        ack: jest.fn(),
      } as any
    );
    const user = await users.findOne({
      id: "wHHR1SUBT0dspoF4YUO31",
    });
    expect(user).toEqual({
      _id: new ObjectId("000000000000000000000004"),
      id: "wHHR1SUBT0dspoF4YUO31",
      accountAvailable: 85000,
      accountToBePaid: 0,
      accountTotal: 85000,
      myInvestments: [],
      myLoans: [],
      transactions: [],
    });
    const allTransactions = await transactions
      .find({ id_user: "wHHR1SUBT0dspoF4YUO31" })
      .toArray();
    expect(allTransactions.length).toBe(2);
    expect(
      allTransactions.map((transaction) => ({
        type: transaction.type,
        quantity: transaction.quantity,
        id_borrower: transaction.id_borrower,
        _id_loan: transaction._id_loan?.toHexString(),
      }))
    ).toEqual([
      {
        type: "invest",
        quantity: 10000,
        id_borrower: "wHHR1SUBT0dspoF4YUO32",
        _id_loan: "000000000000000000000002",
      },
      {
        type: "invest",
        quantity: 5000,
        id_borrower: "wHHR1SUBT0dspoF4YUO32",
        _id_loan: "000000000000000000000003",
      },
    ]);
    const allLoans = await loans
      .find({ id_user: "wHHR1SUBT0dspoF4YUO32" })
      .toArray();
    expect(allLoans.length).toBe(2);
    expect(
      allLoans.map((loan) => ({
        raised: loan.raised,
        status: loan.status,
        pending: loan.pending,
      }))
    ).toEqual([
      {
        raised: 10000,
        status: "financing",
        pending: 40000,
      },
      {
        raised: 5000,
        status: "financing",
        pending: 45000,
      },
    ]);
    const investments = dbInstance.collection<InvestmentMongo>("investments");
    const allInvestments = await investments
      .find({ id_lender: "wHHR1SUBT0dspoF4YUO31" })
      .toArray();
    expect(allInvestments.length).toBe(2);
    expect(
      allInvestments.map((investment) => ({
        ...investment,
        _id: "",
        updated: "",
        created: "",
      }))
    ).toEqual([
      {
        quantity: 10000,
        ROI: 10,
        payments: 0,
        moratory: 0,
        term: 2,
        interest_to_earn: 0,
        to_be_paid: 0,
        paid_already: 0,
        amortize: 0,
        id_borrower: "wHHR1SUBT0dspoF4YUO32",
        id_lender: "wHHR1SUBT0dspoF4YUO31",
        _id_loan: new ObjectId("000000000000000000000002"),
        status: "financing",
        _id: "",
        updated: "",
        created: "",
      },
      {
        quantity: 5000,
        ROI: 10,
        moratory: 0,
        term: 2,
        payments: 0,
        interest_to_earn: 0,
        to_be_paid: 0,
        paid_already: 0,
        amortize: 0,
        _id_loan: new ObjectId("000000000000000000000003"),
        id_borrower: "wHHR1SUBT0dspoF4YUO32",
        id_lender: "wHHR1SUBT0dspoF4YUO31",
        status: "financing",
        _id: "",
        updated: "",
        created: "",
      },
    ]);
    await sendLend(
      {
        content: Buffer.from(
          JSON.stringify({
            id_lender: "wHHR1SUBT0dspoF4YUO31",
            id_borrower: "wHHR1SUBT0dspoF4YUO32",
            quantity: 40000,
            id_loan: "000000000000000000000002",
            goal: 50000,
            raised: 0,
            term: 2,
            ROI: 10,
            TEM: 0.007974140428903764,
          })
        ),
      } as any,
      dbInstance,
      {
        ack: jest.fn(),
      } as any
    );
    await sendLend(
      {
        content: Buffer.from(
          JSON.stringify({
            id_lender: "wHHR1SUBT0dspoF4YUO31",
            id_borrower: "wHHR1SUBT0dspoF4YUO32",
            quantity: 45000,
            id_loan: "000000000000000000000003",
            goal: 50000,
            raised: 0,
            term: 2,
            ROI: 10,
            TEM: 0.007974140428903764,
          })
        ),
      } as any,
      dbInstance,
      {
        ack: jest.fn(),
      } as any
    );
    const user2 = await users.findOne({
      id: "wHHR1SUBT0dspoF4YUO31",
    });
    const _id_transaction = new ObjectId("000000000000000000000000");
    const date_transaction = new Date("2001-01-01");
    if (user2) {
      user2.transactions = user2?.transactions.map((tr) => ({
        ...tr,
        _id: _id_transaction,
        created: date_transaction,
      }));
    }
    expect(user2).toEqual({
      _id: new ObjectId("000000000000000000000004"),
      id: "wHHR1SUBT0dspoF4YUO31",
      accountAvailable: 0,
      accountToBePaid: 101196,
      accountTotal: 101196,
      myInvestments: [],
      myLoans: [],
      transactions: [
        {
          _id: _id_transaction,
          _id_loan: new ObjectId("000000000000000000000003"),
          created: date_transaction,
          id_borrower: "wHHR1SUBT0dspoF4YUO32",
          id_user: "wHHR1SUBT0dspoF4YUO31",
          quantity: 45000,
          type: "invest",
        },
        {
          _id: _id_transaction,
          _id_loan: new ObjectId("000000000000000000000002"),
          created: date_transaction,
          id_borrower: "wHHR1SUBT0dspoF4YUO32",
          id_user: "wHHR1SUBT0dspoF4YUO31",
          quantity: 40000,
          type: "invest",
        },
      ],
    });
    const user3 = await users.findOne({
      id: "wHHR1SUBT0dspoF4YUO32",
    });
    if (user3) {
      user3.transactions = user3?.transactions.map((tr) => ({
        ...tr,
        _id: _id_transaction,
        created: date_transaction,
      }));
    }
    expect(user3).toEqual({
      _id: new ObjectId("000000000000000000000005"),
      id: "wHHR1SUBT0dspoF4YUO32",
      accountAvailable: 200000,
      accountToBePaid: 0,
      accountTotal: 200000,
      myInvestments: [],
      myLoans: [],
      transactions: [
        {
          _id: _id_transaction,
          created: date_transaction,
          id_user: "wHHR1SUBT0dspoF4YUO32",
          quantity: 50000,
          type: "credit",
        },
        {
          _id: _id_transaction,
          created: date_transaction,
          id_user: "wHHR1SUBT0dspoF4YUO32",
          quantity: 50000,
          type: "credit",
        },
      ],
    });
    const allTransactions2 = await transactions
      .find({ id_user: "wHHR1SUBT0dspoF4YUO31" })
      .toArray();
    expect(allTransactions2.length).toBe(4);
    expect(
      allTransactions2.map((transaction) => ({
        type: transaction.type,
        quantity: transaction.quantity,
        id_borrower: transaction.id_borrower,
        _id_loan: transaction._id_loan?.toHexString(),
      }))
    ).toEqual([
      {
        type: "invest",
        quantity: 10000,
        id_borrower: "wHHR1SUBT0dspoF4YUO32",
        _id_loan: "000000000000000000000002",
      },
      {
        type: "invest",
        quantity: 5000,
        id_borrower: "wHHR1SUBT0dspoF4YUO32",
        _id_loan: "000000000000000000000003",
      },
      {
        type: "invest",
        quantity: 40000,
        id_borrower: "wHHR1SUBT0dspoF4YUO32",
        _id_loan: "000000000000000000000002",
      },
      {
        type: "invest",
        quantity: 45000,
        id_borrower: "wHHR1SUBT0dspoF4YUO32",
        _id_loan: "000000000000000000000003",
      },
    ]);
    const allLoans2 = await loans
      .find({ id_user: "wHHR1SUBT0dspoF4YUO32" })
      .toArray();
    expect(allLoans2.length).toBe(2);
    expect(
      allLoans2.map((loan) => ({
        raised: loan.raised,
        status: loan.status,
        scheduledPayments: loan.scheduledPayments?.map((payment) => ({
          amortize: payment.amortize,
          status: payment.status,
        })),
        pending: loan.pending,
      }))
    ).toEqual([
      {
        raised: 50000,
        status: "to be paid",
        scheduledPayments: [
          {
            amortize: 25299,
            status: "to be paid",
          },
          {
            amortize: 25299,
            status: "to be paid",
          },
        ],
        pending: 0,
      },
      {
        raised: 50000,
        status: "to be paid",
        scheduledPayments: [
          {
            amortize: 25299,
            status: "to be paid",
          },
          {
            amortize: 25299,
            status: "to be paid",
          },
        ],
        pending: 0,
      },
    ]);
    const investments2 = dbInstance.collection<InvestmentMongo>("investments");
    const allInvestments2 = await investments2
      .find({ id_lender: "wHHR1SUBT0dspoF4YUO31" })
      .toArray();
    expect(allInvestments2.length).toBe(2);
    expect(
      allInvestments2.map((investment) => ({
        ...investment,
        _id: "",
        updated: "",
        created: "",
      }))
    ).toEqual([
      {
        id_borrower: "wHHR1SUBT0dspoF4YUO32",
        id_lender: "wHHR1SUBT0dspoF4YUO31",
        _id_loan: new ObjectId("000000000000000000000002"),
        quantity: 50000,
        ROI: 10,
        moratory: 0,
        term: 2,
        payments: 0,
        interest_to_earn: 598,
        to_be_paid: 50598,
        amortize: 25299,
        paid_already: 0,
        status: "financing",
        _id: "",
        updated: "",
        created: "",
      },
      {
        quantity: 50000,
        ROI: 10,
        moratory: 0,
        term: 2,
        payments: 0,
        interest_to_earn: 598,
        to_be_paid: 50598,
        amortize: 25299,
        paid_already: 0,
        _id_loan: new ObjectId("000000000000000000000003"),
        status: "financing",
        id_borrower: "wHHR1SUBT0dspoF4YUO32",
        id_lender: "wHHR1SUBT0dspoF4YUO31",
        _id: "",
        updated: "",
        created: "",
      },
    ]);
  });

  it("test AddLends not enough money valid access token", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    await users.insertMany([
      {
        _id: new ObjectId("400000000000000000000004"),
        id: "wHHR1SUBT0dspoF4YUO33",
        accountAvailable: 10000,
        accountToBePaid: 0,
        accountTotal: 10000,
        transactions: [],
        myLoans: [],
        myInvestments: [],
      },
      {
        _id: new ObjectId("400000000000000000000005"),
        id: "wHHR1SUBT0dspoF4YUO34",
        accountAvailable: 10000,
        accountToBePaid: 0,
        accountTotal: 10000,
        transactions: [],
        myLoans: [],
        myInvestments: [],
      },
    ]);
    const loans = dbInstance.collection<LoanMongo>("loans");
    await loans.insertMany([
      {
        _id: new ObjectId("400000000000000000000002"),
        id_user: "wHHR1SUBT0dspoF4YUO34",
        score: "AAA",
        ROI: 10,
        goal: 50000,
        term: 2,
        raised: 0,
        expiry: new Date(),
        status: "financing",
        scheduledPayments: null,
        pending: 50000,
      },
    ]);
    const transactions =
      dbInstance.collection<TransactionMongo>("transactions");
    await sendLend(
      {
        content: Buffer.from(
          JSON.stringify({
            id_lender: "wHHR1SUBT0dspoF4YUO33",
            id_borrower: "wHHR1SUBT0dspoF4YUO34",
            quantity: 15000,
            id_loan: "400000000000000000000002",
            goal: 50000,
            raised: 0,
            term: 2,
            ROI: 10,
            TEM: 0.007974140428903764,
          })
        ),
      } as any,
      dbInstance,
      {
        ack: jest.fn(),
      } as any
    );
    const user = await users.findOne({
      id: "wHHR1SUBT0dspoF4YUO33",
    });
    expect(user).toEqual({
      _id: new ObjectId("400000000000000000000004"),
      id: "wHHR1SUBT0dspoF4YUO33",
      accountAvailable: 10000,
      accountToBePaid: 0,
      accountTotal: 10000,
      myInvestments: [],
      myLoans: [],
      transactions: [],
    });
    const allTransactions = await transactions
      .find({ id_user: "wHHR1SUBT0dspoF4YUO33" })
      .toArray();
    expect(allTransactions.length).toBe(0);
    const allLoans = await loans
      .find({ id_user: "wHHR1SUBT0dspoF4YUO34" })
      .toArray();
    expect(allLoans.length).toBe(1);
    expect(
      allLoans.map((loan) => ({
        raised: loan.raised,
        status: loan.status,
        pending: loan.pending,
      }))
    ).toEqual([
      {
        raised: 0,
        status: "financing",
        pending: 50000,
      },
    ]);
    const investments = dbInstance.collection<InvestmentMongo>("investments");
    const allInvestments = await investments
      .find({ id_lender: "wHHR1SUBT0dspoF4YUO33" })
      .toArray();
    expect(allInvestments.length).toBe(0);
  });

  it("test AddLends no investments done valid access token", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    await users.insertMany([
      {
        _id: new ObjectId("500000000000000000000004"),
        id: "wHHR1SUBT0dspoF4YUO35",
        accountAvailable: 10000,
        accountToBePaid: 0,
        accountTotal: 10000,
        transactions: [],
        myLoans: [],
        myInvestments: [],
      },
      {
        _id: new ObjectId("500000000000000000000005"),
        id: "wHHR1SUBT0dspoF4YUO36",
        accountAvailable: 10000,
        accountToBePaid: 0,
        accountTotal: 10000,
        transactions: [],
        myLoans: [],
        myInvestments: [],
      },
    ]);
    const loans = dbInstance.collection<LoanMongo>("loans");
    await loans.insertMany([
      {
        _id: new ObjectId("500000000000000000000002"),
        id_user: "wHHR1SUBT0dspoF4YUO36",
        score: "AAA",
        ROI: 10,
        goal: 50000,
        term: 2,
        raised: 50000,
        expiry: new Date(),
        status: "to be paid",
        scheduledPayments: null,
        pending: 0,
      },
    ]);
    const transactions =
      dbInstance.collection<TransactionMongo>("transactions");
    await sendLend(
      {
        content: Buffer.from(
          JSON.stringify({
            id_lender: "wHHR1SUBT0dspoF4YUO35",
            id_borrower: "wHHR1SUBT0dspoF4YUO36",
            quantity: 5000,
            id_loan: "500000000000000000000002",
            goal: 50000,
            raised: 0,
            term: 2,
            ROI: 10,
            TEM: 0.007974140428903764,
          })
        ),
      } as any,
      dbInstance,
      {
        ack: jest.fn(),
      } as any
    );
    const user = await users.findOne({
      id: "wHHR1SUBT0dspoF4YUO35",
    });
    expect(user).toEqual({
      _id: new ObjectId("500000000000000000000004"),
      id: "wHHR1SUBT0dspoF4YUO35",
      accountAvailable: 10000,
      accountToBePaid: 0,
      accountTotal: 10000,
      myInvestments: [],
      myLoans: [],
      transactions: [],
    });
    const allTransactions = await transactions
      .find({ id_user: "wHHR1SUBT0dspoF4YUO35" })
      .toArray();
    expect(allTransactions.length).toBe(0);
    const allLoans = await loans
      .find({ id_user: "wHHR1SUBT0dspoF4YUO36" })
      .toArray();
    expect(allLoans.length).toBe(1);
    expect(
      allLoans.map((loan) => ({
        raised: loan.raised,
        status: loan.status,
        pending: loan.pending,
      }))
    ).toEqual([
      {
        raised: 50000,
        status: "to be paid",
        pending: 0,
      },
    ]);
    const investments = dbInstance.collection<InvestmentMongo>("investments");
    const allInvestments = await investments
      .find({ id_lender: "wHHR1SUBT0dspoF4YUO35" })
      .toArray();
    expect(allInvestments.length).toBe(0);
  });

  it("test AddLends not all investments are done valid access token", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    await users.insertMany([
      {
        _id: new ObjectId("600000000000000000000004"),
        id: "wHHR1SUBT0dspoF4YUO37",
        accountAvailable: 10000,
        accountToBePaid: 0,
        accountTotal: 10000,
        transactions: [],
        myLoans: [],
        myInvestments: [],
      },
      {
        _id: new ObjectId("600000000000000000000005"),
        id: "wHHR1SUBT0dspoF4YUO38",
        accountAvailable: 10000,
        accountToBePaid: 0,
        accountTotal: 10000,
        transactions: [],
        myLoans: [],
        myInvestments: [],
      },
    ]);
    const loans = dbInstance.collection<LoanMongo>("loans");
    await loans.insertMany([
      {
        _id: new ObjectId("600000000000000000000002"),
        id_user: "wHHR1SUBT0dspoF4YUO38",
        score: "AAA",
        ROI: 10,
        goal: 50000,
        term: 2,
        raised: 50000,
        expiry: new Date(),
        status: "to be paid",
        scheduledPayments: null,
        pending: 0,
      },
      {
        _id: new ObjectId("600000000000000000000003"),
        id_user: "wHHR1SUBT0dspoF4YUO38",
        score: "AAA",
        ROI: 10,
        goal: 50000,
        term: 2,
        raised: 0,
        expiry: new Date(),
        status: "financing",
        scheduledPayments: null,
        pending: 50000,
      },
    ]);
    const transactions =
      dbInstance.collection<TransactionMongo>("transactions");
    await sendLend(
      {
        content: Buffer.from(
          JSON.stringify({
            id_lender: "wHHR1SUBT0dspoF4YUO37",
            id_borrower: "wHHR1SUBT0dspoF4YUO38",
            quantity: 5000,
            id_loan: "600000000000000000000002",
            goal: 50000,
            raised: 0,
            term: 2,
            ROI: 10,
            TEM: 0.007974140428903764,
          })
        ),
      } as any,
      dbInstance,
      {
        ack: jest.fn(),
      } as any
    );
    await sendLend(
      {
        content: Buffer.from(
          JSON.stringify({
            id_lender: "wHHR1SUBT0dspoF4YUO37",
            id_borrower: "wHHR1SUBT0dspoF4YUO38",
            quantity: 5000,
            id_loan: "600000000000000000000003",
            goal: 50000,
            raised: 0,
            term: 2,
            ROI: 10,
            TEM: 0.007974140428903764,
          })
        ),
      } as any,
      dbInstance,
      {
        ack: jest.fn(),
      } as any
    );
    const user = await users.findOne({
      id: "wHHR1SUBT0dspoF4YUO37",
    });
    expect(user).toEqual({
      _id: new ObjectId("600000000000000000000004"),
      id: "wHHR1SUBT0dspoF4YUO37",
      accountAvailable: 5000,
      accountToBePaid: 0,
      accountTotal: 5000,
      myInvestments: [],
      myLoans: [],
      transactions: [],
    });
    const allTransactions = await transactions
      .find({ id_user: "wHHR1SUBT0dspoF4YUO37" })
      .toArray();
    expect(allTransactions.length).toBe(1);
    expect(
      allTransactions.map((transaction) => ({
        type: transaction.type,
        quantity: transaction.quantity,
        id_borrower: transaction.id_borrower,
        _id_loan: transaction._id_loan?.toHexString(),
      }))
    ).toEqual([
      {
        type: "invest",
        quantity: 5000,
        id_borrower: "wHHR1SUBT0dspoF4YUO38",
        _id_loan: "600000000000000000000003",
      },
    ]);
    const allLoans = await loans
      .find({ id_user: "wHHR1SUBT0dspoF4YUO38" })
      .toArray();
    expect(allLoans.length).toBe(2);
    expect(
      allLoans.map((loan) => ({
        raised: loan.raised,
        status: loan.status,
        pending: loan.pending,
      }))
    ).toEqual([
      {
        raised: 50000,
        status: "to be paid",
        pending: 0,
      },
      {
        raised: 5000,
        status: "financing",
        pending: 45000,
      },
    ]);
    const investments = dbInstance.collection<InvestmentMongo>("investments");
    const allInvestments = await investments
      .find({ id_lender: "wHHR1SUBT0dspoF4YUO37" })
      .toArray();
    expect(allInvestments.length).toBe(1);
    expect(
      allInvestments.map((investment) => ({
        ...investment,
        _id: "",
        created: "",
        updated: "",
      }))
    ).toEqual([
      {
        _id_loan: new ObjectId("600000000000000000000003"),
        quantity: 5000,
        ROI: 10,
        payments: 0,
        moratory: 0,
        term: 2,
        interest_to_earn: 0,
        to_be_paid: 0,
        paid_already: 0,
        amortize: 0,
        id_borrower: "wHHR1SUBT0dspoF4YUO38",
        id_lender: "wHHR1SUBT0dspoF4YUO37",
        status: "financing",
        created: "",
        updated: "",
        _id: "",
      },
    ]);
  });
});
