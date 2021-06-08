import express from "express";
import { graphqlHTTP } from "express-graphql";
import { GraphQLSchema, GraphQLObjectType } from "graphql";
import cors from "cors";
import { QueryUser } from "./QueryUser";
import { nodeField } from "./Nodes";
import { UpdateUserMutation } from "./mutations/UpdateUser";
import { AddLendsMutation } from "./mutations/AddLends";
import { AddFundsMutation } from "./mutations/AddFunds";
import { QueryLoans } from "./QueryLoans";
import { AddLoanMutation } from "./mutations/AddLoan";
import { QueryInvestments } from "./QueryInvestments";
import { QueryTransactions } from "./QueryTransactions";
import { getContext } from "./utils";
import {
  investments_subscribe,
  loans_subscribe,
  transactions_subscribe,
  user_subscribe,
} from "./subscriptions/subscriptions";
import { ApproveLoanMutation } from "./mutations/ApproveLoan";

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
    approveLoan: ApproveLoanMutation,
  },
});

const Subscription = new GraphQLObjectType({
  name: "Subscription",
  description: "Subscribe to data event streams",
  fields: () => ({
    loans_subscribe,
    transactions_subscribe,
    investments_subscribe,
    user_subscribe,
  }),
});

export const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
  subscription: Subscription,
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
      context: getContext(req),
    };
  })
);

export { app };
