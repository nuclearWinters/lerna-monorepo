import { GraphQLSchema, GraphQLObjectType } from "graphql";
import { SignUpMutation } from "./mutations/SignUpMutation";
import { SignInMutation } from "./mutations/SignInMutation";
import { getContextSSE } from "./utils";
import { QueryUser, nodeField } from "./AuthUserQuery";
import { UpdateUserMutation } from "./mutations/UpdateUserMutation";
import { ExtendSessionMutation } from "./mutations/ExtendSessionMutation";
import { LogOutMutation } from "./mutations/LogOutMutation";
import { RevokeSessionMutation } from "./mutations/RevokeSessionMutation";
import { createSecureServer } from "node:http2";
import { Db } from "mongodb";
import fs from "node:fs";
import queryMap from "./queryMapAuth.json";
import { RedisClientType } from "@lerna-monorepo/backend-utilities/types";
import { AccountClient } from "@lerna-monorepo/backend-utilities/protoAccount/account_grpc_pb";
import { IS_PRODUCTION } from "@lerna-monorepo/backend-utilities/config";
import { createHandler } from "@lerna-monorepo/backend-utilities/index";

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
    context: async (req, res) => {
      return await getContextSSE(req, res, db, rdb, grpcClient);
    },
    queryMap,
  });
  const server = createSecureServer(
    {
      key: fs.readFileSync(
        IS_PRODUCTION
          ? "/etc/letsencrypt/live/auth.relay-graphql-monorepo.com/privkey.pem"
          : "../../certs/key.pem"
      ),
      cert: fs.readFileSync(
        IS_PRODUCTION
          ? "/etc/letsencrypt/live/auth.relay-graphql-monorepo.com/fullchain.pem"
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
        } else if (req?.url?.startsWith("/graphql") && req.method === "POST") {
          await handler(req, res);
        } else {
          res.writeHead(200).end();
        }
      } catch {
        res.writeHead(500).end();
      }
    }
  );
  return server;
};

export { main };
