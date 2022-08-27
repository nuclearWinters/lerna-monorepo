import { Channel } from "amqplib";
import { ObjectId, Collection } from "mongodb";

export interface Context {
  users: Collection<UserMongo>;
  loans: Collection<LoanMongo>;
  investments: Collection<InvestmentMongo>;
  transactions: Collection<TransactionMongo>;
  accessToken: string | undefined;
  refreshToken: string | undefined;
  ch: Channel;
  id?: string;
  validAccessToken?: string;
  isBorrower: boolean;
  isSupport: boolean;
  isLender: boolean;
}

export interface UserMongo {
  _id?: ObjectId;
  accountAvailable: number;
  accountToBePaid: number;
  accountTotal: number;
  id: string;
}

export interface ILoanEdge {
  node: LoanMongo;
  cursor: string;
}

export interface IInvestmentEdge {
  node: InvestmentMongo;
  cursor: string;
}

export interface ITransactionEdge {
  node: TransactionMongo;
  cursor: string;
}

export type TransactionMongoType =
  | "credit"
  | "withdrawal"
  | "invest"
  | "payment"
  | "collect";

export interface TransactionMongo {
  _id?: ObjectId;
  id_user: string;
  type: TransactionMongoType;
  quantity: number;
  id_borrower?: string;
  _id_loan?: ObjectId;
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

export interface LoanMongo {
  _id?: ObjectId;
  id_user: string;
  score: string;
  ROI: number;
  goal: number;
  term: number;
  raised: number;
  expiry: Date;
  status: ILoanStatus;
  scheduledPayments: IScheduledPayments[] | null;
  pending: number;
}

export type IInvestmentStatus =
  | "delay payment"
  | "up to date"
  | "financing"
  | "past due"
  | "paid";

export interface InvestmentMongo {
  _id?: ObjectId;
  id_borrower: string;
  id_lender: string;
  _id_loan: ObjectId;
  quantity: number;
  created: Date;
  updated: Date;
  status: IInvestmentStatus;
  ROI: number;
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

export const SIGN_UP = "SIGN_UP";

export const INITIAL_TRANSACTION_RECEIVE_FUND =
  "INITIAL_TRANSACTION_RECEIVE_FUND";
