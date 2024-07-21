import { GraphQLSchema, GraphQLObjectType, parse } from "graphql";
import { SignUpMutation } from "./mutations/SignUpMutation";
import { SignInMutation } from "./mutations/SignInMutation";
import { getContextSSE } from "./utils";
import { QueryUser, nodeField } from "./AuthUserQuery";
import { UpdateUserMutation } from "./mutations/UpdateUserMutation";
import { ExtendSessionMutation } from "./mutations/ExtendSessionMutation";
import { LogOutMutation } from "./mutations/LogOutMutation";
import { RevokeSessionMutation } from "./mutations/RevokeSessionMutation";
import { createSecureServer } from "http2";
import { createHandler } from "graphql-sse/lib/use/http2";
import { RedisClientType } from "./types";
import { Db } from "mongodb";
import fs from "fs";
import queryMap from "./queryMapAuth.json";
import { AccountClient } from "@lerna-monorepo/grpc-fintech-node";

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    signUp: SignUpMutation,
    signIn: SignInMutation,
    updateUser: UpdateUserMutation,
    extendSession: ExtendSessionMutation,
    logOut: LogOutMutation,
    revokeSession: RevokeSessionMutation,
  },
});

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    authUser: QueryUser,
    node: nodeField,
  },
});

export const schema = new GraphQLSchema({
  mutation: Mutation,
  query: Query,
});

const main = async (db: Db, rdb: RedisClientType, grpcClient: AccountClient) => {
  const handler = createHandler({
    schema,
    context: async (request) => {
      return await getContextSSE(request, db, rdb, grpcClient);
    },
    onSubscribe: async (request, params) => {
      const doc_id = params.extensions?.doc_id;
      const query = queryMap.find((query) => query[0] === doc_id);
      if (query) {
        return {
          schema,
          document: parse(query[1]),
          variableValues: params.variables,
          contextValue: await getContextSSE(request, db, rdb, grpcClient),
        };
      }
      return [null, { status: 404, statusText: "Not Found" }];
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
        } else if (req?.url?.startsWith("/graphql")) {
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
