import { Db } from "mongodb";
import {
  UserMongo,
  LoanMongo,
  TransactionMongo,
  InvestmentMongo,
} from "./types";
import jsonwebtoken, { SignOptions } from "jsonwebtoken";
import { DecodeJWT, Context } from "./types";
import { Request, Response } from "express";

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

export const getContext = async (
  req: Request,
  res: Response
): Promise<Context> => {
  const db = req.app.locals.db as Db;
  const ch = req.app.locals.ch;
  const accessToken = req.headers.authorization || "";
  const refreshToken = req.cookies?.refreshToken || "";
  const { id, validAccessToken, isBorrower, isLender, isSupport } =
    await refreshTokenMiddleware(accessToken, refreshToken);
  res?.setHeader("accessToken", validAccessToken || "");
  return {
    users: db.collection<UserMongo>("users"),
    loans: db.collection<LoanMongo>("loans"),
    investments: db.collection<InvestmentMongo>("investments"),
    transactions: db.collection<TransactionMongo>("transactions"),
    accessToken,
    refreshToken,
    ch,
    id,
    validAccessToken,
    isBorrower,
    isLender,
    isSupport,
  };
};

interface IResolve {
  validAccessToken?: string;
  id?: string;
  isLender: boolean;
  isBorrower: boolean;
  isSupport: boolean;
}

export const refreshTokenMiddleware = async (
  accessToken: string | undefined,
  refreshToken: string | undefined
): Promise<IResolve> => {
  if (!accessToken || !refreshToken) {
    return {
      validAccessToken: undefined,
      id: undefined,
      isLender: false,
      isBorrower: false,
      isSupport: false,
    };
  }
  try {
    const user = jwt.decode(accessToken);
    if (!user || typeof user === "string") {
      throw new Error("El token esta corrompido.");
    }
    const { id, isLender, isBorrower, isSupport } = user;
    return {
      validAccessToken: accessToken,
      id,
      isLender,
      isBorrower,
      isSupport,
    };
  } catch (e) {
    return {
      validAccessToken: undefined,
      id: undefined,
      isLender: false,
      isBorrower: false,
      isSupport: false,
    };
  }
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
