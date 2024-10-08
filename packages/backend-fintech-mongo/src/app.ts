import { GraphQLSchema, GraphQLObjectType } from "graphql";
import { QueryUser } from "./QueryUser";
import { dataDrivenDependencies, nodeField } from "./Nodes";
import { AddLendsMutation } from "./mutations/AddLends";
import { AddFundsMutation } from "./mutations/AddFunds";
import { AddLoanMutation } from "./mutations/AddLoan";
import { getContextSSE } from "./utils";
import {
  investments_subscribe_insert,
  loans_subscribe_insert,
  transactions_subscribe_insert,
  user_subscribe,
  investments_subscribe_update,
  loans_subscribe_update,
  my_loans_subscribe_insert,
} from "./subscriptions/subscriptions";
import { ApproveLoanMutation } from "./mutations/ApproveLoan";
import { QueryScheduledPayments } from "./QueryScheduledPayments";
import { createSecureServer } from "node:http2";
import { Db } from "mongodb";
import { Producer } from "kafkajs";
import fs from "node:fs";
import queryMap from "./queryMap.json";
import { AuthClient } from "@lerna-monorepo/backend-utilities/protoAuth/auth_grpc_pb";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { IS_PRODUCTION } from "@lerna-monorepo/backend-utilities/config";
import { createHandler } from "@lerna-monorepo/backend-utilities/index";

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
        } else if (req.url.startsWith("/graphql")) {
          await handler(req, res);
        }
      } catch {
        res.writeHead(500).end();
      }
    }
  );
  return server;
};

export { main };
