import { Db } from "mongodb";
import {
  AuthUserLogins,
  AuthUserMongo,
  AuthUserSessions,
  FintechUserMongo,
  InvestmentMongo,
  LoanMongo,
  RecordsMongo,
  ScheduledPaymentsMongo,
  TransactionMongo,
} from "./types";

export const getFintechCollections = (db: Db) => {
  return {
    users: db.collection<FintechUserMongo>("users"),
    loans: db.collection<LoanMongo>("loans"),
    investments: db.collection<InvestmentMongo>("investments"),
    transactions: db.collection<TransactionMongo>("transactions"),
    scheduledPayments:
      db.collection<ScheduledPaymentsMongo>("scheduledPayments"),
    records: db.collection<RecordsMongo>("records"),
  };
};

export const getAuthCollections = (db: Db) => {
  return {
    authusers: db.collection<AuthUserMongo>("users"),
    logins: db.collection<AuthUserLogins>("logins"),
    sessions: db.collection<AuthUserSessions>("sessions"),
  };
};
