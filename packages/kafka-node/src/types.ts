import { Client, mapping } from "cassandra-driver";
import { Producer } from "kafkajs";

export interface Context {
  client: Client;
  producer: Producer;
  users: mapping.ModelMapper<UserCassandra>;
  loans: mapping.ModelMapper<LoanCassandra>;
  investments: mapping.ModelMapper<InvestmentCassandra>;
  transactions: mapping.ModelMapper<TransactionCassandra>;
  accessToken: string | undefined;
  refreshToken: string | undefined;
  id?: string;
  validAccessToken?: string;
  isBorrower: boolean;
  isSupport: boolean;
  isLender: boolean;
}

export interface UserCassandra {
  id: string;
  account_available: number;
  account_to_be_paid: number;
  account_total: number;
  account_withheld: number;
}

export interface ILoanEdge {
  node: LoanCassandra;
  cursor: string;
}

export interface IInvestmentEdge {
  node: InvestmentCassandra;
  cursor: string;
}

export interface ITransactionEdge {
  node: TransactionCassandra;
  cursor: string;
}

export type TransactionInvestCassandraType = "collect" | "invest";

export type TransactionCassandraType = "credit" | "withdrawal" | "payment";

export type TransactionCassandra =
  | InvestmentTransactionCassandra
  | MoneyTransactionCassandra;

export interface InvestmentTransactionCassandra {
  id: string;
  user_id: string;
  type: TransactionInvestCassandraType;
  quantity: number;
  borrower_id: string;
  loan_id: string;
  created_at: Date;
}

export interface MoneyTransactionCassandra {
  id: string;
  user_id: string;
  type: TransactionCassandraType;
  quantity: number;
  created_at: Date;
}

export type ILoanStatus =
  | "paid"
  | "to be paid"
  | "financing"
  | "waiting for approval"
  | "past due";

export type IScheduledPaymentsStatus = "paid" | "to be paid" | "delayed";

export interface IScheduledPayments {
  amortize: number;
  status: IScheduledPaymentsStatus;
  scheduledDate: Date;
}

export interface LoanCassandra {
  id: string;
  user_id: string;
  score: string;
  roi: number;
  goal: number;
  term: number;
  raised: number;
  expiry: Date;
  status: ILoanStatus;
  pending: number;
  payments_done: number;
  payments_delayed: number;
}

export type IInvestmentStatus =
  | "delay payment"
  | "up to date"
  | "financing"
  | "past due"
  | "paid";

export type IInvestmentStatusType = "on_going" | "over";

export interface InvestmentCassandra {
  id: string;
  borrower_id: string;
  lender_id: string;
  loan_id: string;
  quantity: number;
  created_at: Date;
  updated_at: Date;
  status: IInvestmentStatus;
  status_type: IInvestmentStatusType;
  roi: number;
  term: number;
  payments: number;
  moratory: number;
  amortize: number;
  interest_to_earn: number;
  paid_already: number;
  to_be_paid: number;
}

export interface DecodeJWT {
  id: string;
  isLender: boolean;
  isBorrower: boolean;
  isSupport: boolean;
  iat: number;
  exp: number;
}
