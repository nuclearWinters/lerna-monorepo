import type { IInvestmentEdge, IInvestmentStatus, ILoanEdge, ITransactionEdge, InvestmentMongoRedis, LoanMongoRedis } from "@repo/mongo-utils";
import type { FintechUserMongo } from "@repo/mongo-utils";
import { unbase64 } from "@repo/utils";
import { GraphQLID, GraphQLList, GraphQLNonNull, type GraphQLFieldConfig } from "graphql";
import { withFilter } from "graphql-subscriptions";
import { PubSub } from "graphql-subscriptions";
import { GraphQLInvestment, GraphQLInvestmentEdge, GraphQLLoan, GraphQLLoanEdge, GraphQLTransactionEdge, GraphQLUser, InvestmentStatus } from "../Nodes.ts";
import type { Context } from "../types.ts";

const pubsub = new PubSub();

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

export type PosiblePayloads =
  | undefined
  | PayloadMyLoansInsert
  | PayloadLoanUpdate
  | PayloadLoansInsert
  | PayloadInvestmentInsert
  | PayloadInvestmentUpdate
  | PayloadTransactionInsert
  | PayloadUser;

export type MyLoansSubscribeInsert = GraphQLFieldConfig<PosiblePayloads, Context, unknown>;

export const my_loans_subscribe_insert: MyLoansSubscribeInsert = {
  type: new GraphQLNonNull(GraphQLLoanEdge),
  description: "New my loans",
  args: {},
  subscribe: withFilter(
    (_payload, _args, context) => context?.pubsub.asyncIterator(MY_LOAN_INSERT) || pubsub.asyncIterableIterator(MY_LOAN_INSERT),
    (payload, _, context) => {
      if (payload && context && "my_loans_subscribe_insert" in payload) {
        const isSupport = context.isSupport;
        const id = context.id;
        const userId = payload.my_loans_subscribe_insert.node.user_id;
        const payloadHasStatus = payload.my_loans_subscribe_insert.node.status === "waiting for approval";
        const isSameUser = id === userId;
        return isSupport ? payloadHasStatus : isSameUser;
      }
      return false;
    },
  ),
};

interface PayloadLoansInsert {
  loans_subscribe_insert: ILoanEdge;
}

export const loans_subscribe_insert: GraphQLFieldConfig<PosiblePayloads, Context, unknown> = {
  type: new GraphQLNonNull(GraphQLLoanEdge),
  description: "New loans",
  args: {},
  subscribe: withFilter(
    (_payload, _args, context) => context?.pubsub.asyncIterator(LOAN_INSERT) || pubsub.asyncIterableIterator(LOAN_INSERT),
    (payload) => {
      if (payload && "loans_subscribe_insert" in payload) {
        return payload.loans_subscribe_insert.node.status === "financing";
      }
      return false;
    },
  ),
};

interface PayloadTransactionInsert {
  transactions_subscribe_insert: ITransactionEdge;
}

export type TransactionsSubscribeInsert = GraphQLFieldConfig<PosiblePayloads, Context, unknown>;

export const transactions_subscribe_insert: TransactionsSubscribeInsert = {
  type: new GraphQLNonNull(GraphQLTransactionEdge),
  args: {},
  description: "New transactions",
  subscribe: withFilter(
    (_payload, _args, context) => context?.pubsub.asyncIterator(TRANSACTION_INSERT) || pubsub.asyncIterableIterator(TRANSACTION_INSERT),
    (payload, _, context) => {
      if (payload && context && "transactions_subscribe_insert" in payload) {
        return payload.transactions_subscribe_insert.node.user_id === context.id;
      }
      return false;
    },
  ),
};

interface PayloadInvestmentUpdate {
  investments_subscribe_update: InvestmentMongoRedis;
}

export type InvestmentsSubscribeUpdate = GraphQLFieldConfig<PosiblePayloads, Context>;

export const investments_subscribe_update: InvestmentsSubscribeUpdate = {
  type: new GraphQLNonNull(GraphQLInvestment),
  args: {},
  description: "Updated investments",
  subscribe: withFilter(
    (_payload, _args, context) => context?.pubsub.asyncIterator(INVESTMENT_UPDATE) || pubsub.asyncIterableIterator(INVESTMENT_UPDATE),
    (payload, _, context) => {
      if (payload && context && "investments_subscribe_update" in payload) {
        return payload.investments_subscribe_update.lender_id === context.id;
      }
      return false;
    },
  ),
};

interface PayloadLoanUpdate {
  loans_subscribe_update: LoanMongoRedis;
}

interface PayloadLoanUpdatePayload {
  gid: string;
}

export const loans_subscribe_update: GraphQLFieldConfig<PosiblePayloads, Context, PayloadLoanUpdatePayload> = {
  type: new GraphQLNonNull(GraphQLLoan),
  args: {
    gid: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  description: "Updated loans",
  subscribe: withFilter(
    (_payload, _args, context) => context?.pubsub.asyncIterator(LOAN_UPDATE) || pubsub.asyncIterableIterator(LOAN_UPDATE),
    (payload, variables) => {
      if (payload && "loans_subscribe_update" in payload) {
        return payload.loans_subscribe_update._id === unbase64(variables?.gid || "");
      }
      return false;
    },
  ),
};

interface PayloadInvestmentInsert {
  investments_subscribe_insert: IInvestmentEdge;
}

interface PayloadInvestmentInsertPayload {
  status?: IInvestmentStatus[];
}

export const investments_subscribe_insert: GraphQLFieldConfig<PosiblePayloads, Context | undefined, PayloadInvestmentInsertPayload> = {
  type: new GraphQLNonNull(GraphQLInvestmentEdge),
  args: {
    status: {
      type: new GraphQLList(new GraphQLNonNull(InvestmentStatus)),
    },
  },
  description: "New investment",
  subscribe: withFilter(
    (_payload, _args, context) => context?.pubsub.asyncIterator(INVESTMENT_INSERT) || pubsub.asyncIterableIterator(INVESTMENT_INSERT),
    (payload, variables, context) => {
      if (payload && context && variables && variables.status && "investments_subscribe_insert" in payload) {
        const isSameUser = payload.investments_subscribe_insert.node.lender_id === context.id;
        const isSameStatus = variables.status.includes(payload.investments_subscribe_insert.node.status);
        const payloadHasStatus = !variables.status;
        return isSameUser && (isSameStatus || payloadHasStatus);
      }
      return false;
    },
  ),
};

interface PayloadUser {
  user_subscribe: FintechUserMongo;
}

export const user_subscribe: GraphQLFieldConfig<PosiblePayloads, Context, unknown> = {
  type: new GraphQLNonNull(GraphQLUser),
  description: "Updated user",
  args: {},
  subscribe: withFilter(
    (_payload, _args, context) => context?.pubsub.asyncIterator(USER) || pubsub.asyncIterableIterator(USER),
    (payload, _, context) => {
      if (payload && context && "user_subscribe" in payload) {
        return payload.user_subscribe.id === context.id;
      }
      return false;
    },
  ),
};
