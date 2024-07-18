import { Db } from "mongodb";
import {
  UserMongo,
  LoanMongo,
  TransactionMongo,
  InvestmentMongo,
  ScheduledPaymentsMongo,
} from "./types";
import jsonwebtoken, { SignOptions } from "jsonwebtoken";
import { DecodeJWT, Context } from "./types";
import { Request as RequestExpress } from "express";
import { Producer } from "kafkajs";
import { parse } from "cookie";
import { Request } from "graphql-sse/lib";
import { Http2ServerRequest, Http2ServerResponse } from "http2";
import { AuthClient } from "./proto/auth_grpc_pb";
import { JWTMiddlewareInput } from "./proto/auth_pb";
import { credentials } from "@grpc/grpc-js";

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

export const getContext = async (req: RequestExpress): Promise<Context> => {
  const db = req.app.locals.db as Db;
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
    scheduledPayments:
      db.collection<ScheduledPaymentsMongo>("scheduledPayments"),
    accessToken,
    refreshToken,
    id,
    isBorrower,
    isLender,
    isSupport,
    producer,
  };
};

export const client = new AuthClient(
  `backend-auth-node:1983`,
  credentials.createInsecure()
);

export const jwtMiddleware = (refreshToken: string, accessToken: string) =>
  new Promise<{
    id: string;
    isLender: boolean;
    isBorrower: boolean;
    isSupport: boolean;
    validAccessToken: string;
  }>((resolve) => {
    const request = new JWTMiddlewareInput();
    request.setRefreshtoken(refreshToken);
    request.setAccesstoken(accessToken);

    client.jwtMiddleware(request, (err, user) => {
      if (err) {
        //Should I return error and unauthorized status code?
        resolve({
          id: "",
          isLender: false,
          isBorrower: false,
          isSupport: false,
          validAccessToken: "",
        });
      } else {
        const id = user.getId();
        const isLender = user.getIslender();
        const isBorrower = user.getIsborrower();
        const isSupport = user.getIssupport();
        const validAccessToken = user.getValidaccesstoken();
        resolve({
          id,
          isLender,
          isBorrower,
          isSupport,
          validAccessToken,
        });
      }
    });
  });

export const getContextSSE = async (
  req: Request<Http2ServerRequest, { res: Http2ServerResponse }>,
  db: Db,
  producer: Producer
): Promise<Record<string, unknown>> => {
  const cookies = parse(req.headers.get("cookie") || "");
  const accessToken = req.headers.get("authorization") || "";
  const refreshToken = cookies.refreshToken || "";
  const { id, isLender, isBorrower, isSupport, validAccessToken } =
    await jwtMiddleware(refreshToken, accessToken);
  if (validAccessToken) {
    req.context.res?.setHeader("accessToken", accessToken);
  }
  return {
    users: db.collection<UserMongo>("users"),
    loans: db.collection<LoanMongo>("loans"),
    investments: db.collection<InvestmentMongo>("investments"),
    transactions: db.collection<TransactionMongo>("transactions"),
    scheduledPayments:
      db.collection<ScheduledPaymentsMongo>("scheduledPayments"),
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
