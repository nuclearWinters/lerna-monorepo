import type { Http2ServerRequest, Http2ServerResponse } from "node:http2";
import { jwtMiddleware } from "@repo/grpc-utils";
import type { AuthClient } from "@repo/grpc-utils/protoAuth/auth_grpc_pb";
import type { FintechUserMongo, InvestmentMongo, LoanMongo, RecordsMongo, ScheduledPaymentsMongo, TransactionMongo } from "@repo/mongo-utils";
import { parse } from "cookie";
import type { RedisPubSub } from "graphql-redis-subscriptions";
import type { Producer } from "kafkajs";
import type { Db } from "mongodb";
import type { Context } from "./types.ts";

export const getContextSSE = async (
  req: Http2ServerRequest,
  res: Http2ServerResponse,
  db: Db,
  producer: Producer,
  grpcClient: AuthClient,
  pubsub: RedisPubSub,
): Promise<Record<string, unknown>> => {
  const cookies = parse(req.headers.cookie || "");
  const accessToken = req.headers.authorization || "";
  const refreshToken = cookies.refreshToken || "";
  const { id, isLender, isBorrower, isSupport, validAccessToken } = await jwtMiddleware(refreshToken, accessToken, grpcClient);
  if (validAccessToken) {
    res.setHeader("accessToken", validAccessToken);
  }
  const context: Context = {
    users: db.collection<FintechUserMongo>("users"),
    loans: db.collection<LoanMongo>("loans"),
    investments: db.collection<InvestmentMongo>("investments"),
    transactions: db.collection<TransactionMongo>("transactions"),
    scheduledPayments: db.collection<ScheduledPaymentsMongo>("scheduledPayments"),
    records: db.collection<RecordsMongo>("records"),
    accessToken,
    refreshToken,
    id,
    isBorrower,
    isLender,
    isSupport,
    producer,
    pubsub,
  };
  return context as unknown as Record<string, unknown>;
};
