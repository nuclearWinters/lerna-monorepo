import { GraphQLSchema, GraphQLObjectType } from "graphql";
import { QueryUser } from "./QueryUser.ts";
import { dataDrivenDependencies, nodeField } from "./Nodes.ts";
import { AddLendsMutation } from "./mutations/AddLends.ts";
import { AddFundsMutation } from "./mutations/AddFunds.ts";
import { AddLoanMutation } from "./mutations/AddLoan.ts";
import { getContextSSE } from "./utils.ts";
import {
  investments_subscribe_insert,
  loans_subscribe_insert,
  transactions_subscribe_insert,
  user_subscribe,
  investments_subscribe_update,
  loans_subscribe_update,
  my_loans_subscribe_insert,
} from "./subscriptions/subscriptions.ts";
import { ApproveLoanMutation } from "./mutations/ApproveLoan.ts";
import { QueryScheduledPayments } from "./QueryScheduledPayments.ts";
import { createSecureServer } from "node:http2";
import { Db } from "mongodb";
import type { Producer } from "kafkajs";
import fs from "node:fs";
import queryMap from "./queryMap.json" with { type: "json" };
import { AuthClient } from "@repo/grpc-utils/protoAuth/auth_grpc_pb";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { IS_PRODUCTION } from "@repo/utils";
import { createHandler } from "@repo/graphql-utils";

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
  fields: () => ({
    loans_subscribe_insert,
    transactions_subscribe_insert,
    investments_subscribe_insert,
    user_subscribe,
    investments_subscribe_update,
    loans_subscribe_update,
    my_loans_subscribe_insert,
  }),
});

export const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
  subscription: Subscription,
});

const main = async (
  db: Db,
  producer: Producer,
  grpcClient: AuthClient,
  pubsub: RedisPubSub
) => {
  if (producer) {
    await producer.connect();
  }
  const handler = createHandler({
    schema,
    context: async (req, res) => {
      const context = await getContextSSE(
        req,
        res,
        db,
        producer,
        grpcClient,
        pubsub
      );
      dataDrivenDependencies.reset();
      return context;
    },
    queryMap,
    dataDrivenDependencies: dataDrivenDependencies,
  });
  const server = createSecureServer(
    {
      key: fs.readFileSync(
        IS_PRODUCTION
          ? "/etc/letsencrypt/live/fintech.relay-graphql-monorepo.com/privkey.pem"
          : "../../certs/key.pem"
      ),
      cert: fs.readFileSync(
        IS_PRODUCTION
          ? "/etc/letsencrypt/live/fintech.relay-graphql-monorepo.com/fullchain.pem"
          : "../../certs/cert.pem"
      ),
    },
    async (req, res) => {
      req.on("error", (err) => {
        const now = new Date().toISOString();
        fs.writeFileSync(
          `requestError${now}.txt`,
          `Time: ${now}, Message: ${err.message}, Stack: ${err.stack}`
        );
      });
      res.on("error", (err) => {
        const now = new Date().toISOString();
        fs.writeFileSync(
          `responseError${now}.txt`,
          `Time: ${now}, Message: ${err.message}, Stack: ${err.stack}`
        );
      });
      try {
        const origins = IS_PRODUCTION
          ? ["https://relay-graphql-monorepo.com"]
          : ["http://localhost:8000", "http://localhost:5173"];
        const origin = req.headers.origin;
        if (origin && origins.includes(origin)) {
          res.setHeader("Access-Control-Allow-Origin", origin);
        }
        res.setHeader(
          "Access-Control-Allow-Methods",
          "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        );
        res.setHeader(
          "Access-Control-Allow-Headers",
          "Content-Type, Authorization"
        );
        res.setHeader("Access-Control-Expose-Headers", "Accesstoken");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        const isOptions = req.method === "OPTIONS";
        if (isOptions) {
          return res.writeHead(200).end();
        } else if (req?.url?.startsWith("/graphql") && req.method === "POST") {
          await handler(req, res);
        } else {
          res.writeHead(200).end();
        }
      } catch (err) {
        console.log("err:", err);
        const now = new Date().toISOString();
        if (err instanceof Error) {
          fs.writeFileSync(
            `serverError${now}.txt`,
            `Time: ${now}, Name: ${err.name}, Message: ${err.message}, Stack: ${err.stack}`
          );
        } else {
          fs.writeFileSync(`errorUnknown${now}.txt`, `Time: ${now}`);
        }
        res.writeHead(500).end();
      }
    }
  );
  server.on("error", (err) => {
    const now = new Date().toISOString();
    fs.writeFileSync(
      `serverError${now}.txt`,
      `Time: ${now}, Message: ${err.message}, Stack: ${err.stack}`
    );
  });
  return server;
};

export { main };
