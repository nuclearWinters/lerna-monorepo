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
  connectionArgs,
  Connection,
  connectionFromArray,
  ConnectionArguments,
} from "graphql-relay";
import { Filter } from "mongodb";
import {
  Context,
  InvestmentMongo,
  LoanMongo,
  TransactionMongo,
  ILoanStatus,
  IInvestmentStatus,
  IScheduledPayments,
  IScheduledPaymentsStatus,
  TransactionMongoType,
  UserMongo,
} from "./types";
import { base64, unbase64 } from "./utils";

interface ArgsInvestments extends ConnectionArguments {
  user_id?: string | null;
  status?: IInvestmentStatus[];
}

export const DateScalarType = new GraphQLScalarType({
  name: "Date",
  serialize: (value) => {
    if (value instanceof Date) {
      return value.getTime();
    }
  },
  parseValue: (value) => {
    if (typeof value === "number") {
      return new Date(value);
    }
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10));
    }
    return null;
  },
});

const generateCurrency = (value: unknown) => {
  if (typeof value !== "number") {
    throw new TypeError(
      `Currency cannot represent non integer type ${JSON.stringify(value)}`
    );
  }

  const currencyInCents = parseInt(value.toString(), 10);

  return (currencyInCents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

const generateCents = (value: string) => {
  const digits = value.replace("$", "").replace(",", "");
  const number = parseFloat(digits);
  return number * 100;
};

export const MXNScalarType = new GraphQLScalarType({
  name: "MXN",
  serialize: generateCurrency,
  parseValue: (value) => {
    if (typeof value !== "string") {
      throw new TypeError(
        `Currency cannot represent non string type ${JSON.stringify(value)}`
      );
    }

    return generateCents(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      if (typeof ast.value === "string") {
        return generateCents(ast.value);
      }
    }
    throw new TypeError(
      `Currency cannot represent an invalid currency-string ${JSON.stringify(
        ast
      )}.`
    );
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
  async (globalId, { users, loans, investments, id: userId }) => {
    const { type, id } = fromGlobalId(globalId);
    switch (type) {
      case "User":
        if (!userId) {
          return {
            _id: new ObjectId("000000000000000000000000"),
            accountAvailable: 0,
            accountToBePaid: 0,
            id: "",
            accountTotal: 0,
            type,
          };
        }
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
  (obj: { type: string }) => obj.type
);

export const GraphQLInvestment = new GraphQLObjectType<InvestmentMongo>({
  name: "Investment",
  fields: {
    id: globalIdField("Investment", ({ _id }): string =>
      typeof _id === "string" ? _id : _id.toHexString()
    ),
    id_borrower: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ id_borrower }): string => id_borrower,
    },
    id_lender: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ id_lender }): string => id_lender,
    },
    _id_loan: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ _id_loan }): string => _id_loan.toHexString(),
    },
    quantity: {
      type: new GraphQLNonNull(MXNScalarType),
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
      resolve: ({ created }): Date =>
        typeof created === "string" ? new Date(created) : created,
    },
    updated: {
      type: new GraphQLNonNull(DateScalarType),
      resolve: ({ updated }): Date =>
        typeof updated === "string" ? new Date(updated) : updated,
    },
    status: {
      type: new GraphQLNonNull(InvestmentStatus),
      resolve: ({ status }): IInvestmentStatus => status,
    },
    interest_to_earn: {
      type: new GraphQLNonNull(MXNScalarType),
      resolve: ({ interest_to_earn }): number => interest_to_earn,
    },
    paid_already: {
      type: new GraphQLNonNull(MXNScalarType),
      resolve: ({ paid_already }): number => paid_already,
    },
    to_be_paid: {
      type: new GraphQLNonNull(MXNScalarType),
      resolve: ({ to_be_paid }): number => to_be_paid,
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
    id: globalIdField("Transaction", ({ _id }): string => {
      return typeof _id === "string" ? _id : _id.toHexString();
    }),
    id_user: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ id_user }): string => id_user,
    },
    id_borrower: {
      type: GraphQLString,
      resolve: ({ id_borrower }): string | null => id_borrower || null,
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
      resolve: ({ created }): Date =>
        typeof created === "string" ? new Date(created) : created,
    },
    type: {
      type: new GraphQLNonNull(TransactionType),
      resolve: ({ type }): TransactionMongoType => type,
    },
  },
});

