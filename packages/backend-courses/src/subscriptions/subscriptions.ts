import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { globalIdField } from "graphql-relay";
import { PubSub, withFilter } from "graphql-subscriptions";
import { ObjectId } from "mongodb";
import {
  DateScalarType,
  GraphQLBucketTransactionEdge,
  GraphQLInvestmentEdge,
  GraphQLInvestmentsUser,
  GraphQLScheduledPayments,
  InvestmentStatus,
  LoanStatus,
  MXNScalarType,
} from "../Nodes";
import {
  Context,
  InvestmentMongo,
  BucketTransactionMongo,
  InvestmentsUserMongo,
  ILoanStatus,
  IScheduledPayments,
  ILoanInvestors,
} from "../types";
import { base64, unbase64 } from "../utils";

export const pubsub = new PubSub();

export const LOAN = "LOAN";
export const TRANSACTION = "TRANSACTION";
export const INVESTMENT = "INVESTMENT";
export const USER = "USER";

type typeSubscribe = "update" | "insert";

interface IUserSubscribe {
  _id: ObjectId;
  investments: InvestmentsUserMongo[] | null;
  accountAvailable: number | null;
}

interface ILoanNode {
  _id: ObjectId;
  _id_user: ObjectId | null;
  score: string | null;
  ROI: number | null;
  goal: number | null;
  term: number | null;
  raised: number | null;
  expiry: Date | null;
  status: ILoanStatus | null;
  scheduledPayments: IScheduledPayments[] | null;
  investors: ILoanInvestors[] | null;
}

interface ILoanEdge {
  node: ILoanNode;
}

interface ILoanSubscribe {
  loan_edge: {
    node: ILoanEdge;
  };
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
    user_gid: globalIdField("User", ({ _id }): string => _id.toHexString()),
    investments: {
      type: GraphQLInvestmentsUser,
      resolve: ({ investments }): InvestmentsUserMongo[] | null => investments,
    },
    accountAvailable: {
      type: MXNScalarType,
      resolve: ({ accountAvailable }): number | null => accountAvailable,
    },
  }),
});

export const Loan_Subscribe = new GraphQLObjectType<ILoanSubscribe, Context>({
  name: "Loan_Subscribe",
  fields: () => ({
    loan_edge: {
      type: new GraphQLNonNull(
        new GraphQLObjectType<ILoanEdge>({
          name: "LoanEdgeSubscription",
          fields: () => ({
            node: {
              type: new GraphQLNonNull(
                new GraphQLObjectType<ILoanNode>({
                  name: "LoanNodeSubscription",
                  fields: () => ({
                    loan_gid: globalIdField("Loan", ({ _id }): string =>
                      _id.toHexString()
                    ),
                    _id_user: {
                      type: GraphQLString,
                      resolve: ({ _id_user }): string | null =>
                        _id_user?.toHexString() || null,
                    },
                    score: {
                      type: GraphQLString,
                      resolve: ({ score }): string | null => score,
                    },
                    ROI: {
                      type: GraphQLFloat,
                      resolve: ({ ROI }): number | null => ROI,
                    },
                    goal: {
                      type: MXNScalarType,
                      resolve: ({ goal }): number | null => goal,
                    },
                    term: {
                      type: GraphQLInt,
                      resolve: ({ term }): number | null => term,
                    },
                    raised: {
                      type: MXNScalarType,
                      resolve: ({ raised }): number | null => raised,
                    },
                    expiry: {
                      type: DateScalarType,
                      resolve: ({ expiry }): Date | null => expiry,
                    },
                    status: {
                      type: LoanStatus,
                      resolve: ({ status }): ILoanStatus | null => status,
                    },
                    scheduledPayments: {
                      type: new GraphQLList(
                        new GraphQLNonNull(GraphQLScheduledPayments)
                      ),
                      resolve: ({
                        scheduledPayments,
                      }): IScheduledPayments[] | null => scheduledPayments,
                    },
                  }),
                })
              ),
              resolve: ({ node }): ILoanNode => node,
            },
            cursor: {
              type: GraphQLString,
              resolve: ({ node }): string | null =>
                node._id ? base64(node._id.toHexString()) : null,
            },
          }),
        })
      ),
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
  args: {
    status: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(LoanStatus))),
    },
  },
  subscribe: withFilter(
    () => pubsub.asyncIterator<ILoanSubscribe>(LOAN),
    (payload, variables) => {
      return payload.loans_subscribe.type === "update"
        ? true
        : variables.status.includes(
            payload.loans_subscribe.loan_edge.node.status
          );
    }
  ),
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
    status: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(InvestmentStatus))
      ),
    },
  },
  description: "New or updated investment",
  subscribe: withFilter(
    () => pubsub.asyncIterator(INVESTMENT),
    (payload, variables) => {
      return (
        payload.investments_subscribe.investment_edge.node._id_lender.toHexString() ===
          unbase64(variables.user_gid) &&
        variables.status.includes(payload.loans_subscribe.loan_edge.node.status)
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
        payload.user_subscribe._id.toHexString() ===
        unbase64(variables.user_gid)
      );
    }
  ),
};
