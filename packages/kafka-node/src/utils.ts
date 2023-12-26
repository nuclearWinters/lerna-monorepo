import jsonwebtoken, { SignOptions } from "jsonwebtoken";
import {
  DecodeJWT,
  Context,
  UserCassandra,
  LoanCassandra,
  InvestmentCassandra,
  TransactionCassandra,
} from "./types";
import { Request } from "express";
import { Client, mapping } from "cassandra-driver";
import { Producer } from "kafkajs";

export const jwt = {
  decode: (token: string): string | DecodeJWT | null => {
    const decoded = jsonwebtoken.decode(token);
    return decoded as string | DecodeJWT | null;
  },
  verify: (token: string, password: string): DecodeJWT | undefined => {
    const decoded = jsonwebtoken.verify(token, password);
    return decoded as DecodeJWT | undefined;
  },
  sign: (
    data: {
      id: string;
      isBorrower: boolean;
      isLender: boolean;
      isSupport: boolean;
    },
    secret: string,
    options?: SignOptions
  ): string => {
    const token = jsonwebtoken.sign(data, secret, options);
    return token;
  },
};

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

export const base64 = (i: string): string => {
  return Buffer.from("arrayconnection:" + i, "utf8").toString("base64");
};

export const unbase64 = (i: string): string => {
  return Buffer.from(i, "base64").toString("utf8").split(":")[1];
};

export const base64Name = (i: string, name: string): string => {
  return Buffer.from(name + ":" + i, "utf8").toString("base64");
};