const {
  connectionType: TransactionConnection,
  edgeType: GraphQLTransactionEdge,
} = connectionDefinitions({
  name: "BucketTransaction",
  nodeType: GraphQLTransaction,
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
        type: new GraphQLNonNull(DateScalarType),
        resolve: ({ scheduledDate }): Date =>
          typeof scheduledDate === "string"
            ? new Date(scheduledDate)
            : scheduledDate,
      },
    },
  });

export const GraphQLLoan = new GraphQLObjectType<LoanMongo>({
  name: "Loan",
  fields: {
    id: globalIdField("Loan", ({ _id }): string =>
      typeof _id === "string" ? _id : _id.toHexString()
    ),
    id_user: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ id_user }): string => id_user,
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
      resolve: ({ expiry }): Date =>
        typeof expiry === "string" ? new Date(expiry) : expiry,
    },
    status: {
      type: new GraphQLNonNull(LoanStatus),
      resolve: ({ status }): ILoanStatus => status,
    },
    scheduledPayments: {
      type: new GraphQLList(new GraphQLNonNull(GraphQLScheduledPayments)),
      resolve: ({ scheduledPayments }): IScheduledPayments[] | null =>
        scheduledPayments,
    },
    pending: {
      type: new GraphQLNonNull(MXNScalarType),
      resolve: ({ pending }): number => pending,
    },
    pendingCents: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: ({ pending }): number => pending,
    },
  },
  interfaces: [nodeInterface],
});

const { connectionType: LoanConnection, edgeType: GraphQLLoanEdge } =
  connectionDefinitions({
    name: "Loan",
    nodeType: GraphQLLoan,
  });

