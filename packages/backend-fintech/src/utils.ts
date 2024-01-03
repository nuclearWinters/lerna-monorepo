import { Db } from "mongodb";
import {
  UserMongo,
  LoanMongo,
  TransactionMongo,
  InvestmentMongo,
} from "./types";
import jsonwebtoken, { SignOptions } from "jsonwebtoken";
import { DecodeJWT, Context } from "./types";
import { Request } from "express";
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
  const db = req.app.locals.db as Db;
  const authdb = req.app.locals.authdb as Db;
  const producer = req.app.locals.producer as Producer;
  const accessToken = req.headers.authorization || "";
  const refreshToken = req.cookies?.refreshToken || "";
  const id = req.cookies?.id || "";
  const isBorrower = req.cookies?.isBorrower === "true";
  const isLender = req.cookies?.isLender === "true";
  const isSupport = req.cookies?.isSupport === "true";
  return {
    users: db.collection<UserMongo>("users"),
    loans: db.collection<LoanMongo>("loans"),
    investments: db.collection<InvestmentMongo>("investments"),
    transactions: db.collection<TransactionMongo>("transactions"),
    logins: authdb?.collection("logins"),
    authusers: authdb?.collection("users"),
    sessions: authdb?.collection("sessions"),
    accessToken,
    refreshToken,
    id,
    isBorrower,
    isLender,
    isSupport,
    producer,
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
