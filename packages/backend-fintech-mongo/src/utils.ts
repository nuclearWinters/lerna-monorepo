import { Db } from "mongodb";
import {
  UserMongo,
  LoanMongo,
  TransactionMongo,
  InvestmentMongo,
  ScheduledPaymentsMongo,
} from "./types.js";
import { Producer } from "kafkajs";
import { parse } from "cookie";
import { Http2ServerRequest, Http2ServerResponse } from "http2";
import { jwtMiddleware } from "@lerna-monorepo/backend-utilities/grpc";
import type { AuthClient } from "@lerna-monorepo/backend-utilities/protoAuth/auth_grpc_pb";
import { RedisPubSub } from "graphql-redis-subscriptions";

export const getContextSSE = async (
  req: Http2ServerRequest,
  res: Http2ServerResponse,
  db: Db,
  producer: Producer,
  grpcClient: AuthClient,
  pubsub: RedisPubSub
): Promise<Record<string, unknown>> => {
  const cookies = parse(req.headers.cookie || "");
  const accessToken = req.headers.authorization || "";
  const refreshToken = cookies.refreshToken || "";
  const { id, isLender, isBorrower, isSupport, validAccessToken } =
    await jwtMiddleware(refreshToken, accessToken, grpcClient);
  if (validAccessToken) {
    res.setHeader("accessToken", validAccessToken);
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
