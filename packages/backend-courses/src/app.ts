import express from "express";
import { graphqlHTTP } from "express-graphql";
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import cors from "cors";
import { QueryUser } from "./QueryUser";
import {
  nodeField,
  GraphQLInvestmentEdge,
  GraphQLLoanEdge,
  GraphQLBucketTransactionEdge,
} from "./Nodes";
import { UpdateUserMutation } from "./mutations/UpdateUser";
import { AddLendsMutation } from "./mutations/AddLends";
import { AddFundsMutation } from "./mutations/AddFunds";
import { QueryLoans } from "./QueryLoans";
import { AddLoanMutation } from "./mutations/AddLoan";
import { QueryInvestments } from "./QueryInvestments";
import { QueryTransactions } from "./QueryTransactions";
import { PubSub, withFilter } from "graphql-subscriptions";
//import { ObjectID } from "mongodb";

export const pubsub = new PubSub();

export const LOAN = "LOAN";
export const TRANSACTION = "TRANSACTION";
export const INVESTMENT = "INVESTMENT";

/*setInterval(() => {
  pubsub.publish(LOAN, {
    loans: {
      node: {
        _id: new ObjectID(),
        _id_user: new ObjectID(),
        score: "AAA",
        ROI: 17,
        goal: 10000,
        term: 6,
        raised: 2000,
        expiry: new Date(),
      },
      cursor: new Date().toUTCString(),
    },
  });
}, 3000);*/

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    user: QueryUser,
    node: nodeField,
    loans: QueryLoans,
    investments: QueryInvestments,
    transactions: QueryTransactions,
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    updateUser: UpdateUserMutation,
    addLends: AddLendsMutation,
    addFunds: AddFundsMutation,
    addLoan: AddLoanMutation,
  },
});

export const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
  subscription: new GraphQLObjectType({
    name: "Subscription",
    description: "Subscribe to data event streams",
    fields: () => ({
      loans: {
        type: GraphQLLoanEdge,
        description: "New or updated loans",
        subscribe: () => pubsub.asyncIterator(LOAN),
      },
      transactions: {
        type: new GraphQLNonNull(GraphQLBucketTransactionEdge),
        args: {
          user_id: { type: new GraphQLNonNull(GraphQLString) },
        },
        description: "New or updated transactions",
        subscribe: withFilter(
          () => pubsub.asyncIterator(TRANSACTION),
          (payload, variables) => {
            return payload.somethingChanged.id === variables.relevantId;
          }
        ),
      },
      investments: {
        type: new GraphQLNonNull(GraphQLInvestmentEdge),
        args: {
          user_id: { type: new GraphQLNonNull(GraphQLString) },
        },
        description: "New or updated investment",
        subscribe: withFilter(
          () => pubsub.asyncIterator(INVESTMENT),
          (payload, variables) => {
            return payload.somethingChanged.id === variables.relevantId;
          }
        ),
      },
    }),
  }),
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
      subscriptionEndpoint: "ws://localhost/api/graphql",
      graphiql: {
        subscriptionEndpoint: `ws://localhost/api/graphql`,
      } as any,
      context: {
        req,
      },
    };
  })
);

export { app };
