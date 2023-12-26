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
  id_user: string;
  type: TransactionInvestCassandraType;
  quantity: number;
  id_borrower: string;
  id_loan: string;
  created: Date;
}

export interface MoneyTransactionCassandra {
  id: string;
  id_user: string;
  type: TransactionCassandraType;
  quantity: number;
  created: Date;
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
  id_user: string;
  score: string;
  roi: number;
  goal: number;
  term: number;
  raised: number;
  expiry: Date;
  status: ILoanStatus;
  pending: number;
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
  id_borrower: string;
  id_lender: string;
  id_loan: string;
  quantity: number;
  created: Date;
  updated: Date;
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
