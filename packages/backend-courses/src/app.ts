import express from "express";
import { graphqlHTTP } from "express-graphql";
import { GraphQLSchema, GraphQLObjectType } from "graphql";
import cors from "cors";
import { QueryUser } from "./QueryUser";
import { nodeField } from "./Nodes";
import { UpdateUserMutation } from "./mutations/UpdateUser";

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    user: QueryUser,
    node: nodeField,
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    updateUser: UpdateUserMutation,
  },
});

const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});

const app = express();

app.use(
  cors({
    origin: "http://relay-gateway:4001",
  })
);

app.use(
  "/api/graphql",
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
