import { GraphQLID, GraphQLList, GraphQLNonNull } from "graphql";
import { withFilter } from "graphql-subscriptions";
import {
  GraphQLTransactionEdge,
  GraphQLInvestmentEdge,
  GraphQLLoanEdge,
  GraphQLUser,
  InvestmentStatus,
  GraphQLInvestment,
  GraphQLLoan,
} from "../Nodes.js";
import {
  Context,
  IInvestmentEdge,
  ILoanEdge,
  InvestmentMongoRedis,
  ITransactionEdge,
  LoanMongoRedis,
  UserMongo,
} from "../types.js";
import { unbase64 } from "@lerna-monorepo/backend-utilities/index";

export const LOAN_INSERT = "LOAN_INSERT";
export const MY_LOAN_INSERT = "MY_LOAN_INSERT";
export const TRANSACTION_INSERT = "TRANSACTION_INSERT";
export const INVESTMENT_INSERT = "INVESTMENT_INSERT";
export const USER = "USER";
export const INVESTMENT_UPDATE = "INVESTMENT_UPDATE";
export const LOAN_UPDATE = "LOAN_UPDATE";

interface PayloadMyLoansInsert {
  my_loans_subscribe_insert: ILoanEdge;
}

export const my_loans_subscribe_insert = {
  type: new GraphQLNonNull(GraphQLLoanEdge),
  description: "New my loans",
  args: {},
  subscribe: withFilter(
    (_payload, _args, context: Context) =>
      context.pubsub.asyncIterator(MY_LOAN_INSERT),
    (payload: PayloadMyLoansInsert, _, { isSupport, id }: Context) => {
      return isSupport
        ? payload.my_loans_subscribe_insert.node.status ===
            "waiting for approval"
        : id === payload.my_loans_subscribe_insert.node.user_id;
    }
  ),
};

interface PayloadLoansInsert {
  loans_subscribe_insert: ILoanEdge;
}

export const loans_subscribe_insert = {
  type: new GraphQLNonNull(GraphQLLoanEdge),
  description: "New loans",
  args: {},
  subscribe: withFilter(
    (_payload, _args, context: Context) =>
      context.pubsub.asyncIterator(LOAN_INSERT),
    (payload: PayloadLoansInsert) => {
      return payload.loans_subscribe_insert.node.status === "financing";
    }
  ),
};

interface PayloadTransactionInsert {
  transactions_subscribe_insert: ITransactionEdge;
}

export const transactions_subscribe_insert = {
  type: new GraphQLNonNull(GraphQLTransactionEdge),
  args: {},
  description: "New transactions",
  subscribe: withFilter(
    (_payload, _args, context: Context) =>
      context.pubsub.asyncIterator(TRANSACTION_INSERT),
    (payload: PayloadTransactionInsert, _, context: Context) => {
      return payload.transactions_subscribe_insert.node.user_id === context.id;
    }
  ),
};

interface PayloadInvestmentUpdate {
  investments_subscribe_update: InvestmentMongoRedis;
}

export const investments_subscribe_update = {
  type: new GraphQLNonNull(GraphQLInvestment),
  args: {},
  description: "Updated investments",
  subscribe: withFilter(
    (_payload, _args, context: Context) =>
      context.pubsub.asyncIterator(INVESTMENT_UPDATE),
    (payload: PayloadInvestmentUpdate, _, context: Context) => {
      return payload.investments_subscribe_update.lender_id === context.id;
    }
  ),
};

interface PayloadLoanUpdate {
  loans_subscribe_update: LoanMongoRedis;
}

export const loans_subscribe_update = {
  type: new GraphQLNonNull(GraphQLLoan),
  args: {
    gid: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  description: "Updated loans",
  subscribe: withFilter(
    (_payload, _args, context: Context) =>
      context.pubsub.asyncIterator(LOAN_UPDATE),
    (payload: PayloadLoanUpdate, variables) => {
      return payload.loans_subscribe_update._id === unbase64(variables.gid);
    }
  ),
};

interface PayloadInvestmentInsert {
  investments_subscribe_insert: IInvestmentEdge;
}

export const investments_subscribe_insert = {
  type: new GraphQLNonNull(GraphQLInvestmentEdge),
  args: {
    status: {
      type: new GraphQLList(new GraphQLNonNull(InvestmentStatus)),
    },
  },
  description: "New investment",
  subscribe: withFilter(
    (_payload, _args, context: Context) =>
      context.pubsub.asyncIterator(INVESTMENT_INSERT),
    (payload: PayloadInvestmentInsert, variables, { id }: Context) => {
      return (
        payload.investments_subscribe_insert.node.lender_id === id &&
        (variables.status?.includes(
          payload.investments_subscribe_insert.node.status
        ) ||
          !variables.status)
      );
    }
  ),
};

interface PayloadUser {
  user_subscribe: UserMongo;
}

export const user_subscribe = {
  type: new GraphQLNonNull(GraphQLUser),
  description: "Updated user",
  args: {},
  subscribe: withFilter(
    (_payload, _args, context: Context) => context.pubsub.asyncIterator(USER),
    (payload: PayloadUser, _, context: Context) => {
      return payload.user_subscribe.id === context.id;
    }
  ),
};
