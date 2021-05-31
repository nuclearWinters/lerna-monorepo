import { ObjectID } from "bson";
import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLScalarType,
  Kind,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
} from "graphql";
import {
  fromGlobalId,
  globalIdField,
  nodeDefinitions,
  connectionDefinitions,
} from "graphql-relay";
import {
  RootUser,
  Context,
  InvestmentMongo,
  LoanMongo,
  TransactionMongo,
  BucketTransactionMongo,
  ILoanStatus,
  IInvestmentStatus,
  IScheduledPayments,
  IScheduledPaymentsStatus,
  TransactionMongoType,
} from "./types";

export const DateScalarType = new GraphQLScalarType({
  name: "Date",
  serialize: (value) => {
    return value.getTime();
  },
  parseValue: (value) => {
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10));
    }
    return null;
  },
});

export const MXNScalarType = new GraphQLScalarType({
  name: "MXN",
  serialize: (value) => {
    return (value / 100).toFixed(2);
  },
  parseValue: (value) => {
    return Number(value) * 100;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return Number(ast.value) * 100;
    }
    return null;
  },
});

export const TransactionType = new GraphQLEnumType({
  name: "TransactionType",
  values: {
    CREDIT: { value: "CREDIT" },
    WITHDRAWAL: { value: "WITHDRAWAL" },
    INVEST: { value: "INVEST" },
    PAYMENT: { value: "PAYMENT" },
  },
});

export const LoanStatus = new GraphQLEnumType({
  name: "LoanStatus",
  values: {
    PAID: { value: "paid" },
    TO_BE_PAID: { value: "to be paid" },
    FINANCING: { value: "financing" },
    WAITING_FOR_APPROVAL: { value: "waiting for approval" },
    PAST_DUE: { value: "past due" },
  },
});

export const InvestmentStatus = new GraphQLEnumType({
  name: "InvestmentStatus",
  values: {
    DELAY_PAYMENT: { value: "delay payment" },
    UP_TO_DATE: { value: "up to date" },
    PAST_DUE: { value: "past due" },
    PAID: { value: "paid" },
  },
});

export const LoanScheduledPaymentStatus = new GraphQLEnumType({
  name: "LoanScheduledPaymentStatus",
  values: {
    TO_BE_PAID: { value: "to be paid" },
    DELAYED: { value: "delayed" },
    PAID: { value: "paid" },
  },
});

const { nodeInterface, nodeField } = nodeDefinitions(
  async (globalId, { users, loans, investments }) => {
    const { type, id } = fromGlobalId(globalId);
    switch (type) {
      case "User":
        return { ...(await users.findOne({ _id: new ObjectID(id) })), type };
      case "Loan":
        return { ...(await loans.findOne({ _id: new ObjectID(id) })), type };
      case "Investment":
        return {
          ...(await investments.findOne({ _id: new ObjectID(id) })),
          type,
        };
      default:
        return { type: "" };
    }
  },
  (obj: { type: string }): GraphQLObjectType | null => {
    switch (obj.type) {
      case "Loan":
        return GraphQLLoan;
      case "Investment":
        return GraphQLInvestment;
      case "User":
        return GraphQLUser;
      default:
        return null;
    }
  }
);

export const GraphQLInvestment = new GraphQLObjectType<InvestmentMongo>({
  name: "Investment",
  fields: {
    id: globalIdField("Investment", ({ _id }): string => _id.toHexString()),
    _id_borrower: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ _id_borrower }): string => _id_borrower.toHexString(),
    },
    _id_lender: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ _id_lender }): string => _id_lender.toHexString(),
    },
    _id_loan: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ _id_loan }): string => _id_loan.toHexString(),
    },
    quantity: {
      type: new GraphQLNonNull(MXNScalarType),
      resolve: ({ quantity }): number => quantity,
    },
    created: {
      type: new GraphQLNonNull(DateScalarType),
      resolve: ({ created }): Date => created,
    },
    updated: {
      type: new GraphQLNonNull(DateScalarType),
      resolve: ({ updated }): Date => updated,
    },
    status: {
      type: new GraphQLNonNull(InvestmentStatus),
      resolve: ({ status }): IInvestmentStatus => status,
    },
  },
  interfaces: [nodeInterface],
});

const {
  connectionType: InvestmentConnection,
  edgeType: GraphQLInvestmentEdge,
} = connectionDefinitions({
  name: "Investment",
  nodeType: GraphQLInvestment,
});

