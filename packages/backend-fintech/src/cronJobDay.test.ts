import { addDays, addMonths, startOfDay } from "date-fns";
import { Db, MongoClient, ObjectId } from "mongodb";
import {
  TransactionMongo,
  InvestmentMongo,
  LoanMongo,
  UserMongo,
  ScheduledPaymentsMongo,
} from "./types";
import { UserTransaction } from "./kafkaUserTransaction";
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
import { dayFunction } from "./cronJobDay";

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

  it("dayFunction test", async () => {
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
    const user1_id = "wHHR1SUBT0dspoF4YUO11";
    const user2_id = "wHHR1SUBT0dspoF4YUO12";
    const user3_id = "wHHR1SUBT0dspoF4YUO13";
    await users.insertMany([
      {
        _id: user1_oid,
        id: user1_id,
        account_available: 1000000,
        account_to_be_paid: 0,
        account_total: 1000000,
        account_withheld: 0,
      },
      {
        _id: user2_oid,
        id: user2_id,
        account_available: 100000,
        account_to_be_paid: 206125,
        account_total: 306125,
        account_withheld: 0,
      },
      {
        _id: user3_oid,
        id: user3_id,
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
        scheduled_date: addDays(startOfDay(now), -30),
        status: "delayed",
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
        scheduled_date: startOfDay(addMonths(now, -2)),
        status: "paid",
        loan_oid: loan2_oid,
      },
      {
        _id: scheduled4_oid,
        amortize: 50989,
        scheduled_date: addDays(startOfDay(now), -30),
        status: "delayed",
        loan_oid: loan2_oid,
      },
      {
        _id: scheduled5_oid,
        amortize: 50989,
        scheduled_date: startOfDay(addMonths(now, -2)),
        status: "paid",
        loan_oid: loan3_oid,
      },
      {
        _id: scheduled6_oid,
        amortize: 50989,
        scheduled_date: addDays(startOfDay(now), -30),
        status: "delayed",
        loan_oid: loan3_oid,
      },
    ]);
    await loans.insertMany([
      {
        _id: loan1_oid,
        user_id: user1_id,
        score: "AAA",
        roi: 17,
        goal: 100000,
        expiry: now,
        term: 2,
        raised: 100000,
        status: "to be paid",
        pending: 0,
        payments_done: 0,
        payments_delayed: 1,
      },
      {
        _id: loan2_oid,
        user_id: user1_id,
        score: "AAA",
        roi: 17,
        goal: 100000,
        expiry: now,
        term: 2,
        raised: 100000,
        status: "to be paid",
        pending: 0,
        payments_done: 1,
        payments_delayed: 1,
      },
      {
        _id: loan3_oid,
        user_id: user3_id,
        score: "AAA",
        roi: 17,
        goal: 100000,
        expiry: now,
        term: 2,
        raised: 100000,
        status: "to be paid",
        pending: 0,
        payments_done: 1,
        payments_delayed: 1,
      },
      {
        _id: loan4_oid,
        user_id: "wHHR1SUBT0dspoF4YUO14",
        score: "AAA",
        roi: 17,
        goal: 100000,
        expiry: now,
        term: 2,
        raised: 0,
        status: "financing",
        pending: 100000,
        payments_done: 0,
        payments_delayed: 0,
      },
    ]);
    const invest1_oid = new ObjectId();
    const invest2_oid = new ObjectId();
    const invest3_oid = new ObjectId();
    await investments.insertMany([
      {
        _id: invest1_oid,
        borrower_id: user1_id,
        lender_id: user2_id,
        loan_oid: loan1_oid,
        quantity: 100000,
        status: "delay payment",
        created_at: now,
        updated_at: now,
        payments: 0,
        term: 2,
        roi: 17,
        moratory: 720,
        interest_to_earn: 1978,
        paid_already: 0,
        to_be_paid: 0,
        amortize: 50989,
        status_type: "on_going",
      },
      {
        _id: invest2_oid,
        borrower_id: user1_id,
        lender_id: user2_id,
        loan_oid: loan2_oid,
        quantity: 100000,
        status: "delay payment",
        created_at: now,
        updated_at: now,
        payments: 1,
        term: 2,
        roi: 17,
        moratory: 720,
        interest_to_earn: 1978,
        paid_already: 0,
        to_be_paid: 0,
        amortize: 50989,
        status_type: "on_going",
      },
      {
        _id: invest3_oid,
        borrower_id: user3_id,
        lender_id: user2_id,
        loan_oid: loan3_oid,
        quantity: 100000,
        status: "delay payment",
        created_at: now,
        updated_at: now,
        payments: 1,
        term: 2,
        roi: 17,
        moratory: 720,
        interest_to_earn: 1978,
        paid_already: 50989,
        to_be_paid: 50989,
        amortize: 50989,
        status_type: "on_going",
      },
    ]);
    await dayFunction(dbInstance, producer);
    await UserTransaction(
      JSON.stringify({
        quantity: -51709,
        user_id: user1_id,
        scheduled_id: scheduled1_oid,
        loan_id: loan1_oid,
        isDelayed: true,
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
        quantity: -51709,
        user_id: user1_id,
        scheduled_id: scheduled4_oid,
        loan_id: loan2_oid,
        isDelayed: true,
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
        quantity: -51709,
        user_id: user3_id,
        scheduled_id: scheduled6_oid,
        loan_id: loan3_oid,
        isDelayed: true,
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
        interest: 51709,
        user_id: user2_id,
        loan_id: loan1_oid.toHexString(),
        borrower_id: user1_id,
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
        interest: 51709,
        user_id: user2_id,
        loan_id: loan2_oid.toHexString(),
        borrower_id: user1_id,
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
        user_id: user2_id,
        loan_id: loan2_oid.toHexString(),
        borrower_id: user2_id,
      }),
      users,
      producer,
      loans,
      transactions,
      scheduledPayments,
      investments
    );
    const user = await users.findOne({
      id: user1_id,
    });
    expect(user).toEqual({
      _id: user1_oid,
      id: user1_id,
      account_available: 896582,
      account_to_be_paid: 0,
      account_total: 896582,
      account_withheld: 0,
    });
    const user2 = await users.findOne({
      id: user2_id,
    });
    expect(user2).toEqual({
      _id: user2_oid,
      id: user2_id,
      account_available: 203394,
      account_to_be_paid: 102731,
      account_total: 306125,
      account_withheld: 0,
    });
    const transactions_borrower = await transactions
      .find({
        user_id: user1_id,
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
        quantity: -51709,
        type: "payment",
        user_id: user1_id,
      },
      {
        _id: "",
        created_at: "",
        quantity: -51709,
        type: "payment",
        user_id: user1_id,
      },
    ]);
    const transactions_lender = await transactions
      .find({
        user_id: user2_id,
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
        quantity: 51709,
        type: "collect",
        borrower_id: user1_id,
        loan_oid: loan1_oid,
        user_id: user2_id,
      },
      {
        _id: "",
        created_at: "",
        quantity: 51709,
        type: "collect",
        borrower_id: user1_id,
        loan_oid: loan2_oid,
        user_id: user2_id,
      },
    ]);
    const allLoans = await loans
      .find({
        user_id: {
          $in: [user1_id, user3_id],
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
        status: "to be paid",
      },
      {
        status: "paid",
      },
      {
        status: "to be paid",
      },
    ]);
    const allPayments = await scheduledPayments.find({}).toArray();
    expect(allPayments).toEqual([
      {
        _id: scheduled1_oid,
        amortize: 50989,
        status: "paid",
        scheduled_date: addDays(startOfDay(now), -30),
        loan_oid: loan1_oid,
      },
      {
        _id: scheduled2_oid,
        amortize: 50989,
        status: "to be paid",
        scheduled_date: startOfDay(now),
        loan_oid: loan1_oid,
      },
      {
        _id: scheduled3_oid,
        amortize: 50989,
        scheduled_date: startOfDay(addMonths(now, -2)),
        status: "paid",
        loan_oid: loan2_oid,
      },
      {
        _id: scheduled4_oid,
        amortize: 50989,
        scheduled_date: addDays(startOfDay(now), -30),
        status: "paid",
        loan_oid: loan2_oid,
      },
      {
        _id: scheduled5_oid,
        amortize: 50989,
        scheduled_date: startOfDay(addMonths(now, -2)),
        status: "paid",
        loan_oid: loan3_oid,
      },
      {
        _id: scheduled6_oid,
        amortize: 50989,
        scheduled_date: addDays(startOfDay(now), -30),
        status: "delayed",
        loan_oid: loan3_oid,
      },
    ]);
    const allInvestments = await investments
      .find({
        lender_id: user2_id,
      })
      .toArray();
    expect(allInvestments.length).toBe(3);
    expect(allInvestments).toEqual([
      {
        roi: 17,
        _id: invest1_oid,
        borrower_id: user1_id,
        lender_id: user2_id,
        loan_oid: loan1_oid,
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
        status_type: "on_going",
      },
      {
        roi: 17,
        _id: invest2_oid,
        borrower_id: user1_id,
        lender_id: user2_id,
        loan_oid: loan2_oid,
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
        status_type: "over",
      },
      {
        roi: 17,
        _id: invest3_oid,
        borrower_id: user3_id,
        lender_id: user2_id,
        loan_oid: loan3_oid,
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
        status_type: "on_going",
      },
    ]);
  });
});
