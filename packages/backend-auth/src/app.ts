import express from "express";
import { graphqlHTTP } from "express-graphql";
import { GraphQLSchema, GraphQLObjectType } from "graphql";
import cors from "cors";
import { SignUpMutation } from "./mutations/SignUpMutation";
import { SignInMutation } from "./mutations/SignInMutation";
import { BlacklistUserMutation } from "./mutations/BlacklistUserMutation";
import { getContext } from "./utils";
import { QueryUser } from "./AuthUserQuery";
import { UpdateUserMutation } from "./mutations/UpdateUser";

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    signUp: SignUpMutation,
    signIn: SignInMutation,
    blacklistUser: BlacklistUserMutation,
    updateUser: UpdateUserMutation,
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

app.use(
  cors({
    origin: "http://relay-gateway:4001",
  })
);

app.use(
  "/auth/graphql",
  graphqlHTTP((req) => {
    return {
      schema: schema,
      graphiql: true,
      context: getContext(req),
    };
  })
);

export { app };
