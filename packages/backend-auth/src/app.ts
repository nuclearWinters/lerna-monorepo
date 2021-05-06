import express from "express";
import { graphqlHTTP } from "express-graphql";
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";
import cors from "cors";
import { SignUpMutation } from "./mutations/SignUpMutation";
import { SignInMutation } from "./mutations/SignInMutation";
import { BlacklistUserMutation } from "./mutations/BlacklistUserMutation";
import cookieParser from "cookie-parser";

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    signUp: SignUpMutation,
    signIn: SignInMutation,
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

app.use(
  cors({
    origin: "http://relay-gateway:4001",
  })
);
app.use(cookieParser());
app.use(express.json());

app.use(
  "/auth/graphql",
  graphqlHTTP((req) => {
    return {
      schema: schema,
      graphiql: true,
      context: {
        req,
      },
      extensions: ({ context }) => {
        const response = (context as any).newRefreshToken
          ? { newRefreshToken: (context as any).newRefreshToken }
          : {};
        return response;
      },
    };
  })
);

export { app };
