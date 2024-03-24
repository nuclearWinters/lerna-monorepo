import {
  InvestmentCassandra,
  LoanCassandra,
  TransactionCassandra,
  UserCassandra,
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
  MY_LOAN_INSERT,
} from "./subscriptions";

export const publishUser = (user: UserCassandra) => {
  pubsub.publish(USER, {
    user_subscribe: user,
  });
};

export const publishTransactionInsert = (transaction: TransactionCassandra) => {
  pubsub.publish(TRANSACTION_INSERT, {
    transactions_subscribe_insert: {
      node: transaction,
      cursor: base64(transaction.id),
    },
  });
};

export const publishLoanInsert = (loan: LoanCassandra) => {
  pubsub.publish(LOAN_INSERT, {
    loans_subscribe_insert: {
      node: loan,
      cursor: base64(loan.id),
    },
  });
};

export const publishMyLoanInsert = (loan: LoanCassandra) => {
  pubsub.publish(MY_LOAN_INSERT, {
    my_loans_subscribe_insert: {
      node: loan,
      cursor: base64(loan.id),
    },
  });
};

export const publishInvestmentInsert = (investment: InvestmentCassandra) => {
  pubsub.publish(INVESTMENT_INSERT, {
    investments_subscribe_insert: {
      node: investment,
      cursor: base64(investment.id),
    },
  });
};

export const publishLoanUpdate = (loan: LoanCassandra) => {
  pubsub.publish(LOAN_UPDATE, {
    loans_subscribe_update: loan,
  });
};

export const publishInvestmentUpdate = (investment: InvestmentCassandra) => {
  pubsub.publish(INVESTMENT_UPDATE, {
    investments_subscribe_update: investment,
  });
};
