import { Channel } from "amqplib";
import { ObjectId, Collection } from "mongodb";

export interface Context {
  users: Collection<UserMongo>;
  loans: Collection<LoanMongo>;
  investments: Collection<InvestmentMongo>;
  transactions: Collection<BucketTransactionMongo>;
  accessToken: string | undefined;
  refreshToken: string | undefined;
  ch: Channel;
}

export interface InvestmentsUserMongo {
  _id_loan: ObjectId;
  quantity: number;
  term: number;
  ROI: number;
  payments: number;
}

export interface UserMongo {
  _id: ObjectId;
  accountAvailable: number;
  investments: InvestmentsUserMongo[];
}

export type TransactionMongoType =
  | "credit"
  | "withdrawal"
  | "invest"
  | "payment"
  | "collect";

export interface TransactionMongo {
  _id: ObjectId;
  type: TransactionMongoType;
  quantity: number;
  _id_borrower?: ObjectId;
  _id_loan?: ObjectId;
  created: Date;
}

export interface BucketTransactionMongo {
  _id: string;
  _id_user: ObjectId;
  count: number;
  history: TransactionMongo[];
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

export interface ILoanInvestors {
  _id_lender: ObjectId;
  quantity: number;
}

export interface LoanMongo {
  _id: ObjectId;
  _id_user: ObjectId;
  score: string;
  ROI: number;
  goal: number;
  term: number;
  raised: number;
  expiry: Date;
  status: ILoanStatus;
  scheduledPayments: IScheduledPayments[] | null;
  investors: ILoanInvestors[];
}

export type IInvestmentStatus =
  | "delay payment"
  | "up to date"
  | "financing"
  | "past due"
  | "paid";

export interface InvestmentMongo {
  _id: ObjectId;
  _id_borrower: ObjectId;
  _id_lender: ObjectId;
  _id_loan: ObjectId;
  quantity: number;
  created: Date;
  updated: Date;
  status: IInvestmentStatus;
  ROI: number;
  term: number;
  payments: number;
  moratory: number;
}

export interface DecodeJWT {
  _id: string;
  email: string;
  password: string;
}

export const SIGN_UP = "SIGN_UP";

interface ISignUp {
  queue: typeof SIGN_UP;
  payload: string;
}

export type IMQ = ISignUp;
