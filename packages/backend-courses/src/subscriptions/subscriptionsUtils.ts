import {
  InvestmentMongo,
  LoanMongo,
  TransactionMongo,
  UserMongo,
} from "../types";
import { base64 } from "../utils";
import {
  pubsub,
  USER,
  TRANSACTION_INSERT,
  INVESTMENT_INSERT,
  LOAN_INSERT,
  INVESTMENT_UPDATE,
  LOAN_UPDATE,
} from "./subscriptions";

export const publishUser = (user: UserMongo) => {
  pubsub.publish(USER, {
    user_subscribe: user,
  });
};

export const publishTransactionInsert = (transaction: TransactionMongo) => {
  pubsub.publish(TRANSACTION_INSERT, {
    transactions_subscribe_insert: {
      node: transaction,
      cursor: base64(transaction._id?.toHexString() || ""),
    },
  });
};

export const publishLoanInsert = (loan: LoanMongo) => {
  pubsub.publish(LOAN_INSERT, {
    transactions_subscribe_insert: {
      node: loan,
      cursor: base64(loan._id?.toHexString() || ""),
    },
  });
};

export const publishInvestmentInsert = (investment: InvestmentMongo) => {
  pubsub.publish(INVESTMENT_INSERT, {
    transactions_subscribe_insert: {
      node: investment,
      cursor: base64(investment._id?.toHexString() || ""),
    },
  });
};

export const publishLoanUpdate = (loan: LoanMongo) => {
  pubsub.publish(LOAN_UPDATE, {
    transactions_subscribe_update: loan,
  });
};

export const publishInvestmentUpdate = (investment: InvestmentMongo) => {
  pubsub.publish(INVESTMENT_UPDATE, {
    transactions_subscribe_update: investment,
  });
};
