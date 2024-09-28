import { GraphQLSchema, GraphQLObjectType, parse } from "graphql";
import { SignUpMutation } from "./mutations/SignUpMutation.js";
import { SignInMutation } from "./mutations/SignInMutation.js";
import { getContextSSE } from "./utils.js";
import { QueryUser, nodeField } from "./AuthUserQuery.js";
import { UpdateUserMutation } from "./mutations/UpdateUserMutation.js";
import { ExtendSessionMutation } from "./mutations/ExtendSessionMutation.js";
import { LogOutMutation } from "./mutations/LogOutMutation.js";
import { RevokeSessionMutation } from "./mutations/RevokeSessionMutation.js";
import { createSecureServer } from "http2";
import { createHandler } from "graphql-sse/lib/use/http2";
import { Db } from "mongodb";
import fs from "fs";
import * as queryMap from "./queryMapAuth.json" with { type: "json" };
import { RedisClientType } from "@lerna-monorepo/backend-utilities/types";
import { AccountClient } from "@lerna-monorepo/backend-utilities/protoAccount/account_grpc_pb";
import { NODE_ENV } from "@lerna-monorepo/backend-utilities/config";

const isProduction = NODE_ENV === "production";

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

const main = async (
  db: Db,
  rdb: RedisClientType,
  grpcClient: AccountClient
) => {
  const handler = createHandler({
    schema,
    context: async (request) => {
      return await getContextSSE(request, db, rdb, grpcClient);
    },
    onSubscribe: async (request, params) => {
      const doc_id = params.extensions?.doc_id;
      const query = queryMap.default.find((query) => query[0] === doc_id);
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
      key: isProduction
        ? fs.readFileSync(
            "/etc/letsencrypt/live/auth.relay-graphql-monorepo.com/privkey.pem"
          )
        : fs.readFileSync("../../certs/key.pem"),
      cert: isProduction
        ? fs.readFileSync(
            "/etc/letsencrypt/live/auth.relay-graphql-monorepo.com/fullchain.pem"
          )
        : fs.readFileSync("../../certs/cert.pem"),
    },
    async (req, res) => {
      try {
        const origins = isProduction
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
        } else if (req?.url?.startsWith("/graphql")) {
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
