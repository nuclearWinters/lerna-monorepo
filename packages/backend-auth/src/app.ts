import express from "express";
import { GraphQLSchema, GraphQLObjectType } from "graphql";
import cors from "cors";
import { SignUpMutation } from "./mutations/SignUpMutation";
import { SignInMutation } from "./mutations/SignInMutation";
import { BlacklistUserMutation } from "./mutations/BlacklistUserMutation";
import { getContext } from "./utils";
import { QueryUser } from "./AuthUserQuery";
import { UpdateUserMutation } from "./mutations/UpdateUser";
import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  shouldRenderGraphiQL,
} from "graphql-helix";
import cookieParser from "cookie-parser";
import { ExtendSessionMutation } from "./mutations/ExtendSessionMutation";

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    signUp: SignUpMutation,
    signIn: SignInMutation,
    blacklistUser: BlacklistUserMutation,
    updateUser: UpdateUserMutation,
    extendSession: ExtendSessionMutation,
  },
});

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    authUser: QueryUser,
  },
});

const schema = new GraphQLSchema({
  mutation: Mutation,
  query: Query,
});

const app = express();

app.use(cookieParser());

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://relay-gateway:4001",
      "http://0.0.0.0:4001",
      "http://localhost:8000",
    ],
  })
);

app.use("/graphql", async (req, res) => {
  const request = {
    body: req.body,
    headers: req.headers,
    method: req.method,
    query: req.query,
  };
  if (shouldRenderGraphiQL(request)) {
    res.send(renderGraphiQL());
  } else {
    const { operationName, query, variables } = getGraphQLParameters(request);
    const context = await getContext(req, res);
    const result = await processRequest({
      operationName,
      query,
      variables,
      request,
      schema,
      contextFactory: () => context,
    });
    if (result.type === "RESPONSE") {
      result.headers.forEach(({ name, value }) => res.setHeader(name, value));
      res.status(result.status);
      res.json(result.payload);
    }
  }
});

export { app };
