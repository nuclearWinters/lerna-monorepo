import { addMonths, startOfDay } from "date-fns";
import { Db, MongoClient, ObjectId } from "mongodb";
import {
  TransactionMongo,
  InvestmentMongo,
  LoanMongo,
  UserMongo,
  ScheduledPaymentsMongo,
} from "./types";
jest.mock("kafkajs", () => {
  return {
    Kafka: function () {
      return {
        producer: () => ({
          send: jest.fn(),
          connect: () => Promise.resolve(jest.fn()),
        }),
      };
    },
  };
});
import { Kafka, Producer } from "kafkajs";
import { monthFunction } from "./cronJobMonth";
import { UserTransaction } from "./kafkaUserTransaction";

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
  let producer: Producer;

  beforeAll(async () => {
    client = await MongoClient.connect(
      (global as unknown as { __MONGO_URI__: string }).__MONGO_URI__,
      {}
    );
    dbInstance = client.db(
      (global as unknown as { __MONGO_DB_NAME__: string }).__MONGO_DB_NAME__
    );
    const kafka = new Kafka({
      clientId: "my-app",
      brokers: ["kafka:9092"],
    });
    producer = kafka.producer();
    await producer.connect();
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
    const scheduledPayments =
      dbInstance.collection<ScheduledPaymentsMongo>("scheduledPayments");
    const now = new Date();
    const user1_oid = new ObjectId();
    const user2_oid = new ObjectId();
    const user3_oid = new ObjectId();
    await users.insertMany([
      {
        _id: user1_oid,
        id: "wHHR1SUBT0dspoF4YUOw7",
        account_available: 1000000,
        account_to_be_paid: 0,
        account_total: 1000000,
        account_withheld: 0,
      },
      {
        _id: user2_oid,
        id: "wHHR1SUBT0dspoF4YUOw8",
        account_available: 100000,
        account_to_be_paid: 203956,
        account_total: 303956,
        account_withheld: 0,
      },
      {
        _id: user3_oid,
        id: "wHHR1SUBT0dspoF4YUOw9",
        account_available: 0,
        account_to_be_paid: 0,
        account_total: 0,
        account_withheld: 0,
      },
    ]);
    const loan1_oid = new ObjectId();
    const loan2_oid = new ObjectId();
    const loan3_oid = new ObjectId();
    const loan4_oid = new ObjectId();
    const scheduled1_oid = new ObjectId();
    const scheduled2_oid = new ObjectId();
    const scheduled3_oid = new ObjectId();
    const scheduled4_oid = new ObjectId();
    const scheduled5_oid = new ObjectId();
    const scheduled6_oid = new ObjectId();
    await scheduledPayments.insertMany([
      {
        _id: scheduled1_oid,
        amortize: 50989,
        scheduled_date: addMonths(startOfDay(now), -1),
        status: "paid",
        loan_oid: loan1_oid,
      },
      {
        _id: scheduled2_oid,
        amortize: 50989,
        scheduled_date: startOfDay(now),
        status: "to be paid",
        loan_oid: loan1_oid,
      },
      {
        _id: scheduled3_oid,
        amortize: 50989,
        scheduled_date: startOfDay(now),
        status: "to be paid",
        loan_oid: loan2_oid,
      },
      {
        _id: scheduled4_oid,
        amortize: 50989,
        scheduled_date: addMonths(startOfDay(now), -1),
        status: "to be paid",
        loan_oid: loan2_oid,
      },
      {
        _id: scheduled5_oid,
        amortize: 50989,
        scheduled_date: addMonths(startOfDay(now), -1),
        status: "paid",
        loan_oid: loan4_oid,
      },
      {
        _id: scheduled6_oid,
        amortize: 50989,
        scheduled_date: startOfDay(now),
        status: "to be paid",
        loan_oid: loan4_oid,
      },
    ]);
    await loans.insertMany([
      {
        _id: loan1_oid,
        user_id: "wHHR1SUBT0dspoF4YUOw7",
        score: "AAA",
        roi: 17,
        goal: 100000,
        expiry: now,
        term: 2,
        raised: 100000,
        status: "to be paid",
        pending: 0,
        payments_delayed: 0,
        payments_done: 1,
      },
      {
        _id: loan2_oid,
        user_id: "wHHR1SUBT0dspoF4YUOw7",
        score: "AAA",
        roi: 17,
        goal: 100000,
        expiry: now,
        term: 2,
        raised: 100000,
        status: "to be paid",
        pending: 0,
        payments_delayed: 0,
        payments_done: 0,
      },
      {
        _id: loan3_oid,
        user_id: "wHHR1SUBT0dspoF4YUO10",
        score: "AAA",
        roi: 17,
        goal: 100000,
        expiry: now,
        term: 2,
        raised: 0,
        status: "financing",
        pending: 0,
        payments_delayed: 0,
        payments_done: 1,
      },
      {
        _id: loan4_oid,
        user_id: "wHHR1SUBT0dspoF4YUOw9",
        score: "AAA",
        roi: 17,
        goal: 100000,
        expiry: now,
        term: 2,
        raised: 100000,
        status: "to be paid",
        pending: 0,
        payments_delayed: 0,
        payments_done: 0,
      },
    ]);
    const invest1_oid = new ObjectId();
    const invest2_oid = new ObjectId();
    const invest3_oid = new ObjectId();
    await investments.insertMany([
      {
        _id: invest1_oid,
        borrower_id: "wHHR1SUBT0dspoF4YUOw7",
        lender_id: "wHHR1SUBT0dspoF4YUOw8",
        loan_oid: loan1_oid,
        quantity: 100000,
        status: "up to date",
        created_at: now,
        updated_at: now,
        payments: 1,
        term: 2,
        roi: 17,
        moratory: 0,
        interest_to_earn: 1978,
        to_be_paid: 50989,
        paid_already: 50989,
        amortize: 50989,
        status_type: "on_going",
      },
      {
        _id: invest2_oid,
        borrower_id: "wHHR1SUBT0dspoF4YUOw7",
        lender_id: "wHHR1SUBT0dspoF4YUOw8",
        loan_oid: loan2_oid,
        quantity: 100000,
        status: "up to date",
        created_at: now,
        updated_at: now,
        payments: 0,
        term: 2,
        roi: 17,
        moratory: 0,
        interest_to_earn: 1978,
        to_be_paid: 101978,
        paid_already: 0,
        amortize: 50989,
        status_type: "on_going",
      },
      {
        _id: invest3_oid,
        borrower_id: "wHHR1SUBT0dspoF4YUOw9",
        lender_id: "wHHR1SUBT0dspoF4YUOw8",
        loan_oid: loan4_oid,
        quantity: 100000,
        status: "up to date",
        created_at: now,
        updated_at: now,
        payments: 1,
        term: 2,
        roi: 17,
        moratory: 0,
        interest_to_earn: 1978,
        to_be_paid: 50989,
        paid_already: 50989,
        amortize: 50989,
        status_type: "on_going",
      },
    ]);
    await monthFunction(dbInstance, producer);
    await UserTransaction(
      JSON.stringify({
        quantity: -50989,
        user_id: "wHHR1SUBT0dspoF4YUOw7",
        loan_id: loan1_oid.toHexString(),
        scheduled_id: scheduled2_oid,
      }),
      users,
      producer,
      loans,
      transactions,
      scheduledPayments,
      investments
    );
    await UserTransaction(
      JSON.stringify({
        quantity: -50989,
        user_id: "wHHR1SUBT0dspoF4YUOw7",
        loan_id: loan2_oid.toHexString(),
        scheduled_id: scheduled3_oid,
      }),
      users,
      producer,
      loans,
      transactions,
      scheduledPayments,
      investments
    );
    await UserTransaction(
      JSON.stringify({
        quantity: -50989,
        user_id: "wHHR1SUBT0dspoF4YUOw9",
        loan_id: loan4_oid.toHexString(),
        scheduled_id: scheduled6_oid,
      }),
      users,
      producer,
      loans,
      transactions,
      scheduledPayments,
      investments
    );
    await UserTransaction(
      JSON.stringify({
        interest: 50989,
        user_id: "wHHR1SUBT0dspoF4YUOw8",
        loan_id: loan1_oid,
        borrower_id: "wHHR1SUBT0dspoF4YUOw7",
      }),
      users,
      producer,
      loans,
      transactions,
      scheduledPayments,
      investments
    );
    await UserTransaction(
      JSON.stringify({
        interest: 50989,
        user_id: "wHHR1SUBT0dspoF4YUOw8",
        loan_id: loan2_oid,
        borrower_id: "wHHR1SUBT0dspoF4YUOw7",
      }),
      users,
      producer,
      loans,
      transactions,
      scheduledPayments,
      investments
    );
    await UserTransaction(
      JSON.stringify({
        interest: -24,
        user_id: "wHHR1SUBT0dspoF4YUOw8",
        loan_id: loan4_oid,
        borrower_id: "wHHR1SUBT0dspoF4YUOw9",
      }),
      users,
      producer,
      loans,
      transactions,
      scheduledPayments,
      investments
    );
    const user = await users.findOne({
      id: "wHHR1SUBT0dspoF4YUOw7",
    });
    expect(user).toEqual({
      _id: user1_oid,
      id: "wHHR1SUBT0dspoF4YUOw7",
      account_available: 898022,
      account_to_be_paid: 0,
      account_total: 898022,
      account_withheld: 0,
    });
    const user2 = await users.findOne({
      id: "wHHR1SUBT0dspoF4YUOw8",
    });
    expect(user2).toEqual({
      _id: user2_oid,
      id: "wHHR1SUBT0dspoF4YUOw8",
      account_available: 201954,
      account_to_be_paid: 102002,
      account_total: 303956,
      account_withheld: 0,
    });
    const borrower_transactions = await transactions
      .find({
        user_id: "wHHR1SUBT0dspoF4YUOw7",
      })
      .toArray();
    expect(borrower_transactions.length).toEqual(2);
    expect(
      borrower_transactions.map((transaction) => ({
        ...transaction,
        _id: "",
        created_at: "",
      }))
    ).toEqual([
      {
        _id: "",
        created_at: "",
        quantity: -50989,
        type: "payment",
        user_id: "wHHR1SUBT0dspoF4YUOw7",
      },
      {
        _id: "",
        created_at: "",
        quantity: -50989,
        type: "payment",
        user_id: "wHHR1SUBT0dspoF4YUOw7",
      },
    ]);
    const lender_transactions = await transactions
      .find({
        user_id: "wHHR1SUBT0dspoF4YUOw8",
      })
      .toArray();
    expect(lender_transactions.length).toEqual(2);
    expect(
      lender_transactions.map((transaction) => ({
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
        borrower_id: "wHHR1SUBT0dspoF4YUOw7",
        loan_oid: loan1_oid,
        user_id: "wHHR1SUBT0dspoF4YUOw8",
      },
      {
        _id: "",
        borrower_id: "wHHR1SUBT0dspoF4YUOw7",
        loan_oid: loan2_oid,
        created_at: "",
        quantity: 50989,
        type: "collect",
        user_id: "wHHR1SUBT0dspoF4YUOw8",
      },
    ]);
    const allLoans = await loans
      .find({
        user_id: {
          $in: ["wHHR1SUBT0dspoF4YUOw7", "wHHR1SUBT0dspoF4YUOw9"],
        },
      })
      .toArray();
    expect(allLoans.length).toEqual(3);
    expect(
      allLoans.map((loan) => ({
        status: loan.status,
      }))
    ).toEqual([
      {
        status: "paid",
        //scheduledPayments: [
        //  {
        //    amortize: 50989,
        //    status: "paid",
        //    scheduledDate: addMonths(startOfDay(now), -1),
        //  },
        //  {
        //    amortize: 50989,
        //    status: "paid",
        //    scheduledDate: startOfDay(now),
        //  },
        //],
      },
      {
        status: "to be paid",
        //scheduledPayments: [
        //  {
        //    amortize: 50989,
        //    status: "paid",
        //    scheduledDate: startOfDay(now),
        //  },
        //  {
        //    amortize: 50989,
        //    status: "to be paid",
        //    scheduledDate: addMonths(startOfDay(now), -1),
        //  },
        //],
      },
      {
        //scheduledPayments: [
        //  {
        //    amortize: 50989,
        //    scheduledDate: addMonths(startOfDay(now), -1),
        //    status: "paid",
        //  },
        //  {
        //    amortize: 50989,
        //    scheduledDate: startOfDay(now),
        //    status: "delayed",
        //  },
        //],
        status: "to be paid",
      },
    ]);
    const allInvestments = await investments
      .find({
        lender_id: "wHHR1SUBT0dspoF4YUOw8",
      })
      .toArray();
    expect(allInvestments.length).toBe(3);
    expect(allInvestments).toEqual([
      {
        roi: 17,
        _id: invest1_oid,
        borrower_id: "wHHR1SUBT0dspoF4YUOw7",
        lender_id: "wHHR1SUBT0dspoF4YUOw8",
        loan_oid: loan1_oid,
        moratory: 0,
        payments: 2,
        quantity: 100000,
        status: "paid",
        term: 2,
        updated_at: now,
        created_at: now,
        interest_to_earn: 1978,
        to_be_paid: 0,
        paid_already: 101978,
        amortize: 50989,
        status_type: "over",
      },
      {
        roi: 17,
        _id: invest2_oid,
        borrower_id: "wHHR1SUBT0dspoF4YUOw7",
        lender_id: "wHHR1SUBT0dspoF4YUOw8",
        loan_oid: loan2_oid,
        moratory: 0,
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
        status_type: "on_going",
      },
      {
        roi: 17,
        _id: invest3_oid,
        borrower_id: "wHHR1SUBT0dspoF4YUOw9",
        lender_id: "wHHR1SUBT0dspoF4YUOw8",
        loan_oid: loan4_oid,
        created_at: now,
        moratory: 24,
        payments: 1,
        quantity: 100000,
        status: "delay payment",
        term: 2,
        updated_at: now,
        interest_to_earn: 1978,
        to_be_paid: 50989,
        paid_already: 50989,
        amortize: 50989,
        status_type: "on_going",
      },
    ]);
  });
});
