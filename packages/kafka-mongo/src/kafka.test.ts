import { Admin, Consumer, Kafka, Producer } from "kafkajs";
import { KafkaContainer, StartedKafkaContainer } from "@testcontainers/kafka";
import { runKafkaConsumer } from "./kafka";
import { Db, MongoClient, ObjectId } from "mongodb";
import {
  InvestmentMongo,
  LoanMongo,
  ScheduledPaymentsMongo,
  TransactionMongo,
  UserMongo,
} from "./types";
import { addMonths, startOfMonth } from "date-fns";
import { Redis, RedisOptions } from "ioredis";
import { StartedRedisContainer, RedisContainer } from "@testcontainers/redis";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { KAFKA_ID } from "@lerna-monorepo/backend-utilities/config";

const delay = async () =>
  new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 3000);
  });

describe("Kafka", () => {
  let client: MongoClient;
  let dbInstance: Db;
  let pubsub: RedisPubSub;
  let ioredisPublisherClient: Redis;
  let ioredisSubscriberClient: Redis;
  let startedRedisContainer: StartedRedisContainer;
  let startedKafkaContainer: StartedKafkaContainer;
  let admin: Admin;
  let producer: Producer;
  let consumer: Consumer;

  beforeAll(async () => {
    client = await MongoClient.connect(
      (global as unknown as { __MONGO_URI__: string }).__MONGO_URI__,
      {}
    );
    dbInstance = client.db(
      (global as unknown as { __MONGO_DB_NAME__: string }).__MONGO_DB_NAME__
    );
    startedRedisContainer = await new RedisContainer().start();
    const options: RedisOptions = {
      host: startedRedisContainer.getConnectionUrl(),
      port: 6379,
      retryStrategy: () => 10000,
    };
    ioredisPublisherClient = new Redis(options);
    ioredisSubscriberClient = new Redis(options);
    pubsub = new RedisPubSub({
      publisher: ioredisPublisherClient,
      subscriber: ioredisSubscriberClient,
    });
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
    await admin.disconnect();
    producer = kafka.producer();
    await producer.connect();
    consumer = kafka.consumer({ groupId: "test-group" });
  }, 20000);

  afterAll(async () => {
    await admin.disconnect();
    await producer.disconnect();
    await consumer.disconnect();
    await startedKafkaContainer.stop();
    ioredisPublisherClient.disconnect();
    ioredisSubscriberClient.disconnect();
    await startedRedisContainer.stop();
    await client.close();
    await delay();
  }, 20000);

  it("add/decrease funds", async () => {
    const loans = dbInstance.collection<LoanMongo>("loans");
    const investments = dbInstance.collection<InvestmentMongo>("investments");
    const transactions =
      dbInstance.collection<TransactionMongo>("transactions");
    const users = dbInstance.collection<UserMongo>("users");
    const scheduledPayments =
      dbInstance.collection<ScheduledPaymentsMongo>("scheduledPayments");
    await runKafkaConsumer(
      consumer,
      producer,
      loans,
      users,
      transactions,
      scheduledPayments,
      investments,
      pubsub
    );
    const user1_oid = new ObjectId();
    const user1_id = "user1_id";
    const user2_oid = new ObjectId();
    const user2_id = "user2_id";
    const user3_oid = new ObjectId();
    const user3_id = "user3_id";
    const user4_oid = new ObjectId();
    const user4_id = "user4_id";
    const user5_oid = new ObjectId();
    const user5_id = "user5_id";
    const user6_oid = new ObjectId();
    const user6_id = "user6_id";
    const user7_oid = new ObjectId();
    const user7_id = "user7_id";
    const user8_oid = new ObjectId();
    const user8_id = "user8_id";
    const user9_oid = new ObjectId();
    const user9_id = "user9_id";
    const laon1_oid = new ObjectId();
    const laon2_oid = new ObjectId();
    const laon3_oid = new ObjectId();
    await users.insertOne({
      _id: user1_oid,
      id: user1_id,
      account_available: 0,
      account_to_be_paid: 0,
      account_total: 0,
      account_withheld: 0,
    });
    await users.insertOne({
      _id: user2_oid,
      id: user2_id,
      account_available: 10000,
      account_to_be_paid: 0,
      account_total: 10000,
      account_withheld: 0,
    });
    await users.insertOne({
      _id: user3_oid,
      id: user3_id,
      account_available: 10000,
      account_to_be_paid: 0,
      account_total: 10000,
      account_withheld: 0,
    });
    await users.insertOne({
      _id: user4_oid,
      id: user4_id,
      account_available: 10000,
      account_to_be_paid: 0,
      account_total: 10000,
      account_withheld: 0,
    });
    await users.insertOne({
      _id: user5_oid,
      id: user5_id,
      account_available: 10000,
      account_to_be_paid: 0,
      account_total: 10000,
      account_withheld: 0,
    });
    await users.insertOne({
      _id: user6_oid,
      id: user6_id,
      account_available: 0,
      account_to_be_paid: 0,
      account_total: 0,
      account_withheld: 0,
    });
    await users.insertOne({
      _id: user7_oid,
      id: user7_id,
      account_available: 10000,
      account_to_be_paid: 0,
      account_total: 10000,
      account_withheld: 0,
    });
    await users.insertOne({
      _id: user8_oid,
      id: user8_id,
      account_available: 0,
      account_to_be_paid: 0,
      account_total: 0,
      account_withheld: 0,
    });
    await users.insertOne({
      _id: user9_oid,
      id: user9_id,
      account_available: 5000,
      account_to_be_paid: 0,
      account_total: 5000,
      account_withheld: 0,
    });
    const expiry = addMonths(new Date(), 3);
    await loans.insertOne({
      _id: laon1_oid,
      user_id: user4_id,
      score: "AAA",
      raised: 4990000,
      expiry,
      roi: 17,
      goal: 5000000,
      term: 5,
      status: "financing",
      pending: 10000,
      payments_delayed: 0,
      payments_done: 0,
    });
    await loans.insertOne({
      _id: laon2_oid,
      user_id: user6_id,
      score: "AAA",
      raised: 4995000,
      expiry,
      roi: 17,
      goal: 5000000,
      term: 5,
      status: "financing",
      pending: 5000,
      payments_delayed: 0,
      payments_done: 0,
    });
    await loans.insertOne({
      _id: laon3_oid,
      user_id: user8_id,
      score: "AAA",
      raised: 4985000,
      expiry,
      roi: 17,
      goal: 5000000,
      term: 5,
      status: "financing",
      pending: 15000,
      payments_delayed: 0,
      payments_done: 0,
    });
    await producer.send({
      topic: "user-transaction",
      messages: [
        //Add funds
        {
          value: JSON.stringify({
            quantity: 10000,
            user_id: user1_id,
          }),
          key: user1_id,
        },
        //Decrease funds
        {
          value: JSON.stringify({
            quantity: -10000,
            user_id: user2_id,
          }),
          key: user2_id,
        },
        //New completed loan
        {
          value: JSON.stringify({
            withheldFromAvailable: 10000,
            user_id: user3_id,
            nextTopic: "loan-transaction",
            nextKey: laon1_oid.toHexString(),
            nextValue: JSON.stringify({
              quantity: 10000,
              lender_id: user3_id,
              loan_id: laon1_oid.toHexString(),
              nextTopic: "add-lends",
              nextKey: user3_id,
              nextValue: JSON.stringify({
                quantity: 10000,
                loan_id: laon1_oid.toHexString(),
                lender_id: user3_id,
              }),
            }),
          }),
          key: user3_id,
        },
        //Return money
        {
          value: JSON.stringify({
            withheldFromAvailable: 10000,
            user_id: user5_id,
            nextTopic: "loan-transaction",
            nextKey: laon2_oid.toHexString(),
            nextValue: JSON.stringify({
              quantity: 10000,
              lender_id: user5_id,
              loan_id: laon2_oid.toHexString(),
              nextTopic: "add-lends",
              nextKey: user5_id,
              nextValue: JSON.stringify({
                quantity: 10000,
                loan_id: laon2_oid.toHexString(),
                lender_id: user5_id,
              }),
            }),
          }),
          key: user5_id,
        },
        //Two separated lends
        {
          value: JSON.stringify({
            withheldFromAvailable: 5000,
            user_id: user7_id,
            nextTopic: "loan-transaction",
            nextKey: laon3_oid.toHexString(),
            nextValue: JSON.stringify({
              quantity: 5000,
              lender_id: user7_id,
              loan_id: laon3_oid.toHexString(),
              nextTopic: "add-lends",
              nextKey: user7_id,
              nextValue: JSON.stringify({
                quantity: 5000,
                loan_id: laon3_oid.toHexString(),
                lender_id: user7_id,
              }),
            }),
          }),
          key: user7_id,
        },
        {
          value: JSON.stringify({
            withheldFromAvailable: 5000,
            user_id: user9_id,
            nextTopic: "loan-transaction",
            nextKey: laon3_oid.toHexString(),
            nextValue: JSON.stringify({
              quantity: 5000,
              lender_id: user9_id,
              loan_id: laon3_oid.toHexString(),
              nextTopic: "add-lends",
              nextKey: user9_id,
              nextValue: JSON.stringify({
                quantity: 5000,
                loan_id: laon3_oid.toHexString(),
                lender_id: user9_id,
              }),
            }),
          }),
          key: user9_id,
        },
        {
          value: JSON.stringify({
            withheldFromAvailable: 5000,
            user_id: user7_id,
            nextTopic: "loan-transaction",
            nextKey: laon3_oid.toHexString(),
            nextValue: JSON.stringify({
              quantity: 5000,
              lender_id: user7_id,
              loan_id: laon3_oid.toHexString(),
              nextTopic: "add-lends",
              nextKey: user7_id,
              nextValue: JSON.stringify({
                quantity: 5000,
                loan_id: laon3_oid.toHexString(),
                lender_id: user7_id,
              }),
            }),
          }),
          key: user7_id,
        },
      ],
    });
    await delay();
    const user1 = await users.findOne({ id: user1_id });
    expect(user1).toEqual({
      _id: user1_oid,
      id: user1_id,
      account_available: 10000,
      account_to_be_paid: 0,
      account_total: 10000,
      account_withheld: 0,
    });
    const user2 = await users.findOne({ id: user2_id });
    expect(user2).toEqual({
      _id: user2_oid,
      id: user2_id,
      account_available: 0,
      account_to_be_paid: 0,
      account_total: 0,
      account_withheld: 0,
    });
    const user3 = await users.findOne({ id: user3_id });
    expect(user3).toEqual({
      _id: user3_oid,
      id: user3_id,
      account_available: 0,
      account_to_be_paid: 10395,
      account_total: 10395,
      account_withheld: 0,
    });
    const user4 = await users.findOne({ id: user4_id });
    expect(user4).toEqual({
      _id: user4_oid,
      id: user4_id,
      account_available: 5010000,
      account_to_be_paid: 0,
      account_total: 5010000,
      account_withheld: 0,
    });
    const user5 = await users.findOne({ id: user5_id });
    expect(user5).toEqual({
      _id: user5_oid,
      id: user5_id,
      account_available: 10000,
      account_to_be_paid: 0,
      account_total: 10000,
      account_withheld: 0,
    });
    const user6 = await users.findOne({ id: user6_id });
    expect(user6).toEqual({
      _id: user6_oid,
      id: user6_id,
      account_available: 0,
      account_to_be_paid: 0,
      account_total: 0,
      account_withheld: 0,
    });
    const user7 = await users.findOne({ id: user7_id });
    expect(user7).toEqual({
      _id: user7_oid,
      id: user7_id,
      account_available: 0,
      account_to_be_paid: 10395,
      account_total: 10395,
      account_withheld: 0,
    });
    const user8 = await users.findOne({ id: user8_id });
    expect(user8).toEqual({
      _id: user8_oid,
      id: user8_id,
      account_available: 5000000,
      account_to_be_paid: 0,
      account_total: 5000000,
      account_withheld: 0,
    });
    const user9 = await users.findOne({ id: user9_id });
    expect(user9).toEqual({
      _id: user9_oid,
      id: user9_id,
      account_available: 0,
      account_to_be_paid: 5195,
      account_total: 5195,
      account_withheld: 0,
    });
    const loan1 = await loans.findOne({ _id: laon1_oid });
    expect(loan1).toEqual({
      _id: laon1_oid,
      user_id: user4_id,
      score: "AAA",
      raised: 5000000,
      expiry,
      roi: 17,
      goal: 5000000,
      term: 5,
      status: "to be paid",
      pending: 0,
      payments_delayed: 0,
      payments_done: 0,
    });
    const investments1 = await investments
      .find({ lender_id: user3_id })
      .toArray();
    expect(
      investments1.map(({ _id, created_at, updated_at, ...investment }) => ({
        ...investment,
        _id: ObjectId.isValid(_id),
        created_at: created_at instanceof Date,
        updated_at: updated_at instanceof Date,
      }))
    ).toEqual([
      {
        _id: true,
        borrower_id: user4_id,
        lender_id: user3_id,
        loan_oid: laon1_oid,
        created_at: true,
        quantity: 10000,
        updated_at: true,
        status: "up to date",
        roi: 17,
        moratory: 0,
        payments: 0,
        term: 5,
        interest_to_earn: 395,
        to_be_paid: 10395,
        paid_already: 0,
        amortize: 2079,
        status_type: "on_going",
      },
    ]);
    const now = new Date();
    const scheduledPayments1 = await scheduledPayments
      .find({ loan_oid: laon1_oid })
      .toArray();
    expect(
      scheduledPayments1.map(({ _id, ...scheduledPayments }) => ({
        ...scheduledPayments,
        _id: ObjectId.isValid(_id),
      }))
    ).toEqual([
      {
        _id: true,
        loan_oid: laon1_oid,
        amortize: 1039853,
        scheduled_date: startOfMonth(addMonths(now, 1)),
        status: "to be paid",
      },
      {
        _id: true,
        loan_oid: laon1_oid,
        amortize: 1039853,
        scheduled_date: startOfMonth(addMonths(now, 2)),
        status: "to be paid",
      },
      {
        _id: true,
        loan_oid: laon1_oid,
        amortize: 1039853,
        scheduled_date: startOfMonth(addMonths(now, 3)),
        status: "to be paid",
      },
      {
        _id: true,
        loan_oid: laon1_oid,
        amortize: 1039853,
        scheduled_date: startOfMonth(addMonths(now, 4)),
        status: "to be paid",
      },
      {
        _id: true,
        loan_oid: laon1_oid,
        amortize: 1039853,
        scheduled_date: startOfMonth(addMonths(now, 5)),
        status: "to be paid",
      },
    ]);
  }, 200000);
});