const GraphQLUser = new GraphQLObjectType<UserMongo, Context>({
  name: "User",
  fields: {
    id: globalIdField("User", ({ _id }): string =>
      typeof _id === "string" ? _id : _id.toHexString()
    ),
    accountId: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ id }): string => id,
    },
    accountAvailable: {
      type: new GraphQLNonNull(MXNScalarType),
      resolve: ({ accountAvailable }): number => accountAvailable,
    },
    accountToBePaid: {
      type: new GraphQLNonNull(MXNScalarType),
      resolve: ({ accountToBePaid }): number => accountToBePaid,
    },
    accountTotal: {
      type: new GraphQLNonNull(MXNScalarType),
      resolve: ({ accountTotal }): number => accountTotal,
    },
    loans: {
      type: new GraphQLNonNull(LoanConnection),
      args: connectionArgs,
      resolve: async (
        _root: unknown,
        args: unknown,
        { loans, isBorrower, isSupport, id }: Context
      ): Promise<Connection<LoanMongo>> => {
        const { after, first } = args as ConnectionArguments;
        try {
          const loan_id = unbase64(after || "");
          const limit = first ? first + 1 : 0;
          if (limit <= 0) {
            throw new Error("Se requiere que 'first' sea un entero positivo");
          }
          const query: Filter<LoanMongo> = {
            status: {
              $in: isBorrower
                ? ["financing", "to be paid", "waiting for approval"]
                : isSupport
                ? ["waiting for approval"]
                : ["financing"],
            },
          };
          if (loan_id) {
            query._id = { $lt: new ObjectId(loan_id) };
          }
          if (isBorrower) {
            query.id_user = id;
          }
          const result = await loans
            .find(query)
            .limit(limit)
            .sort({ $natural: -1 })
            .toArray();
          const edgesMapped = result.map((loan) => {
            return {
              cursor: base64(loan._id.toHexString()),
              node: loan,
            };
          });
          const edges = edgesMapped.slice(0, first || 5);
          return {
            edges,
            pageInfo: {
              startCursor: edges[0]?.cursor || null,
              endCursor: edges[edges.length - 1]?.cursor || null,
              hasPreviousPage: false,
              hasNextPage: edgesMapped.length > (first || 0),
            },
          };
        } catch (e) {
          return connectionFromArray([], { first, after });
        }
      },
    },
    investments: {
      type: new GraphQLNonNull(InvestmentConnection),
      args: {
        status: {
          type: new GraphQLNonNull(
            new GraphQLList(new GraphQLNonNull(InvestmentStatus))
          ),
        },
        ...connectionArgs,
      },
      resolve: async (
        _: unknown,
        args: unknown,
        { investments, id }: Context
      ): Promise<Connection<InvestmentMongo>> => {
        const { status, first, after } = args as ArgsInvestments;
        try {
          const investment_id = unbase64(after || "");
          const limit = first ? first + 1 : 0;
          if (limit <= 0) {
            throw new Error("Se requiere que 'first' sea un entero positivo");
          }
          const query: Filter<InvestmentMongo> = {
            id_lender: id,
            status: { $in: ["delay payment", "up to date"] },
          };
          if (investment_id) {
            query._id = { $lt: new ObjectId(investment_id) };
          }
          if (status) {
            query.status = { $in: status };
          }
          const result = await investments
            .find(query)
            .limit(limit)
            .sort({ $natural: -1 })
            .toArray();
          const edgesMapped = result.map((investment) => {
            return {
              cursor: base64(investment._id.toHexString()),
              node: investment,
            };
          });
          const edges = edgesMapped.slice(0, first || 5);
          return {
            edges,
            pageInfo: {
              startCursor: edges[0]?.cursor || null,
              endCursor: edges[edges.length - 1]?.cursor || null,
              hasPreviousPage: false,
              hasNextPage: edgesMapped.length > (first || 0),
            },
          };
        } catch (e) {
          return connectionFromArray([], { first, after });
        }
      },
    },
    transactions: {
      type: new GraphQLNonNull(TransactionConnection),
      args: connectionArgs,
      resolve: async (
        _: unknown,
        args: unknown,
        { transactions, id }: Context
      ): Promise<Connection<TransactionMongo>> => {
        const { first, after } = args as ConnectionArguments;
        try {
          const transaction_id = unbase64(after || "");
          const limit = first ? first + 1 : 0;
          if (limit <= 0) {
            throw new Error("Se requiere que 'first' sea un entero positivo");
          }
          const query: Filter<TransactionMongo> = {
            id_user: id,
          };
          if (transaction_id) {
            query._id = { $lt: new ObjectId(transaction_id) };
          }
          const result = await transactions
            .find(query)
            .limit(limit)
            .sort({ $natural: -1 })
            .toArray();
          const edgesMapped = result.map((transaction) => {
            return {
              cursor: base64(transaction._id.toHexString()),
              node: transaction,
            };
          });
          const edges = edgesMapped.slice(0, first || 5);
          return {
            edges,
            pageInfo: {
              startCursor: edges[0]?.cursor || null,
              endCursor: edges[edges.length - 1]?.cursor || null,
              hasPreviousPage: false,
              hasNextPage: edgesMapped.length > (first || 0),
            },
          };
        } catch (e) {
          return connectionFromArray([], { first, after });
        }
      },
    },
  },
  interfaces: [nodeInterface],
});

export {
  nodeField,
  nodeInterface,
  LoanConnection,
  GraphQLLoanEdge,
  TransactionConnection,
  GraphQLTransactionEdge,
  InvestmentConnection,
  GraphQLInvestmentEdge,
  GraphQLUser,
};
