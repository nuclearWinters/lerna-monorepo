import { GraphQLSchema, GraphQLObjectType, parse } from "graphql";
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
import { createSecureServer } from "http2";
import { Db } from "mongodb";
import { Producer } from "kafkajs";
import { createHandler } from "graphql-sse/lib/use/http2";
import fs from "fs";
import queryMap from "./queryMap.json";
import { AuthClient } from "@lerna-monorepo/grpc-auth-node";
import { RedisPubSub } from "graphql-redis-subscriptions";

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

const main = async (db: Db, producer: Producer, grpcClient: AuthClient, pubsub: RedisPubSub) => {
  if (producer) {
    await producer.connect();
  }
  const handler = createHandler({
    schema,
    context: async (request) => {
      const context = await getContextSSE(request, db, producer, grpcClient, pubsub);
      dataDrivenDependencies.reset();
      return context;
    },
    onSubscribe: async (request, params) => {
      const doc_id = params.extensions?.doc_id;
      const query = queryMap.find((query) => query[0] === doc_id);
      if (query) {
        return {
          schema,
          document: parse(query[1]),
          variableValues: params.variables,
          contextValue: await getContextSSE(request, db, producer, grpcClient, pubsub),
        };
      }
      return [null, { status: 404, statusText: "Not Found" }];
    },
    onOperation: (_ctx, _req, _args, result) => {
      return {
        ...result,
        extensions: {
          modules: dataDrivenDependencies.getModules(),
        },
      };
    },
  });
  const server = createSecureServer(
    {
      key: fs.readFileSync("../../certs/localhost.key"),
      cert: fs.readFileSync("../../certs/localhost.crt"),
    },
    async (req, res) => {
      try {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:8000");
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
      } catch (err) {
        res.writeHead(500).end();
      }
    }
  );
  return server;
};

export { main };
