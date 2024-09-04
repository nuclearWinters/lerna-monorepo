import {
  Context,
  UserCassandra,
  LoanCassandra,
  InvestmentCassandra,
  TransactionCassandra,
} from "./types";
import { Request } from "express";
import { Client, mapping } from "cassandra-driver";
import { Producer } from "kafkajs";

export const getContext = async (req: Request): Promise<Context> => {
  const client = req.app.locals.client as Client;
  const producer = req.app.locals.producer as Producer;
  const users = req.app.locals.users as mapping.ModelMapper<UserCassandra>;
  const loans = req.app.locals.loans as mapping.ModelMapper<LoanCassandra>;
  const investments = req.app.locals
    .investments as mapping.ModelMapper<InvestmentCassandra>;
  const transactions = req.app.locals
    .transaction as mapping.ModelMapper<TransactionCassandra>;
  const accessToken = req.headers.authorization || "";
  const refreshToken = req.cookies?.refreshToken || "";
  const id = req.cookies?.id || "";
  const isBorrower = req.cookies?.isBorrower === "true";
  const isLender = req.cookies?.isLender === "true";
  const isSupport = req.cookies?.isSupport === "true";
  return {
    client,
    producer,
    users,
    loans,
    investments,
    transactions,
    accessToken,
    refreshToken,
    id,
    isBorrower,
    isLender,
    isSupport,
  };
};
