import { Db } from "mongodb";
import {
  UserMongo,
  LoanMongo,
  TransactionMongo,
  InvestmentMongo,
  ScheduledPaymentsMongo,
} from "./types";
import jsonwebtoken, { SignOptions } from "jsonwebtoken";
import { DecodeJWT } from "./types";
import { Producer } from "kafkajs";
import { parse } from "cookie";
import { Request } from "graphql-sse/lib";
import { Http2ServerRequest, Http2ServerResponse } from "http2";
import { AuthClient, jwtMiddleware } from "@lerna-monorepo/grpc-auth-node"
import { RedisPubSub } from "graphql-redis-subscriptions";

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
      refreshTokenExpireTime: number;
      exp: number;
    },
    secret: string,
    options?: SignOptions
  ): string => {
    const token = jsonwebtoken.sign(data, secret, options);
    return token;
  },
};

export const getContextSSE = async (
  req: Request<Http2ServerRequest, { res: Http2ServerResponse }>,
  db: Db,
  producer: Producer,
  grpcClient: AuthClient,
  pubsub: RedisPubSub
): Promise<Record<string, unknown>> => {
  const cookies = parse(req.headers.get("cookie") || "");
  const accessToken = req.headers.get("authorization") || "";
  const refreshToken = cookies.refreshToken || "";
  const { id, isLender, isBorrower, isSupport, validAccessToken } =
    await jwtMiddleware(refreshToken, accessToken, grpcClient);
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
    grpcClient,
    pubsub,
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
