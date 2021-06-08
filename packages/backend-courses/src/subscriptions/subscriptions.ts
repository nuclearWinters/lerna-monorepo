import {
  GraphQLEnumType,
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";
import { PubSub, withFilter } from "graphql-subscriptions";
import {
  GraphQLBucketTransactionEdge,
  GraphQLInvestmentEdge,
  GraphQLLoanEdge,
  GraphQLUser,
} from "../Nodes";
import {
  Context,
  InvestmentMongo,
  LoanMongo,
  BucketTransactionMongo,
  UserMongo,
} from "../types";
import { unbase64 } from "../utils";

export const pubsub = new PubSub();

export const LOAN = "LOAN";
export const TRANSACTION = "TRANSACTION";
export const INVESTMENT = "INVESTMENT";
export const USER = "USER";

type typeSubscribe = "update" | "insert";

interface IUserSubscribe {
  user: UserMongo;
  type: typeSubscribe;
}

interface ILoanSubscribe {
  loan_edge: { node: LoanMongo; cursor: string };
  type: typeSubscribe;
}

interface ITransactionSubscribe {
  transaction_edge: { node: BucketTransactionMongo; cursor: string };
  type: typeSubscribe;
}

interface IInvestmentSubscribe {
  investment_edge: { node: InvestmentMongo; cursor: string };
  type: typeSubscribe;
}

export const SubscribeType = new GraphQLEnumType({
  name: "SubscribeType",
  values: {
    UPDATE: { value: "update" },
    INSERT: { value: "insert" },
  },
});

export const User_Subscribe = new GraphQLObjectType<IUserSubscribe, Context>({
  name: "User_Subscribe",
  fields: () => ({
    user: {
      type: new GraphQLNonNull(GraphQLUser),
      resolve: ({ user }) => user,
    },
  }),
});

export const Loan_Subscribe = new GraphQLObjectType<ILoanSubscribe, Context>({
  name: "Loan_Subscribe",
  fields: () => ({
    loan_edge: {
      type: new GraphQLNonNull(GraphQLLoanEdge),
      resolve: ({ loan_edge }) => loan_edge,
    },
    type: {
      type: new GraphQLNonNull(SubscribeType),
      resolve: ({ type }) => type,
    },
  }),
});

export const Transaction_Subscribe = new GraphQLObjectType<
  ITransactionSubscribe,
  Context
>({
  name: "Transaction_Subscribe",
  fields: () => ({
    transaction_edge: {
      type: new GraphQLNonNull(GraphQLBucketTransactionEdge),
      resolve: ({ transaction_edge }) => transaction_edge,
    },
    type: {
      type: new GraphQLNonNull(SubscribeType),
      resolve: ({ type }) => type,
    },
  }),
});

export const Investment_Subscribe = new GraphQLObjectType<
  IInvestmentSubscribe,
  Context
>({
  name: "Investment_Subscribe",
  fields: () => ({
    investment_edge: {
      type: new GraphQLNonNull(GraphQLInvestmentEdge),
      resolve: ({ investment_edge }) => investment_edge,
    },
    type: {
      type: new GraphQLNonNull(SubscribeType),
      resolve: ({ type }) => type,
    },
  }),
});

export const loans_subscribe = {
  type: new GraphQLNonNull(Loan_Subscribe),
  description: "New or updated loans",
  subscribe: (): AsyncIterator<ILoanSubscribe> => {
    return pubsub.asyncIterator<ILoanSubscribe>(LOAN);
  },
};

export const transactions_subscribe = {
  type: new GraphQLNonNull(Transaction_Subscribe),
  args: {
    user_gid: { type: new GraphQLNonNull(GraphQLID) },
  },
  description: "New or updated transactions",
  subscribe: withFilter(
    () => pubsub.asyncIterator(TRANSACTION),
    (payload, variables) => {
      return (
        payload.transactions_subscribe.transaction_edge.node._id_user.toHexString() ===
        unbase64(variables.user_gid)
      );
    }
  ),
};

export const investments_subscribe = {
  type: new GraphQLNonNull(Investment_Subscribe),
  args: {
    user_gid: { type: new GraphQLNonNull(GraphQLID) },
  },
  description: "New or updated investment",
  subscribe: withFilter(
    () => pubsub.asyncIterator(INVESTMENT),
    (payload, variables) => {
      return (
        payload.investments_subscribe.investment_edge.node._id_lender.toHexString() ===
        unbase64(variables.user_gid)
      );
    }
  ),
};

export const user_subscribe = {
  type: new GraphQLNonNull(User_Subscribe),
  description: "Updated users",
  args: {
    user_gid: { type: new GraphQLNonNull(GraphQLID) },
  },
  subscribe: withFilter(
    () => pubsub.asyncIterator(USER),
    (payload, variables) => {
      return (
        payload.user_subscribe.user._id.toHexString() ===
        unbase64(variables.user_gid)
      );
    }
  ),
};
