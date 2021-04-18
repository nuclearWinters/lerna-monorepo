import express from "express";
import { graphqlHTTP } from "express-graphql";
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";
import cors from "cors";
import { Db } from "mongodb";
import { UserMongo, Context } from "./types";
import { CreateUserMutation } from "./CreateUserMutation";
import { GetTokenMutation } from "./GetTokenMutation";

const UserQuery = {
  type: GraphQLString,
  resolve: (): string => {
    return "test";
  },
};

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser: CreateUserMutation,
    getToken: GetTokenMutation,
  },
});

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    test: UserQuery,
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
  graphqlHTTP((req: any): {
    context: Context;
    schema: GraphQLSchema;
    graphiql: boolean;
  } => {
    const db = req.app.locals.db as Db;
    const users = db.collection<UserMongo>("users");
    return {
      schema: schema,
      graphiql: true,
      context: {
        users,
      },
    };
  })
);

export { app };
