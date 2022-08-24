import {
  GraphQLEnumType,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";
import { withFilter } from "graphql-subscriptions";
import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis, { RedisOptions } from "ioredis";
import {
  GraphQLTransactionEdge,
  GraphQLInvestmentEdge,
  GraphQLLoanEdge,
  GraphQLTransaction,
  GraphQLUser,
  InvestmentStatus,
  LoanStatus,
} from "../Nodes";
import {
  Context,
  InvestmentMongo,
  ITransactionEdge,
  LoanMongo,
  TransactionMongo,
  UserMongo,
} from "../types";
import { unbase64 } from "../utils";
import { REDIS } from "../config";

const options: RedisOptions = {
  host: REDIS,
  port: 6379,
  retryStrategy: (times) => {
    return Math.min(times * 50, 2000);
  },
};

export const pubsub = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options),
});

export const LOAN = "LOAN";
export const TRANSACTION_INSERT = "TRANSACTION_INSERT";
export const INVESTMENT = "INVESTMENT";
export const USER = "USER";
export const TRANSACTION_UPDATE = "TRANSACTION_UPDATE";

type typeSubscribe = "update" | "insert";

interface ILoanSubscribe {
  loan_edge: { node: LoanMongo; cursor: string };
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
  args: {
    status: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(LoanStatus))),
    },
  },
  subscribe: withFilter(
    () => pubsub.asyncIterator<ILoanSubscribe>(LOAN),
    (payload: { loans_subscribe: ILoanSubscribe }, variables) => {
      return variables.status.includes(
        payload.loans_subscribe.loan_edge.node.status
      );
    }
  ),
};

export const transactions_subscribe_insert = {
  type: new GraphQLNonNull(GraphQLTransactionEdge),
  args: {},
  description: "New transactions",
  subscribe: withFilter(
    () => pubsub.asyncIterator(TRANSACTION_INSERT),
    (
      payload: {
        transactions_subscribe_insert: ITransactionEdge;
      },
      _,
      context
    ) => {
      return payload.transactions_subscribe_insert.node.id_user === context.id;
    }
  ),
};

export const transactions_subscribe_update = {
  type: new GraphQLNonNull(GraphQLTransaction),
  args: {
    gid: { type: new GraphQLNonNull(GraphQLID) },
  },
  description: "Updated transactions",
  subscribe: withFilter(
    () => pubsub.asyncIterator(TRANSACTION_UPDATE),
    (
      payload: { transactions_subscribe_update: TransactionMongo },
      variables
    ) => {
      return (
        payload.transactions_subscribe_update._id?.toHexString() ===
        unbase64(variables.gid)
      );
    }
  ),
};

export const investments_subscribe = {
  type: new GraphQLNonNull(Investment_Subscribe),
  args: {
    user_gid: { type: new GraphQLNonNull(GraphQLID) },
    status: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(InvestmentStatus))
      ),
    },
  },
  description: "New or updated investment",
  subscribe: withFilter(
    () => pubsub.asyncIterator(INVESTMENT),
    (payload: { investments_subscribe: IInvestmentSubscribe }, variables) => {
      return (
        payload.investments_subscribe.investment_edge.node.id_lender ===
          unbase64(variables.user_gid) &&
        variables.status.includes(
          payload.investments_subscribe.investment_edge.node.status
        )
      );
    }
  ),
};

export const user_subscribe = {
  type: new GraphQLNonNull(GraphQLUser),
  description: "Updated user",
  args: {},
  subscribe: withFilter(
    () => pubsub.asyncIterator(USER),
    (payload: { user_subscribe: UserMongo }, _, context) => {
      return payload.user_subscribe.id === context.id;
    }
  ),
};
