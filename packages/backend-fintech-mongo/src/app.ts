import fs from "node:fs";
import { createSecureServer } from "node:http2";
import { createHandler } from "@repo/graphql-utils";
import type { AuthClient } from "@repo/grpc-utils/protoAuth/auth_grpc_pb";
import { logErr } from "@repo/logs-utils";
import { IS_PRODUCTION } from "@repo/utils";
import { GraphQLObjectType, GraphQLSchema } from "graphql";
import type { RedisPubSub } from "graphql-redis-subscriptions";
import type { Producer } from "kafkajs";
import type { Db } from "mongodb";
import { dataDrivenDependencies, nodeField } from "./Nodes.ts";
import { QueryScheduledPayments } from "./QueryScheduledPayments.ts";
import { QueryUser } from "./QueryUser.ts";
import { AddFundsMutation } from "./mutations/AddFunds.ts";
import { AddLendsMutation } from "./mutations/AddLends.ts";
import { AddLoanMutation } from "./mutations/AddLoan.ts";
import { ApproveLoanMutation } from "./mutations/ApproveLoan.ts";
import queryMap from "./queryMap.json" with { type: "json" };
import {
  investments_subscribe_insert,
  investments_subscribe_update,
  loans_subscribe_insert,
  loans_subscribe_update,
  my_loans_subscribe_insert,
  transactions_subscribe_insert,
  user_subscribe,
} from "./subscriptions/subscriptions.ts";
import { getContextSSE } from "./utils.ts";

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    user: QueryUser,
    node: nodeField,
    scheduledPaymentsbyLoanId: QueryScheduledPayments,
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addLends: AddLendsMutation,
    addFunds: AddFundsMutation,
    addLoan: AddLoanMutation,
    approveLoan: ApproveLoanMutation,
  },
});

const Subscription = new GraphQLObjectType({
  name: "Subscription",
  description: "Subscribe to data event streams",
  fields: {
    loans_subscribe_insert,
  },
});

export const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
  subscription: Subscription,
});

const main = async (db: Db, producer: Producer, grpcClient: AuthClient, pubsub: RedisPubSub) => {
  if (producer) {
    await producer.connect();
  }
  const handler = createHandler({
    schema,
    context: async (req, res) => {
      const context = await getContextSSE(req, res, db, producer, grpcClient, pubsub);
      dataDrivenDependencies.reset();
      return context;
    },
    queryMap,
    dataDrivenDependencies: dataDrivenDependencies,
  });
  const server = createSecureServer(
    {
      key: fs.readFileSync(IS_PRODUCTION ? "/etc/letsencrypt/live/fintech.relay-graphql-monorepo.com/privkey.pem" : "../../certs/key.pem"),
      cert: fs.readFileSync(IS_PRODUCTION ? "/etc/letsencrypt/live/fintech.relay-graphql-monorepo.com/fullchain.pem" : "../../certs/cert.pem"),
    },
    async (req, res) => {
      try {
        const origins = IS_PRODUCTION ? ["https://relay-graphql-monorepo.com"] : ["http://localhost:8000", "http://localhost:5173"];
        const origin = req.headers.origin;
        if (origin && origins.includes(origin)) {
          res.setHeader("Access-Control-Allow-Origin", origin);
        }
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.setHeader("Access-Control-Expose-Headers", "Accesstoken");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        const isOptions = req.method === "OPTIONS";
        if (isOptions) {
          return res.writeHead(200).end();
        }
        if (req?.url?.startsWith("/graphql") && req.method === "POST") {
          return await handler(req, res);
        }
        return res.writeHead(200).end();
      } catch (err) {
        if (err instanceof Error) {
          logErr({
            logGroupName: "backend-fintech-mongo",
            logStreamName: "requestError",
            message: `Name: ${err.name}, Message: ${err.message}, Stack: ${err.stack}`,
          });
        } else {
          logErr({
            logGroupName: "backend-fintech-mongo",
            logStreamName: "requestError",
            message: "Message: Unknown error",
          });
        }
        res.writeHead(500).end();
      }
    },
  );
  return server;
};

export { main };
