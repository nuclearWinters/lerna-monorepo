import { addMonths, startOfDay } from "date-fns";
import { Db, MongoClient, ObjectId } from "mongodb";
import {
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
  });
});
