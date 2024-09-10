import {
  InvestmentMongo,
  LoanMongo,
  TransactionMongo,
  UserMongo,
} from "../types.js";
import { base64 } from "@lerna-monorepo/backend-utilities/index";
import {
  pubsub,
  USER,
  TRANSACTION_INSERT,
  INVESTMENT_INSERT,
  LOAN_INSERT,
  INVESTMENT_UPDATE,
  LOAN_UPDATE,
  MY_LOAN_INSERT,
} from "./subscriptions.js";

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
    loans_subscribe_insert: {
      node: loan,
      cursor: base64(loan._id?.toHexString() || ""),
    },
  });
};

export const publishMyLoanInsert = (loan: LoanMongo) => {
  pubsub.publish(MY_LOAN_INSERT, {
    my_loans_subscribe_insert: {
      node: loan,
      cursor: base64(loan._id?.toHexString() || ""),
    },
  });
};

export const publishInvestmentInsert = (investment: InvestmentMongo) => {
  pubsub.publish(INVESTMENT_INSERT, {
    investments_subscribe_insert: {
      node: investment,
      cursor: base64(investment._id?.toHexString() || ""),
    },
  });
};

export const publishLoanUpdate = (loan: LoanMongo) => {
  pubsub.publish(LOAN_UPDATE, {
    loans_subscribe_update: loan,
  });
};

export const publishInvestmentUpdate = (investment: InvestmentMongo) => {
  pubsub.publish(INVESTMENT_UPDATE, {
    investments_subscribe_update: investment,
  });
};
