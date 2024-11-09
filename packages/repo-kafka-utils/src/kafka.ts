import { Consumer, Producer } from "kafkajs";
import { Db } from "mongodb";
import {
  InvestmentMongo,
  LoanMongo,
  RecordsMongo,
  ScheduledPaymentsMongo,
  TransactionMongo,
  FintechUserMongo,
} from "@repo/mongo-utils/types";
import { LoanTransaction } from "./kafkaLoanTransaction";
import { UserTransaction } from "./kafkaUserTransaction";
import { AddLends } from "./kafkaLendTransaction";
import { RedisPubSub } from "graphql-redis-subscriptions";

export const runKafkaConsumer = async (
  consumer: Consumer,
  producer: Producer,
  db: Db,
  pubsub: RedisPubSub
) => {
  const loans = db.collection<LoanMongo>("loans");
  const investments = db.collection<InvestmentMongo>("investments");
  const transactions = db.collection<TransactionMongo>("transactions");
  const users = db.collection<FintechUserMongo>("users");
  const scheduledPayments =
    db.collection<ScheduledPaymentsMongo>("scheduledPayments");
  const records = db.collection<RecordsMongo>("records");
  await consumer.connect();
  await consumer.subscribe({
    topics: ["add-lends", "user-transaction", "loan-transaction"],
    fromBeginning: true,
  });
  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const value = message.value?.toString() || "{}";
      if (topic === "loan-transaction") {
        await LoanTransaction(
          value,
          loans,
          producer,
          scheduledPayments,
          records
        );
      } else if (topic === "user-transaction") {
        await UserTransaction(
          value,
          users,
          producer,
          loans,
          transactions,
          scheduledPayments,
          investments,
          pubsub,
          records
        );
      } else if (topic === "add-lends") {
        await AddLends(value, loans, investments, producer, records);
      }
    },
  });
};
