import { MongoClient } from "mongodb";
import {
  InvestmentMongo,
  LoanMongo,
  ScheduledPaymentsMongo,
  TransactionMongo,
  UserMongo,
} from "./types";
import { runKafkaConsumer } from "./kafka";
import { Kafka } from "kafkajs";
import { MONGO_DB, KAFKA, KAFKA_ID } from "../../backend-utilities/src/config";

const kafka = new Kafka({
  clientId: KAFKA_ID,
  brokers: [KAFKA],
});

const producer = kafka.producer();

MongoClient.connect(MONGO_DB, {}).then(async (client) => {
  const db = client.db("fintech");
  const consumer = kafka.consumer({ groupId: "test-group" });
  const loans = db.collection<LoanMongo>("loans");
  const investments = db.collection<InvestmentMongo>("investments");
  const transactions = db.collection<TransactionMongo>("transactions");
  const users = db.collection<UserMongo>("users");
  const scheduledPayments =
    db.collection<ScheduledPaymentsMongo>("scheduledPayments");
  await producer.connect();
  runKafkaConsumer(
    consumer,
    producer,
    loans,
    users,
    transactions,
    scheduledPayments,
    investments
  );
});