export const GraphQLTransaction = new GraphQLObjectType<TransactionMongo>({
  name: "Transaction",
  fields: {
    id: globalIdField("Transaction", ({ _id }): string => _id.toHexString()),
    _id_borrower: {
      type: GraphQLString,
      resolve: ({ _id_borrower }): string | null =>
        _id_borrower?.toHexString() || null,
    },
    _id_loan: {
      type: GraphQLString,
      resolve: ({ _id_loan }): string | null => _id_loan?.toHexString() || null,
    },
    quantity: {
      type: new GraphQLNonNull(MXNScalarType),
      resolve: ({ quantity }): number => quantity,
    },
    created: {
      type: new GraphQLNonNull(DateScalarType),
      resolve: ({ created }): Date => created,
    },
    type: {
      type: new GraphQLNonNull(TransactionType),
      resolve: ({ type }): TransactionMongoType => type,
    },
  },
});

export const GraphQLBucketTransaction =
  new GraphQLObjectType<BucketTransactionMongo>({
    name: "BucketTransaction",
    fields: {
      id: globalIdField("BucketTransaction", ({ _id }): string => _id),
      history: {
        type: new GraphQLNonNull(
          new GraphQLList(new GraphQLNonNull(GraphQLTransaction))
        ),
        resolve: ({ history }): TransactionMongo[] => history,
      },
      count: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve: ({ count }): number => count,
      },
      _id_user: {
        type: new GraphQLNonNull(GraphQLString),
        resolve: ({ _id_user }): string => _id_user.toHexString(),
      },
    },
    interfaces: [nodeInterface],
  });

const {
  connectionType: BucketTransactionConnection,
  edgeType: GraphQLBucketTransactionEdge,
} = connectionDefinitions({
  name: "BucketTransaction",
  nodeType: GraphQLBucketTransaction,
});

export const GraphQLScheduledPayments =
  new GraphQLObjectType<IScheduledPayments>({
    name: "ScheduledPayments",
    fields: {
      amortize: {
        type: new GraphQLNonNull(MXNScalarType),
        resolve: ({ amortize }): number => amortize,
      },
      status: {
        type: new GraphQLNonNull(LoanScheduledPaymentStatus),
        resolve: ({ status }): IScheduledPaymentsStatus => status,
      },
      scheduledDate: {
        type: GraphQLString,
        resolve: ({ scheduledDate }): Date => scheduledDate,
      },
    },
  });

export const GraphQLLoan = new GraphQLObjectType<LoanMongo>({
  name: "Loan",
  fields: {
    id: globalIdField("Loan", ({ _id }): string => _id.toHexString()),
    _id_user: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ _id_user }): string => _id_user.toHexString(),
    },
    score: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ score }): string => score,
    },
    ROI: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: ({ ROI }): number => ROI,
    },
    goal: {
      type: new GraphQLNonNull(MXNScalarType),
      resolve: ({ goal }): number => goal,
    },
    term: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: ({ term }): number => term,
    },
    raised: {
      type: new GraphQLNonNull(MXNScalarType),
      resolve: ({ raised }): number => raised,
    },
    expiry: {
      type: new GraphQLNonNull(DateScalarType),
      resolve: ({ expiry }): Date => expiry,
    },
    status: {
      type: new GraphQLNonNull(LoanStatus),
      resolve: ({ status }): ILoanStatus => status,
    },
    scheduledPayments: {
      type: new GraphQLList(new GraphQLNonNull(LoanStatus)),
      resolve: ({ scheduledPayments }): IScheduledPayments[] | null =>
        scheduledPayments,
    },
  },
  interfaces: [nodeInterface],
});

const { connectionType: LoanConnection, edgeType: GraphQLLoanEdge } =
  connectionDefinitions({
    name: "Loan",
    nodeType: GraphQLLoan,
  });

const GraphQLUser = new GraphQLObjectType<RootUser, Context>({
  name: "User",
  fields: {
    id: globalIdField("User", ({ _id }): string => _id),
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ name }): string => name,
    },
    apellidoPaterno: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ apellidoPaterno }): string => apellidoPaterno,
    },
    apellidoMaterno: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ apellidoMaterno }): string => apellidoMaterno,
    },
    RFC: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ RFC }): string => RFC,
    },
    CURP: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ CURP }): string => CURP,
    },
    clabe: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ clabe }): string => clabe,
    },
    mobile: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ mobile }): string => mobile,
    },
    accountTotal: {
      type: new GraphQLNonNull(MXNScalarType),
      resolve: ({ accountTotal }): number => accountTotal,
    },
    accountAvailable: {
      type: new GraphQLNonNull(MXNScalarType),
      resolve: ({ accountAvailable }): number => accountAvailable,
    },
    error: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ error }): string => error,
    },
  },
  interfaces: [nodeInterface],
});

export {
  nodeField,
  nodeInterface,
  LoanConnection,
  GraphQLLoanEdge,
  BucketTransactionConnection,
  GraphQLBucketTransactionEdge,
  InvestmentConnection,
  GraphQLInvestmentEdge,
  GraphQLUser,
};
