import { UUID } from "@repo/utils/types";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { Producer } from "kafkajs";
import { ObjectId, Collection } from "mongodb";

export interface Context {
  users: Collection<UserMongo>;
  loans: Collection<LoanMongo>;
  investments: Collection<InvestmentMongo>;
  transactions: Collection<TransactionMongo>;
  scheduledPayments: Collection<ScheduledPaymentsMongo>;
  accessToken: string | undefined;
  refreshToken: string | undefined;
  id?: UUID;
  validAccessToken?: string;
  isBorrower: boolean;
  isSupport: boolean;
  isLender: boolean;
  logins?: unknown;
  authusers?: unknown;
  sessions?: unknown;
  producer: Producer;
  pubsub: RedisPubSub;
}

export interface UserMongo {
  account_available: number;
  account_to_be_paid: number;
  account_total: number;
  account_withheld: number;
  id: UUID;
}

export interface ILoanEdge {
  node: LoanMongoRedis;
  cursor: string;
}

export interface IInvestmentEdge {
  node: InvestmentMongoRedis;
  cursor: string;
}

export interface ITransactionEdge {
  node: TransactionMongo;
  cursor: string;
}

export type TransactionInvestMongoType = "collect" | "invest";

export type TransactionMongoType = "credit" | "withdrawal" | "payment";

export type TransactionMongo =
  | InvestmentTransactionMongo
  | MoneyTransactionMongo;

export interface InvestmentTransactionMongo {
  _id?: ObjectId;
  user_id: UUID;
  type: TransactionInvestMongoType;
  quantity: number;
  borrower_id: string;
  loan_oid: ObjectId;
  created_at: Date;
}

export interface MoneyTransactionMongo {
  _id?: ObjectId;
  user_id: UUID;
  type: TransactionMongoType;
  quantity: number;
  created_at: Date;
}

export type ILoanStatus =
  | "paid"
  | "to be paid"
  | "financing"
  | "waiting for approval"
  | "past due";

export type ScheduledPaymentsStatus = "paid" | "to be paid" | "delayed";

export interface ScheduledPaymentsMongo {
  _id?: ObjectId;
  loan_oid: ObjectId;
  amortize: number;
  status: ScheduledPaymentsStatus;
  scheduled_date: Date;
}

export interface IScheduledPaymentsMongoRedis {
  _id: string;
  loan_oid: string;
  amortize: number;
  status: ScheduledPaymentsStatus;
  scheduled_date: string;
}

export interface LoanMongo {
  _id?: ObjectId;
  user_id: UUID;
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

export interface LoanMongoRedis {
  _id: string;
  user_id: UUID;
  score: string;
  roi: number;
  goal: number;
  term: number;
  raised: number;
  expiry: string;
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

export interface InvestmentMongo {
  _id?: ObjectId;
  borrower_id: UUID;
  lender_id: UUID;
  loan_oid: ObjectId;
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

export interface InvestmentMongoRedis {
  _id: string;
  borrower_id: string;
  lender_id: string;
  loan_oid: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  status: IInvestmentStatus;
  roi: number;
  term: number;
  payments: number;
  moratory: number;
  amortize: number;
  interest_to_earn: number;
  paid_already: number;
  to_be_paid: number;
}
