import { Db, MongoClient, ObjectId } from "mongodb";
import {
  TransactionMongo,
  InvestmentMongo,
  LoanMongo,
  UserMongo,
} from "./types";
import { sendLend } from "./rabbitmq";
import { Channel, Connection, ConsumeMessage } from "amqplib";
jest.mock("amqplib", () => ({
  connect: () => ({
    createChannel: () => ({
      ack: jest.fn,
    }),
  }),
}));
import amqp from "amqplib";

jest.mock("./subscriptions/subscriptionsUtils", () => ({
  publishUser: jest.fn,
  publishTransactionInsert: jest.fn,
  publishLoanUpdate: jest.fn,
  publishInvestmentUpdate: jest.fn,
  publishInvestmentInsert: jest.fn,
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
  let conn: Connection;
  let ch: Channel;

  beforeAll(async () => {
    client = await MongoClient.connect(
      (global as unknown as { __MONGO_URI__: string }).__MONGO_URI__,
      {}
    );
    dbInstance = client.db("fintech");
    conn = await amqp.connect("amqp://rabbitmq:5672");
    ch = await conn.createChannel();
  });

  afterAll(async () => {
    await client.close();
  });

  it("sendLend test", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    const now = new Date();
    const lender_oid = new ObjectId();
    const borrower_oid = new ObjectId();
    await users.insertMany([
      {
        _id: lender_oid,
        id: "wHHR1SUBT0dspoF4YUO31",
        accountAvailable: 100000,
        accountToBePaid: 0,
        accountTotal: 100000,
      },
      {
        _id: borrower_oid,
        id: "wHHR1SUBT0dspoF4YUO32",
        accountAvailable: 100000,
        accountToBePaid: 0,
        accountTotal: 100000,
      },
    ]);
    const loans = dbInstance.collection<LoanMongo>("loans");
    const loan1_oid = new ObjectId();
    const loan2_oid = new ObjectId();
    await loans.insertMany([
      {
        _id: loan1_oid,
        id_user: "wHHR1SUBT0dspoF4YUO32",
        score: "AAA",
        ROI: 10,
        goal: 50000,
        term: 2,
        raised: 0,
        expiry: now,
        status: "financing",
        scheduledPayments: null,
        pending: 50000,
      },
      {
        _id: loan2_oid,
        id_user: "wHHR1SUBT0dspoF4YUO32",
        score: "AAA",
        ROI: 10,
        goal: 50000,
        term: 2,
        raised: 0,
        expiry: now,
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
            id_loan: loan1_oid.toHexString(),
            goal: 50000,
            raised: 0,
            term: 2,
            ROI: 10,
            TEM: 0.007974140428903764,
          })
        ),
      } as ConsumeMessage,
      dbInstance,
      ch
    );
    await sendLend(
      {
        content: Buffer.from(
          JSON.stringify({
            id_lender: "wHHR1SUBT0dspoF4YUO31",
            id_borrower: "wHHR1SUBT0dspoF4YUO32",
            quantity: 5000,
            id_loan: loan2_oid.toHexString(),
            goal: 50000,
            raised: 0,
            term: 2,
            ROI: 10,
            TEM: 0.007974140428903764,
          })
        ),
      } as ConsumeMessage,
      dbInstance,
      ch
    );
    const user = await users.findOne({
      id: "wHHR1SUBT0dspoF4YUO31",
    });
    expect(user).toEqual({
      _id: lender_oid,
      id: "wHHR1SUBT0dspoF4YUO31",
      accountAvailable: 85000,
      accountToBePaid: 0,
      accountTotal: 85000,
    });
    const allTransactions = await transactions
      .find({ id_user: "wHHR1SUBT0dspoF4YUO31" })
      .toArray();
    expect(allTransactions.length).toBe(2);
    expect(
      allTransactions.map((transaction) => {
        return transaction.type === "invest"
          ? {
              type: transaction.type,
              quantity: transaction.quantity,
              id_borrower: transaction.id_borrower,
              _id_loan: transaction._id_loan?.toHexString(),
            }
          : {};
      })
    ).toEqual([
      {
        type: "invest",
        quantity: -10000,
        id_borrower: "wHHR1SUBT0dspoF4YUO32",
        _id_loan: loan1_oid.toHexString(),
      },
      {
        type: "invest",
        quantity: -5000,
        id_borrower: "wHHR1SUBT0dspoF4YUO32",
        _id_loan: loan2_oid.toHexString(),
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
        _id_loan: loan1_oid,
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
        _id_loan: loan2_oid,
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
            id_loan: loan1_oid.toHexString(),
            goal: 50000,
            raised: 0,
            term: 2,
            ROI: 10,
            TEM: 0.007974140428903764,
          })
        ),
      } as ConsumeMessage,
      dbInstance,
      ch
    );
    await sendLend(
      {
        content: Buffer.from(
          JSON.stringify({
            id_lender: "wHHR1SUBT0dspoF4YUO31",
            id_borrower: "wHHR1SUBT0dspoF4YUO32",
            quantity: 45000,
            id_loan: loan2_oid.toHexString(),
            goal: 50000,
            raised: 0,
            term: 2,
            ROI: 10,
            TEM: 0.007974140428903764,
          })
        ),
      } as ConsumeMessage,
      dbInstance,
      ch
    );
    const user2 = await users.findOne({
      id: "wHHR1SUBT0dspoF4YUO31",
    });
    expect(user2).toEqual({
      _id: lender_oid,
      id: "wHHR1SUBT0dspoF4YUO31",
      accountAvailable: 0,
      accountToBePaid: 101196,
      accountTotal: 101196,
    });
    const user3 = await users.findOne({
      id: "wHHR1SUBT0dspoF4YUO32",
    });
    expect(user3).toEqual({
      _id: borrower_oid,
      id: "wHHR1SUBT0dspoF4YUO32",
      accountAvailable: 200000,
      accountToBePaid: 0,
      accountTotal: 200000,
    });
    const allTransactions2 = await transactions
      .find({ id_user: "wHHR1SUBT0dspoF4YUO31" })
      .toArray();
    expect(allTransactions2.length).toBe(4);
    expect(
      allTransactions2.map((transaction) => {
        return transaction.type === "invest"
          ? {
              type: transaction.type,
              quantity: transaction.quantity,
              id_borrower: transaction.id_borrower,
              _id_loan: transaction._id_loan?.toHexString(),
            }
          : {};
      })
    ).toEqual([
      {
        type: "invest",
        quantity: -10000,
        id_borrower: "wHHR1SUBT0dspoF4YUO32",
        _id_loan: loan1_oid.toHexString(),
      },
      {
        type: "invest",
        quantity: -5000,
        id_borrower: "wHHR1SUBT0dspoF4YUO32",
        _id_loan: loan2_oid.toHexString(),
      },
      {
        type: "invest",
        quantity: -40000,
        id_borrower: "wHHR1SUBT0dspoF4YUO32",
        _id_loan: loan1_oid.toHexString(),
      },
      {
        type: "invest",
        quantity: -45000,
        id_borrower: "wHHR1SUBT0dspoF4YUO32",
        _id_loan: loan2_oid.toHexString(),
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
        _id_loan: loan1_oid,
        quantity: 50000,
        ROI: 10,
        moratory: 0,
        term: 2,
        payments: 0,
        interest_to_earn: 598,
        to_be_paid: 50598,
        amortize: 25299,
        paid_already: 0,
        status: "up to date",
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
        _id_loan: loan2_oid,
        status: "up to date",
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
    const now = new Date();
    await users.insertMany([
      {
        _id: new ObjectId("400000000000000000000004"),
        id: "wHHR1SUBT0dspoF4YUO33",
        accountAvailable: 10000,
        accountToBePaid: 0,
        accountTotal: 10000,
      },
      {
        _id: new ObjectId("400000000000000000000005"),
        id: "wHHR1SUBT0dspoF4YUO34",
        accountAvailable: 10000,
        accountToBePaid: 0,
        accountTotal: 10000,
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
        expiry: now,
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
      } as ConsumeMessage,
      dbInstance,
      ch
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
    const now = new Date();
    await users.insertMany([
      {
        _id: new ObjectId("500000000000000000000004"),
        id: "wHHR1SUBT0dspoF4YUO35",
        accountAvailable: 10000,
        accountToBePaid: 0,
        accountTotal: 10000,
      },
      {
        _id: new ObjectId("500000000000000000000005"),
        id: "wHHR1SUBT0dspoF4YUO36",
        accountAvailable: 10000,
        accountToBePaid: 0,
        accountTotal: 10000,
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
        expiry: now,
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
      } as ConsumeMessage,
      dbInstance,
      ch
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
    const now = new Date();
    await users.insertMany([
      {
        _id: new ObjectId("600000000000000000000004"),
        id: "wHHR1SUBT0dspoF4YUO37",
        accountAvailable: 10000,
        accountToBePaid: 0,
        accountTotal: 10000,
      },
      {
        _id: new ObjectId("600000000000000000000005"),
        id: "wHHR1SUBT0dspoF4YUO38",
        accountAvailable: 10000,
        accountToBePaid: 0,
        accountTotal: 10000,
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
        expiry: now,
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
        expiry: now,
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
      } as ConsumeMessage,
      dbInstance,
      ch
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
      } as ConsumeMessage,
      dbInstance,
      ch
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
    });
    const allTransactions = await transactions
      .find({ id_user: "wHHR1SUBT0dspoF4YUO37" })
      .toArray();
    expect(allTransactions.length).toBe(1);
    expect(
      allTransactions.map((transaction) => {
        return transaction.type === "invest"
          ? {
              type: transaction.type,
              quantity: transaction.quantity,
              id_borrower: transaction.id_borrower,
              _id_loan: transaction._id_loan?.toHexString(),
            }
          : {};
      })
    ).toEqual([
      {
        type: "invest",
        quantity: -5000,
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

  it("sendLend test one full investment", async () => {
    const users = dbInstance.collection<UserMongo>("users");
    const now = new Date();
    const lender_oid = new ObjectId();
    const borrower_oid = new ObjectId();
    await users.insertMany([
      {
        _id: lender_oid,
        id: "wHHR1SUBT0dspoF4YUO91",
        accountAvailable: 100000,
        accountToBePaid: 0,
        accountTotal: 100000,
      },
      {
        _id: borrower_oid,
        id: "wHHR1SUBT0dspoF4YUO92",
        accountAvailable: 100000,
        accountToBePaid: 0,
        accountTotal: 100000,
      },
    ]);
    const loans = dbInstance.collection<LoanMongo>("loans");
    const loan1_oid = new ObjectId();
    const loan2_oid = new ObjectId();
    await loans.insertMany([
      {
        _id: loan1_oid,
        id_user: "wHHR1SUBT0dspoF4YUO92",
        score: "AAA",
        ROI: 10,
        goal: 50000,
        term: 2,
        raised: 0,
        expiry: now,
        status: "financing",
        scheduledPayments: null,
        pending: 50000,
      },
      {
        _id: loan2_oid,
        id_user: "wHHR1SUBT0dspoF4YUO92",
        score: "AAA",
        ROI: 10,
        goal: 50000,
        term: 2,
        raised: 0,
        expiry: now,
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
            id_lender: "wHHR1SUBT0dspoF4YUO91",
            id_borrower: "wHHR1SUBT0dspoF4YUO92",
            quantity: 50000,
            id_loan: loan1_oid.toHexString(),
            goal: 50000,
            raised: 0,
            term: 2,
            ROI: 10,
            TEM: 0.007974140428903764,
          })
        ),
      } as ConsumeMessage,
      dbInstance,
      ch
    );
    const borrower = await users.findOne({
      id: "wHHR1SUBT0dspoF4YUO92",
    });
    expect(borrower).toEqual({
      _id: borrower_oid,
      id: "wHHR1SUBT0dspoF4YUO92",
      accountAvailable: 150000,
      accountToBePaid: 0,
      accountTotal: 150000,
    });
    const lender = await users.findOne({
      id: "wHHR1SUBT0dspoF4YUO91",
    });
    expect(lender).toEqual({
      _id: lender_oid,
      id: "wHHR1SUBT0dspoF4YUO91",
      accountAvailable: 50000,
      accountToBePaid: 50598,
      accountTotal: 100598,
    });
    const allTransactionsBorrower = await transactions
      .find({ id_user: "wHHR1SUBT0dspoF4YUO92" })
      .toArray();
    const allTransactionsLender = await transactions
      .find({ id_user: "wHHR1SUBT0dspoF4YUO91" })
      .toArray();
    expect(allTransactionsLender.length).toBe(1);
    expect(
      allTransactionsLender.map((transaction) => {
        return transaction.type === "invest"
          ? {
              type: transaction.type,
              quantity: transaction.quantity,
              id_borrower: transaction.id_borrower,
              _id_loan: transaction._id_loan?.toHexString(),
            }
          : {};
      })
    ).toEqual([
      {
        type: "invest",
        quantity: -50000,
        id_borrower: "wHHR1SUBT0dspoF4YUO92",
        _id_loan: loan1_oid.toHexString(),
      },
    ]);
    expect(allTransactionsBorrower.length).toBe(1);
    expect(
      allTransactionsBorrower.map((transaction) => {
        return transaction.type === "credit"
          ? {
              type: transaction.type,
              quantity: transaction.quantity,
            }
          : {};
      })
    ).toEqual([
      {
        type: "credit",
        quantity: 50000,
      },
    ]);
    const allLoans = await loans
      .find({ id_user: "wHHR1SUBT0dspoF4YUO92" })
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
        raised: 0,
        status: "financing",
        pending: 50000,
      },
    ]);
    const investments = dbInstance.collection<InvestmentMongo>("investments");
    const allInvestments = await investments
      .find({ id_lender: "wHHR1SUBT0dspoF4YUO91" })
      .toArray();
    expect(allInvestments.length).toBe(1);
    expect(
      allInvestments.map((investment) => ({
        ...investment,
        _id: "",
        updated: "",
        created: "",
      }))
    ).toEqual([
      {
        quantity: 50000,
        ROI: 10,
        payments: 0,
        moratory: 0,
        term: 2,
        interest_to_earn: 598,
        to_be_paid: 50598,
        paid_already: 0,
        amortize: 25299,
        id_borrower: "wHHR1SUBT0dspoF4YUO92",
        id_lender: "wHHR1SUBT0dspoF4YUO91",
        _id_loan: loan1_oid,
        status: "up to date",
        _id: "",
        updated: "",
        created: "",
      },
    ]);
  });
});
