import { ObjectId } from "bson";
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
  UserMongo,
  InvestmentsUserMongo,
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
    CREDIT: { value: "credit" },
    WITHDRAWAL: { value: "withdrawal" },
    INVEST: { value: "invest" },
    PAYMENT: { value: "payment" },
    COLLECT: { value: "collect" },
  },
});

export const LoanStatus = new GraphQLEnumType({
  name: "LoanStatus",
  values: {
    PAID: { value: "paid" },
    FINANCING: { value: "financing" },
    TO_BE_PAID: { value: "to be paid" },
    WAITING_FOR_APPROVAL: { value: "waiting for approval" },
    PAST_DUE: { value: "past due" },
  },
});

export const InvestmentStatus = new GraphQLEnumType({
  name: "InvestmentStatus",
  values: {
    PAID: { value: "paid" },
    FINANCING: { value: "financing" },
    DELAY_PAYMENT: { value: "delay payment" },
    UP_TO_DATE: { value: "up to date" },
    PAST_DUE: { value: "past due" },
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

const { nodeInterface, nodeField } = nodeDefinitions<Context>(
  async (globalId, { users, loans, investments }) => {
    const { type, id } = fromGlobalId(globalId);
    switch (type) {
      case "User":
        return { ...(await users.findOne({ _id: new ObjectId(id) })), type };
      case "Loan":
        return { ...(await loans.findOne({ _id: new ObjectId(id) })), type };
      case "Investment":
        return {
          ...(await investments.findOne({ _id: new ObjectId(id) })),
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
      type: new GraphQLNonNull(GraphQLInt),
      resolve: ({ quantity }): number => quantity,
    },
    ROI: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: ({ ROI }): number => ROI,
    },
    payments: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: ({ payments }): number => payments,
    },
    term: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: ({ term }): number => term,
    },
    moratory: {
      type: new GraphQLNonNull(MXNScalarType),
      resolve: ({ moratory }): number => moratory,
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

export const GraphQLInvestmentsUser =
  new GraphQLObjectType<InvestmentsUserMongo>({
    name: "InvestmentsUser",
    fields: {
      _id_loan: {
        type: new GraphQLNonNull(GraphQLString),
        resolve: ({ _id_loan }): string => _id_loan.toHexString(),
      },
      quantity: {
        type: new GraphQLNonNull(MXNScalarType),
        resolve: ({ quantity }): number => quantity,
      },
      term: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve: ({ term }): number => term,
      },
      ROI: {
        type: new GraphQLNonNull(GraphQLFloat),
        resolve: ({ ROI }): number => ROI,
      },
      payments: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve: ({ payments }): number => payments,
      },
    },
  });

const GraphQLUser = new GraphQLObjectType<UserMongo, Context>({
  name: "User",
  fields: {
    id: globalIdField("User", ({ _id }): string => _id.toHexString()),
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
    accountAvailable: {
      type: new GraphQLNonNull(MXNScalarType),
      resolve: ({ accountAvailable }): number => accountAvailable,
    },
    investments: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLInvestmentsUser)),
      resolve: ({ investments }): InvestmentsUserMongo[] => investments,
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
