import { Kafka } from "kafkajs";
import { KafkaContainer } from "@testcontainers/kafka";
import { runKafkaConsumer } from "./kafka";
import { Db, MongoClient, ObjectId } from "mongodb";
import {
  InvestmentMongo,
  LoanMongo,
  ScheduledPaymentsMongo,
  TransactionMongo,
  UserMongo,
} from "./types";

jest.mock("ioredis", () =>
  jest.fn().mockImplementation(() => {
    return {};
  })
);

jest.mock("graphql-redis-subscriptions", () => {
  return {
    RedisPubSub: function () {
      return {
        publish: jest.fn(),
      };
    },
  };
});

const delay = async () =>
  new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });

describe("Kafka", () => {
  let client: MongoClient;
  let dbInstance: Db;

  beforeAll(async () => {
    client = await MongoClient.connect(
      (global as unknown as { __MONGO_URI__: string }).__MONGO_URI__,
      {}
    );
    dbInstance = client.db(
      (global as unknown as { __MONGO_DB_NAME__: string }).__MONGO_DB_NAME__
    );
  });

  afterAll(async () => {
    await client.close();
  });

  it("add/decrease funds", async () => {
    const kafkaContainer = await new KafkaContainer()
      .withExposedPorts(9093)
      .start();
    const name = kafkaContainer.getHost();
    const port = kafkaContainer.getMappedPort(9093);
    const kafka = new Kafka({
      clientId: "my-app",
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
    await admin.disconnect();
    const producer = kafka.producer();
    await producer.connect();
    const consumer = kafka.consumer({ groupId: "test-group" });
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
      investments
    );
    const user1_oid = new ObjectId();
    const user1_id = "user1_id";
    const user2_oid = new ObjectId();
    const user2_id = "user2_id";
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
    await producer.send({
      topic: "user-transaction",
      messages: [
        {
          value: JSON.stringify({
            quantity: 10000,
            user_id: user1_id,
          }),
          key: user1_id,
        },
        {
          value: JSON.stringify({
            quantity: -10000,
            user_id: user2_id,
          }),
          key: user2_id,
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
    await producer.disconnect();
    await consumer.disconnect();
    await kafkaContainer.stop();
  }, 200000);
});
