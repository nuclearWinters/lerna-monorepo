import type {
  InvestmentMongo,
  LoanMongo,
  TransactionMongo,
  FintechUserMongo,
} from "@repo/mongo-utils";
import { base64 } from "@repo/utils";
import {
  USER,
  TRANSACTION_INSERT,
  INVESTMENT_INSERT,
  LOAN_INSERT,
  INVESTMENT_UPDATE,
  LOAN_UPDATE,
  MY_LOAN_INSERT,
} from "./subscriptions.ts";
import type { RedisPubSub } from "graphql-redis-subscriptions";

export const publishUser = (user: FintechUserMongo, pubsub: RedisPubSub) => {
  pubsub.publish(USER, {
    user_subscribe: user,
  });
};

export const publishTransactionInsert = (
  transaction: TransactionMongo,
  pubsub: RedisPubSub
) => {
  pubsub.publish(TRANSACTION_INSERT, {
    transactions_subscribe_insert: {
      node: transaction,
      cursor: base64(transaction._id?.toHexString() || ""),
    },
  });
};

export const publishLoanInsert = (loan: LoanMongo, pubsub: RedisPubSub) => {
  pubsub.publish(LOAN_INSERT, {
    loans_subscribe_insert: {
      node: loan,
      cursor: base64(loan._id?.toHexString() || ""),
    },
  });
};

export const publishMyLoanInsert = (loan: LoanMongo, pubsub: RedisPubSub) => {
  pubsub.publish(MY_LOAN_INSERT, {
    my_loans_subscribe_insert: {
      node: loan,
      cursor: base64(loan._id?.toHexString() || ""),
    },
  });
};

export const publishInvestmentInsert = (
  investment: InvestmentMongo,
  pubsub: RedisPubSub
) => {
  pubsub.publish(INVESTMENT_INSERT, {
    investments_subscribe_insert: {
      node: investment,
      cursor: base64(investment._id?.toHexString() || ""),
    },
  });
};

export const publishLoanUpdate = (loan: LoanMongo, pubsub: RedisPubSub) => {
  pubsub.publish(LOAN_UPDATE, {
    loans_subscribe_update: loan,
  });
};

export const publishInvestmentUpdate = (
  investment: InvestmentMongo,
  pubsub: RedisPubSub
) => {
  pubsub.publish(INVESTMENT_UPDATE, {
    investments_subscribe_update: investment,
  });
};
