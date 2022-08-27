import { GraphQLID, GraphQLList, GraphQLNonNull } from "graphql";
import { withFilter } from "graphql-subscriptions";
import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis, { RedisOptions } from "ioredis";
import {
  GraphQLTransactionEdge,
  GraphQLInvestmentEdge,
  GraphQLLoanEdge,
  GraphQLUser,
  InvestmentStatus,
  GraphQLInvestment,
  GraphQLLoan,
} from "../Nodes";
import {
  Context,
  IInvestmentEdge,
  ILoanEdge,
  InvestmentMongo,
  ITransactionEdge,
  LoanMongo,
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

export const LOAN_INSERT = "LOAN_INSERT";
export const TRANSACTION_INSERT = "TRANSACTION_INSERT";
export const INVESTMENT_INSERT = "INVESTMENT_INSERT";
export const USER = "USER";
export const INVESTMENT_UPDATE = "INVESTMENT_UPDATE";
export const LOAN_UPDATE = "LOAN_UPDATE";

export const loans_subscribe_insert = {
  type: new GraphQLNonNull(GraphQLLoanEdge),
  description: "New loans",
  args: {},
  subscribe: withFilter(
    () => pubsub.asyncIterator(LOAN_INSERT),
    (payload: { loans_subscribe: ILoanEdge }, variables) => {
      return variables.status.includes(payload.loans_subscribe.node.status);
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
      context: Context
    ) => {
      return payload.transactions_subscribe_insert.node.id_user === context.id;
    }
  ),
};

export const investments_subscribe_update = {
  type: new GraphQLNonNull(GraphQLInvestment),
  args: {},
  description: "Updated investments",
  subscribe: withFilter(
    () => pubsub.asyncIterator(INVESTMENT_UPDATE),
    (
      payload: { investments_subscribe_update: InvestmentMongo },
      _,
      context: Context
    ) => {
      return payload.investments_subscribe_update.id_lender === context.id;
    }
  ),
};

export const loans_subscribe_update = {
  type: new GraphQLNonNull(GraphQLLoan),
  args: {
    gid: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  description: "Updated loans",
  subscribe: withFilter(
    () => pubsub.asyncIterator(LOAN_UPDATE),
    (payload: { loans_subscribe_update: LoanMongo }, variables) => {
      return (
        payload.loans_subscribe_update._id?.toHexString() ===
        unbase64(variables.gid)
      );
    }
  ),
};

export const investments_subscribe_insert = {
  type: new GraphQLNonNull(GraphQLInvestmentEdge),
  args: {
    status: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(InvestmentStatus))
      ),
    },
  },
  description: "New investment",
  subscribe: withFilter(
    () => pubsub.asyncIterator(INVESTMENT_INSERT),
    (payload: { investments_subscribe: IInvestmentEdge }, variables) => {
      return (
        payload.investments_subscribe.node.id_lender ===
          unbase64(variables.user_gid) &&
        variables.status.includes(payload.investments_subscribe.node.status)
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
    (payload: { user_subscribe: UserMongo }, _, context: Context) => {
      return payload.user_subscribe.id === context.id;
    }
  ),
};
