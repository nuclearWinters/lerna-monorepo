import { Consumer, Producer } from "kafkajs";
import { Collection } from "mongodb";
import {
  InvestmentMongo,
  LoanMongo,
  ScheduledPaymentsMongo,
  TransactionMongo,
  UserMongo,
} from "./types";
import { LoanTransaction } from "./kafkaLoanTransaction";
import { UserTransaction } from "./kafkaUserTransaction";
import { AddLends } from "./kafkaLendTransaction";

export const runKafkaConsumer = async (
  consumer: Consumer,
  producer: Producer,
  loans: Collection<LoanMongo>,
  users: Collection<UserMongo>,
  transactions: Collection<TransactionMongo>,
  scheduledPayments: Collection<ScheduledPaymentsMongo>,
  investments: Collection<InvestmentMongo>
) => {
  await consumer.connect();
  await consumer.subscribe({
    topics: ["add-lends", "user-transaction", "loan-transaction"],
    fromBeginning: true,
  });
  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const value = message.value?.toString() || "{}";
      if (topic === "loan-transaction") {
        await LoanTransaction(value, loans, producer, scheduledPayments);
      } else if (topic === "user-transaction") {
        await UserTransaction(
          value,
          users,
          producer,
          loans,
          transactions,
          scheduledPayments,
          investments
        );
      } else if (topic === "add-lends") {
        await AddLends(value, loans, investments, producer);
      }
    },
  });
};
