import { getFintechCollections } from "@repo/mongo-utils";
import { KAFKA_ID } from "@repo/utils";
import { KafkaContainer } from "@testcontainers/kafka";
import { MongoDBContainer } from "@testcontainers/mongodb";
import { addDays, addMonths, startOfDay } from "date-fns";
import { Kafka } from "kafkajs";
import { MongoClient, ObjectId } from "mongodb";
import { dayFunction } from "./cronJobDay.ts";
import { after, describe, it } from "node:test";
import { strictEqual } from "node:assert";

describe("cronJobs tests", async () => {
  const startedMongoContainer = await new MongoDBContainer().start();
  const startedKafkaContainer = await new KafkaContainer().withExposedPorts(9093).start();
  const name = startedKafkaContainer.getHost();
  const port = startedKafkaContainer.getMappedPort(9093);
  const kafka = new Kafka({
    clientId: KAFKA_ID,
    brokers: [`${name}:${port}`],
  });
  const admin = kafka.admin();
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
  const producer = kafka.producer();
  await producer.connect();
  const mongoClient = await MongoClient.connect(startedMongoContainer.getConnectionString(), { directConnection: true });
  const dbInstanceFintech = mongoClient.db("fintech");

  after(
    async () => {
      await producer.disconnect();
      await admin.disconnect();
      await startedKafkaContainer.stop();
      await mongoClient.close();
    },
    { timeout: 10_000 },
  );

  it("dayFunction test", async () => {
    const { users, loans, investments, scheduledPayments } = getFintechCollections(dbInstanceFintech);
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
        account_available: 10_000_00,
        account_to_be_paid: 0,
        account_total: 10_000_00,
        account_withheld: 0,
      },
      {
        _id: user2_oid,
        id: user2_id,
        account_available: 1_000_00,
        account_to_be_paid: 2_061_25,
        account_total: 3_061_25,
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
        amortize: 509_89,
        scheduled_date: addDays(startOfDay(now), -30),
        status: "delayed",
        loan_oid: loan1_oid,
      },
      {
        _id: scheduled2_oid,
        amortize: 509_89,
        scheduled_date: startOfDay(now),
        status: "to be paid",
        loan_oid: loan1_oid,
      },
      {
        _id: scheduled3_oid,
        amortize: 509_89,
        scheduled_date: startOfDay(addMonths(now, -2)),
        status: "paid",
        loan_oid: loan2_oid,
      },
      {
        _id: scheduled4_oid,
        amortize: 509_89,
        scheduled_date: addDays(startOfDay(now), -30),
        status: "delayed",
        loan_oid: loan2_oid,
      },
      {
        _id: scheduled5_oid,
        amortize: 509_89,
        scheduled_date: startOfDay(addMonths(now, -2)),
        status: "paid",
        loan_oid: loan3_oid,
      },
      {
        _id: scheduled6_oid,
        amortize: 509_89,
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
        goal: 1_000_00,
        expiry: now,
        term: 2,
        raised: 1_000_00,
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
        goal: 1_000_00,
        expiry: now,
        term: 2,
        raised: 1_000_00,
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
        goal: 1_000_00,
        expiry: now,
        term: 2,
        raised: 1_000_00,
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
        goal: 1_000_00,
        expiry: now,
        term: 2,
        raised: 0,
        status: "financing",
        pending: 1_000_00,
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
        quantity: 1_000_00,
        status: "delay payment",
        created_at: now,
        updated_at: now,
        payments: 0,
        term: 2,
        roi: 17,
        moratory: 7_20,
        interest_to_earn: 19_78,
        paid_already: 0,
        to_be_paid: 0,
        amortize: 509_89,
        status_type: "on_going",
      },
      {
        _id: invest2_oid,
        borrower_id: user1_id,
        lender_id: user2_id,
        loan_oid: loan2_oid,
        quantity: 1_000_00,
        status: "delay payment",
        created_at: now,
        updated_at: now,
        payments: 1,
        term: 2,
        roi: 17,
        moratory: 7_20,
        interest_to_earn: 19_78,
        paid_already: 0,
        to_be_paid: 0,
        amortize: 509_89,
        status_type: "on_going",
      },
      {
        _id: invest3_oid,
        borrower_id: user3_id,
        lender_id: user2_id,
        loan_oid: loan3_oid,
        quantity: 1_000_00,
        status: "delay payment",
        created_at: now,
        updated_at: now,
        payments: 1,
        term: 2,
        roi: 17,
        moratory: 7_20,
        interest_to_earn: 19_78,
        paid_already: 509_89,
        to_be_paid: 509_89,
        amortize: 509_89,
        status_type: "on_going",
      },
    ]);
    await dayFunction(dbInstanceFintech, producer);
    await new Promise((resolve) => setTimeout(resolve, 1_000));
    const count = await admin.fetchTopicOffsets("user-transaction");
    strictEqual(count[0].offset, "3");
  });
});
