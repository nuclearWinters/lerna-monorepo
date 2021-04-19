import express from "express";
import { graphqlHTTP } from "express-graphql";
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";
import cors from "cors";
import { CreateUserMutation } from "./mutations/CreateUserMutation";
import { GetTokenMutation } from "./mutations/GetTokenMutation";
import { RenewAccessTokenMutation } from "./mutations/RenewAccessTokenMutation";
import { BlacklistUserMutation } from "./mutations/BlacklistUserMutation";

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser: CreateUserMutation,
    getToken: GetTokenMutation,
    renewAccessToken: RenewAccessTokenMutation,
    blacklistUser: BlacklistUserMutation,
  },
});

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    test: {
      type: GraphQLString,
      resolve: (): string => {
        return "test";
      },
    },
  },
});

const schema = new GraphQLSchema({
  mutation: Mutation,
  query: Query,
});

const app = express();

app.use(cors());

app.use(
  "/auth/graphql",
  graphqlHTTP((req) => {
    return {
      schema: schema,
      graphiql: true,
      context: {
        req,
      },
    };
  })
);

export { app };
