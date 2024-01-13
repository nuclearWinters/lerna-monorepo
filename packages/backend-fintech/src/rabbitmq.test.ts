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
    dbInstance = client.db(
      (global as unknown as { __MONGO_DB_NAME__: string }).__MONGO_DB_NAME__
    );
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
        account_available: 100000,
        account_to_be_paid: 0,
        account_total: 100000,
        account_withheld: 0,
      },
      {
        _id: borrower_oid,
        id: "wHHR1SUBT0dspoF4YUO32",
        account_available: 100000,
        account_to_be_paid: 0,
        account_total: 100000,
        account_withheld: 0,
      },
    ]);
    const loans = dbInstance.collection<LoanMongo>("loans");
    const loan1_oid = new ObjectId();
    const loan2_oid = new ObjectId();
    await loans.insertMany([
      {
        _id: loan1_oid,
        user_id: "wHHR1SUBT0dspoF4YUO32",
        score: "AAA",
        roi: 10,
        goal: 50000,
        term: 2,
        raised: 0,
        expiry: now,
        status: "financing",
        pending: 50000,
        payments_done: 0,
        payments_delayed: 0,
      },
      {
        _id: loan2_oid,
        user_id: "wHHR1SUBT0dspoF4YUO32",
        score: "AAA",
        roi: 10,
        goal: 50000,
        term: 2,
        raised: 0,
        expiry: now,
        status: "financing",
        pending: 50000,
        payments_done: 0,
        payments_delayed: 0,
      },
    ]);
    const transactions =
      dbInstance.collection<TransactionMongo>("transactions");
    await sendLend(
      {
        content: Buffer.from(
          JSON.stringify({
            lender_id: "wHHR1SUBT0dspoF4YUO31",
            borrower_id: "wHHR1SUBT0dspoF4YUO32",
            quantity: 10000,
            loan_id: loan1_oid.toHexString(),
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
            lender_id: "wHHR1SUBT0dspoF4YUO31",
            borrower_id: "wHHR1SUBT0dspoF4YUO32",
            quantity: 5000,
            loan_id: loan2_oid.toHexString(),
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
      account_available: 85000,
      account_to_be_paid: 0,
      account_total: 85000,
      account_withheld: 0,
    });
    const allTransactions = await transactions
      .find({ user_id: "wHHR1SUBT0dspoF4YUO31" })
      .toArray();
    expect(allTransactions.length).toBe(2);
    expect(
      allTransactions.map((transaction) => {
        return transaction.type === "invest"
          ? {
              type: transaction.type,
              quantity: transaction.quantity,
              borrower_id: transaction.borrower_id,
              loan_oid: transaction.loan_oid?.toHexString(),
            }
          : {};
      })
    ).toEqual([
      {
        type: "invest",
        quantity: -10000,
        borrower_id: "wHHR1SUBT0dspoF4YUO32",
        loan_oid: loan1_oid.toHexString(),
      },
      {
        type: "invest",
        quantity: -5000,
        borrower_id: "wHHR1SUBT0dspoF4YUO32",
        loan_oid: loan2_oid.toHexString(),
      },
    ]);
    const allLoans = await loans
      .find({ user_id: "wHHR1SUBT0dspoF4YUO32" })
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
      .find({ lender_id: "wHHR1SUBT0dspoF4YUO31" })
      .toArray();
    expect(allInvestments.length).toBe(2);
    expect(
      allInvestments.map((investment) => ({
        ...investment,
        _id: "",
        updated_at: "",
        created_at: "",
      }))
    ).toEqual([
      {
        quantity: 10000,
        roi: 10,
        payments: 0,
        moratory: 0,
        term: 2,
        interest_to_earn: 0,
        to_be_paid: 0,
        paid_already: 0,
        amortize: 0,
        borrower_id: "wHHR1SUBT0dspoF4YUO32",
        lender_id: "wHHR1SUBT0dspoF4YUO31",
        loan_oid: loan1_oid,
        status: "financing",
        _id: "",
        updated_at: "",
        created_at: "",
      },
      {
        quantity: 5000,
        roi: 10,
        moratory: 0,
        term: 2,
        payments: 0,
        interest_to_earn: 0,
        to_be_paid: 0,
        paid_already: 0,
        amortize: 0,
        loan_oid: loan2_oid,
        borrower_id: "wHHR1SUBT0dspoF4YUO32",
        lender_id: "wHHR1SUBT0dspoF4YUO31",
        status: "financing",
        _id: "",
        updated_at: "",
        created_at: "",
      },
    ]);
    await sendLend(
      {
        content: Buffer.from(
          JSON.stringify({
            lender_id: "wHHR1SUBT0dspoF4YUO31",
            borrower_id: "wHHR1SUBT0dspoF4YUO32",
            quantity: 40000,
            loan_id: loan1_oid.toHexString(),
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
            lender_id: "wHHR1SUBT0dspoF4YUO31",
            borrower_id: "wHHR1SUBT0dspoF4YUO32",
            quantity: 45000,
            loan_id: loan2_oid.toHexString(),
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
      account_available: 0,
      account_to_be_paid: 101196,
      account_total: 101196,
      account_withheld: 0,
    });
    const user3 = await users.findOne({
      id: "wHHR1SUBT0dspoF4YUO32",
    });
    expect(user3).toEqual({
      _id: borrower_oid,
      id: "wHHR1SUBT0dspoF4YUO32",
      account_available: 200000,
      account_to_be_paid: 0,
      account_total: 200000,
      account_withheld: 0,
    });
    const allTransactions2 = await transactions
      .find({ user_id: "wHHR1SUBT0dspoF4YUO31" })
      .toArray();
    expect(allTransactions2.length).toBe(4);
    expect(
      allTransactions2.map((transaction) => {
        return transaction.type === "invest"
          ? {
              type: transaction.type,
              quantity: transaction.quantity,
              borrower_id: transaction.borrower_id,
              loan_oid: transaction.loan_oid?.toHexString(),
            }
          : {};
      })
    ).toEqual([
      {
        type: "invest",
        quantity: -10000,
        borrower_id: "wHHR1SUBT0dspoF4YUO32",
        loan_oid: loan1_oid.toHexString(),
      },
      {
        type: "invest",
        quantity: -5000,
        borrower_id: "wHHR1SUBT0dspoF4YUO32",
        loan_oid: loan2_oid.toHexString(),
      },
      {
        type: "invest",
        quantity: -40000,
        borrower_id: "wHHR1SUBT0dspoF4YUO32",
        loan_oid: loan1_oid.toHexString(),
      },
      {
        type: "invest",
        quantity: -45000,
        borrower_id: "wHHR1SUBT0dspoF4YUO32",
        loan_oid: loan2_oid.toHexString(),
      },
    ]);
    const allLoans2 = await loans
      .find({ user_id: "wHHR1SUBT0dspoF4YUO32" })
      .toArray();
    expect(allLoans2.length).toBe(2);
    expect(
      allLoans2.map((loan) => ({
        raised: loan.raised,
        status: loan.status,
        pending: loan.pending,
      }))
    ).toEqual([
      {
        raised: 50000,
        status: "to be paid",
        /*scheduledPayments: [
          {
            amortize: 25299,
            status: "to be paid",
          },
          {
            amortize: 25299,
            status: "to be paid",
          },
        ],*/
        pending: 0,
      },
      {
        raised: 50000,
        status: "to be paid",
        /*scheduledPayments: [
          {
            amortize: 25299,
            status: "to be paid",
          },
          {
            amortize: 25299,
            status: "to be paid",
          },
        ],*/
        pending: 0,
      },
    ]);
    const investments2 = dbInstance.collection<InvestmentMongo>("investments");
    const allInvestments2 = await investments2
      .find({ lender_id: "wHHR1SUBT0dspoF4YUO31" })
      .toArray();
    expect(allInvestments2.length).toBe(2);
    expect(
      allInvestments2.map((investment) => ({
        ...investment,
        _id: "",
        updated_at: "",
        created_at: "",
      }))
    ).toEqual([
      {
        borrower_id: "wHHR1SUBT0dspoF4YUO32",
        lender_id: "wHHR1SUBT0dspoF4YUO31",
        loan_oid: loan1_oid,
        quantity: 50000,
        roi: 10,
        moratory: 0,
        term: 2,
        payments: 0,
        interest_to_earn: 598,
        to_be_paid: 50598,
        amortize: 25299,
        paid_already: 0,
        status: "up to date",
        _id: "",
        updated_at: "",
        created_at: "",
      },
      {
        quantity: 50000,
        roi: 10,
        moratory: 0,
        term: 2,
        payments: 0,
        interest_to_earn: 598,
        to_be_paid: 50598,
        amortize: 25299,
        paid_already: 0,
        loan_oid: loan2_oid,
        status: "up to date",
        borrower_id: "wHHR1SUBT0dspoF4YUO32",
        lender_id: "wHHR1SUBT0dspoF4YUO31",
        _id: "",
        updated_at: "",
        created_at: "",
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
        account_available: 10000,
        account_to_be_paid: 0,
        account_total: 10000,
        account_withheld: 0,
      },
      {
        _id: new ObjectId("400000000000000000000005"),
        id: "wHHR1SUBT0dspoF4YUO34",
        account_available: 10000,
        account_to_be_paid: 0,
        account_total: 10000,
        account_withheld: 0,
      },
    ]);
    const loans = dbInstance.collection<LoanMongo>("loans");
    await loans.insertMany([
      {
        _id: new ObjectId("400000000000000000000002"),
        user_id: "wHHR1SUBT0dspoF4YUO34",
        score: "AAA",
        roi: 10,
        goal: 50000,
        term: 2,
        raised: 0,
        expiry: now,
        status: "financing",
        pending: 50000,
        payments_done: 0,
        payments_delayed: 0,
      },
    ]);
    const transactions =
      dbInstance.collection<TransactionMongo>("transactions");
    await sendLend(
      {
        content: Buffer.from(
          JSON.stringify({
            lender_id: "wHHR1SUBT0dspoF4YUO33",
            borrower_id: "wHHR1SUBT0dspoF4YUO34",
            quantity: 15000,
            loan_id: "400000000000000000000002",
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
    if (!user) {
      throw new Error("User not found.");
    }
    expect(user).toEqual({
      _id: new ObjectId("400000000000000000000004"),
      id: "wHHR1SUBT0dspoF4YUO33",
      account_available: 10000,
      account_to_be_paid: 0,
      account_total: 10000,
      account_withheld: 0,
    });
    const allTransactions = await transactions
      .find({ user_id: "wHHR1SUBT0dspoF4YUO33" })
      .toArray();
    expect(allTransactions.length).toBe(0);
    const allLoans = await loans
      .find({ user_id: "wHHR1SUBT0dspoF4YUO34" })
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
      .find({ lender_id: "wHHR1SUBT0dspoF4YUO33" })
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
        account_available: 10000,
        account_to_be_paid: 0,
        account_total: 10000,
        account_withheld: 0,
      },
      {
        _id: new ObjectId("500000000000000000000005"),
        id: "wHHR1SUBT0dspoF4YUO36",
        account_available: 10000,
        account_to_be_paid: 0,
        account_total: 10000,
        account_withheld: 0,
      },
    ]);
    const loans = dbInstance.collection<LoanMongo>("loans");
    await loans.insertMany([
      {
        _id: new ObjectId("500000000000000000000002"),
        user_id: "wHHR1SUBT0dspoF4YUO36",
        score: "AAA",
        roi: 10,
        goal: 50000,
        term: 2,
        raised: 50000,
        expiry: now,
        status: "to be paid",
        pending: 0,
        payments_done: 0,
        payments_delayed: 0,
      },
    ]);
    const transactions =
      dbInstance.collection<TransactionMongo>("transactions");
    await sendLend(
      {
        content: Buffer.from(
          JSON.stringify({
            lender_id: "wHHR1SUBT0dspoF4YUO35",
            borrower_id: "wHHR1SUBT0dspoF4YUO36",
            quantity: 5000,
            loan_id: "500000000000000000000002",
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
      account_available: 10000,
      account_to_be_paid: 0,
      account_total: 10000,
      account_withheld: 0,
    });
    const allTransactions = await transactions
      .find({ user_id: "wHHR1SUBT0dspoF4YUO35" })
      .toArray();
    expect(allTransactions.length).toBe(0);
    const allLoans = await loans
      .find({ user_id: "wHHR1SUBT0dspoF4YUO36" })
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
      .find({ lender_id: "wHHR1SUBT0dspoF4YUO35" })
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
        account_available: 10000,
        account_to_be_paid: 0,
        account_total: 10000,
        account_withheld: 0,
      },
      {
        _id: new ObjectId("600000000000000000000005"),
        id: "wHHR1SUBT0dspoF4YUO38",
        account_available: 10000,
        account_to_be_paid: 0,
        account_total: 10000,
        account_withheld: 0,
      },
    ]);
    const loans = dbInstance.collection<LoanMongo>("loans");
    await loans.insertMany([
      {
        _id: new ObjectId("600000000000000000000002"),
        user_id: "wHHR1SUBT0dspoF4YUO38",
        score: "AAA",
        roi: 10,
        goal: 50000,
        term: 2,
        raised: 50000,
        expiry: now,
        status: "to be paid",
        pending: 0,
        payments_done: 0,
        payments_delayed: 0,
      },
      {
        _id: new ObjectId("600000000000000000000003"),
        user_id: "wHHR1SUBT0dspoF4YUO38",
        score: "AAA",
        roi: 10,
        goal: 50000,
        term: 2,
        raised: 0,
        expiry: now,
        status: "financing",
        pending: 50000,
        payments_done: 0,
        payments_delayed: 0,
      },
    ]);
    const transactions =
      dbInstance.collection<TransactionMongo>("transactions");
    await sendLend(
      {
        content: Buffer.from(
          JSON.stringify({
            lender_id: "wHHR1SUBT0dspoF4YUO37",
            borrower_id: "wHHR1SUBT0dspoF4YUO38",
            quantity: 5000,
            loan_id: "600000000000000000000002",
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
            lender_id: "wHHR1SUBT0dspoF4YUO37",
            borrower_id: "wHHR1SUBT0dspoF4YUO38",
            quantity: 5000,
            loan_id: "600000000000000000000003",
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
      account_available: 5000,
      account_to_be_paid: 0,
      account_total: 5000,
      account_withheld: 0,
    });
    const allTransactions = await transactions
      .find({ user_id: "wHHR1SUBT0dspoF4YUO37" })
      .toArray();
    expect(allTransactions.length).toBe(1);
    expect(
      allTransactions.map((transaction) => {
        return transaction.type === "invest"
          ? {
              type: transaction.type,
              quantity: transaction.quantity,
              borrower_id: transaction.borrower_id,
              loan_oid: transaction.loan_oid?.toHexString(),
            }
          : {};
      })
    ).toEqual([
      {
        type: "invest",
        quantity: -5000,
        borrower_id: "wHHR1SUBT0dspoF4YUO38",
        loan_oid: "600000000000000000000003",
      },
    ]);
    const allLoans = await loans
      .find({ user_id: "wHHR1SUBT0dspoF4YUO38" })
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
      .find({ lender_id: "wHHR1SUBT0dspoF4YUO37" })
      .toArray();
    expect(allInvestments.length).toBe(1);
    expect(
      allInvestments.map((investment) => ({
        ...investment,
        _id: "",
        created_at: "",
        updated_at: "",
      }))
    ).toEqual([
      {
        loan_oid: new ObjectId("600000000000000000000003"),
        quantity: 5000,
        roi: 10,
        payments: 0,
        moratory: 0,
        term: 2,
        interest_to_earn: 0,
        to_be_paid: 0,
        paid_already: 0,
        amortize: 0,
        borrower_id: "wHHR1SUBT0dspoF4YUO38",
        lender_id: "wHHR1SUBT0dspoF4YUO37",
        status: "financing",
        created_at: "",
        updated_at: "",
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
        account_available: 100000,
        account_to_be_paid: 0,
        account_total: 100000,
        account_withheld: 0,
      },
      {
        _id: borrower_oid,
        id: "wHHR1SUBT0dspoF4YUO92",
        account_available: 100000,
        account_to_be_paid: 0,
        account_total: 100000,
        account_withheld: 0,
      },
    ]);
    const loans = dbInstance.collection<LoanMongo>("loans");
    const loan1_oid = new ObjectId();
    const loan2_oid = new ObjectId();
    await loans.insertMany([
      {
        _id: loan1_oid,
        user_id: "wHHR1SUBT0dspoF4YUO92",
        score: "AAA",
        roi: 10,
        goal: 50000,
        term: 2,
        raised: 0,
        expiry: now,
        status: "financing",
        pending: 50000,
        payments_done: 0,
        payments_delayed: 0,
      },
      {
        _id: loan2_oid,
        user_id: "wHHR1SUBT0dspoF4YUO92",
        score: "AAA",
        roi: 10,
        goal: 50000,
        term: 2,
        raised: 0,
        expiry: now,
        status: "financing",
        pending: 50000,
        payments_done: 0,
        payments_delayed: 0,
      },
    ]);
    const transactions =
      dbInstance.collection<TransactionMongo>("transactions");
    await sendLend(
      {
        content: Buffer.from(
          JSON.stringify({
            lender_id: "wHHR1SUBT0dspoF4YUO91",
            borrower_id: "wHHR1SUBT0dspoF4YUO92",
            quantity: 50000,
            loan_id: loan1_oid.toHexString(),
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
      account_available: 150000,
      account_to_be_paid: 0,
      account_total: 150000,
      account_withheld: 0,
    });
    const lender = await users.findOne({
      id: "wHHR1SUBT0dspoF4YUO91",
    });
    expect(lender).toEqual({
      _id: lender_oid,
      id: "wHHR1SUBT0dspoF4YUO91",
      account_available: 50000,
      account_to_be_paid: 50598,
      account_total: 100598,
      account_withheld: 0,
    });
    const allTransactionsBorrower = await transactions
      .find({ user_id: "wHHR1SUBT0dspoF4YUO92" })
      .toArray();
    const allTransactionsLender = await transactions
      .find({ user_id: "wHHR1SUBT0dspoF4YUO91" })
      .toArray();
    expect(allTransactionsLender.length).toBe(1);
    expect(
      allTransactionsLender.map((transaction) => {
        return transaction.type === "invest"
          ? {
              type: transaction.type,
              quantity: transaction.quantity,
              borrower_id: transaction.borrower_id,
              loan_oid: transaction.loan_oid?.toHexString(),
            }
          : {};
      })
    ).toEqual([
      {
        type: "invest",
        quantity: -50000,
        borrower_id: "wHHR1SUBT0dspoF4YUO92",
        loan_oid: loan1_oid.toHexString(),
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
      .find({ user_id: "wHHR1SUBT0dspoF4YUO92" })
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
      .find({ lender_id: "wHHR1SUBT0dspoF4YUO91" })
      .toArray();
    expect(allInvestments.length).toBe(1);
    expect(
      allInvestments.map((investment) => ({
        ...investment,
        _id: "",
        updated_at: "",
        created_at: "",
      }))
    ).toEqual([
      {
        quantity: 50000,
        roi: 10,
        payments: 0,
        moratory: 0,
        term: 2,
        interest_to_earn: 598,
        to_be_paid: 50598,
        paid_already: 0,
        amortize: 25299,
        borrower_id: "wHHR1SUBT0dspoF4YUO92",
        lender_id: "wHHR1SUBT0dspoF4YUO91",
        loan_oid: loan1_oid,
        status: "up to date",
        _id: "",
        updated_at: "",
        created_at: "",
      },
    ]);
  });
});
