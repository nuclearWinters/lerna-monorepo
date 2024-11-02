import { addDays, addMonths, startOfDay } from "date-fns";
import { Db, MongoClient, ObjectId } from "mongodb";
import {
  InvestmentMongo,
  LoanMongo,
  UserMongo,
  ScheduledPaymentsMongo,
} from "./types";
import { Admin, Kafka, Producer } from "kafkajs";
import { dayFunction } from "./cronJobDay";
import { KafkaContainer, StartedKafkaContainer } from "@testcontainers/kafka";
import { KAFKA_ID } from "@repo/utils/config";

describe("cronJobs tests", () => {
  let mongoClient: MongoClient;
  let dbInstanceFintech: Db;
  let producer: Producer;
  let startedKafkaContainer: StartedKafkaContainer;
  let admin: Admin;

  beforeAll(async () => {
    mongoClient = await MongoClient.connect(
      (global as unknown as { __MONGO_URI__: string }).__MONGO_URI__,
      {}
    );
    dbInstanceFintech = mongoClient.db(
      (global as unknown as { __MONGO_DB_NAME__: string }).__MONGO_DB_NAME__
    );
    startedKafkaContainer = await new KafkaContainer()
      .withExposedPorts(9093)
      .start();
    const name = startedKafkaContainer.getHost();
    const port = startedKafkaContainer.getMappedPort(9093);
    const kafka = new Kafka({
      clientId: KAFKA_ID,
      brokers: [`${name}:${port}`],
    });
    admin = kafka.admin();
    await admin.connect();
    await admin.createTopics({
      validateOnly: false,
      topics: [
        {
          topic: "add-lends",
        },
        {
          topic: "user-transaction",
        },
        {
          topic: "loan-transaction",
        },
      ],
    });
    producer = kafka.producer();
    await producer.connect();
  }, 30000);

  afterAll(async () => {
    await producer.disconnect();
    await admin.disconnect();
    await startedKafkaContainer.stop();
    await mongoClient.close();
  }, 10000);

  it("dayFunction test", async () => {
    const users = dbInstanceFintech.collection<UserMongo>("users");
    const loans = dbInstanceFintech.collection<LoanMongo>("loans");
    const investments =
      dbInstanceFintech.collection<InvestmentMongo>("investments");
    const scheduledPayments =
      dbInstanceFintech.collection<ScheduledPaymentsMongo>("scheduledPayments");
    const now = new Date();
    const user1_oid = new ObjectId();
    const user2_oid = new ObjectId();
    const user3_oid = new ObjectId();
    const user1_id = crypto.randomUUID();
    const user2_id = crypto.randomUUID();
    const user3_id = crypto.randomUUID();
    const user4_id = crypto.randomUUID();
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
        user_id: user4_id,
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
    await dayFunction(dbInstanceFintech, producer);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const count = await admin.fetchTopicOffsets("user-transaction");
    expect(count[0].offset).toBe("3");
  });
});
