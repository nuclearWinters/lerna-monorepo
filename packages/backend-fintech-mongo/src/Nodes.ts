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
  GraphQLUnionType,
} from "graphql";
import {
  fromGlobalId,
  globalIdField,
  nodeDefinitions,
  connectionDefinitions,
  Connection,
  connectionFromArray,
  ConnectionArguments,
  forwardConnectionArgs,
} from "graphql-relay";
import { Filter } from "mongodb";
import {
  Context,
  InvestmentMongo,
  LoanMongo,
  TransactionMongo,
  ILoanStatus,
  IInvestmentStatus,
  TransactionMongoType,
  UserMongo,
  InvestmentTransactionMongo,
  MoneyTransactionMongo,
  TransactionInvestMongoType,
  ScheduledPaymentsMongo,
  ScheduledPaymentsStatus,
} from "./types";
import { base64, unbase64 } from "./utils";
import { DateScalarType } from "../../backend-auth-node/src/exports";

interface ArgsInvestments extends ConnectionArguments {
  status?: IInvestmentStatus[];
}

interface ArgsLoans extends ConnectionArguments {
  status?: ILoanStatus[];
  borrower_id?: string;
}

const JSDependencyType = new GraphQLScalarType({
  name: "JSDependency",
  serialize: (value) => value,
});

const JSDependencyField = {
  args: {
    module: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: GraphQLString },
  },
  type: new GraphQLNonNull(JSDependencyType),
  resolve: async (_: unknown, { module }: { module: unknown }) => {
    seenDataDrivenDependencies.add(module);
    return module;
  },
};

const seenDataDrivenDependencies = new Set();
export const dataDrivenDependencies = {
  reset() {
    seenDataDrivenDependencies.clear();
  },
  getModules() {
    return Array.from(seenDataDrivenDependencies);
  },
};

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
            account_available: 0,
            account_to_be_paid: 0,
            id: "",
            account_total: 0,
            account_withheld: 0,
            type,
          };
        }
        return { ...(await users.findOne({ id })), type };
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
    borrower_id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ borrower_id }): string => borrower_id,
    },
    lender_id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ lender_id }): string => lender_id,
    },
    loan_id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ loan_oid }): string =>
        typeof loan_oid === "string" ? loan_oid : loan_oid.toHexString(),
    },
    quantity: {
      type: new GraphQLNonNull(MXNScalarType),
      resolve: ({ quantity }): number => quantity,
    },
    ROI: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: ({ roi }): number => roi,
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
    created_at: {
      type: new GraphQLNonNull(DateScalarType),
      resolve: ({ created_at }): Date =>
        typeof created_at === "string" ? new Date(created_at) : created_at,
    },
    updated_at: {
      type: new GraphQLNonNull(DateScalarType),
      resolve: ({ updated_at }): Date =>
        typeof updated_at === "string" ? new Date(updated_at) : updated_at,
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

export const GraphQLInvestTransaction = new GraphQLObjectType<
  InvestmentTransactionMongo,
  Context
>({
  name: "InvestTransaction",
  fields: {
    id: globalIdField("Transaction", ({ _id }): string => {
      return typeof _id === "string" ? _id : _id.toHexString();
    }),
    user_id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ user_id }): string => user_id,
    },
    borrower_id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ borrower_id }): string => borrower_id,
    },
    loan_id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ loan_oid }): string => loan_oid?.toHexString(),
    },
    quantity: {
      type: new GraphQLNonNull(MXNScalarType),
      resolve: ({ quantity }): number => quantity,
    },
    created_at: {
      type: new GraphQLNonNull(DateScalarType),
      resolve: ({ created_at }): Date =>
        typeof created_at === "string" ? new Date(created_at) : created_at,
    },
    type: {
      type: new GraphQLNonNull(TransactionType),
      resolve: ({ type }): TransactionInvestMongoType => type,
    },
    js: JSDependencyField,
  },
  interfaces: [nodeInterface],
});

export const GraphQLMoneyTransaction = new GraphQLObjectType<
  MoneyTransactionMongo,
  Context
>({
  name: "MoneyTransaction",
  fields: {
    id: globalIdField("Transaction", ({ _id }): string => {
      return typeof _id === "string" ? _id : _id.toHexString();
    }),
    user_id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ user_id }): string => user_id,
    },
    quantity: {
      type: new GraphQLNonNull(MXNScalarType),
      resolve: ({ quantity }): number => quantity,
    },
    created_at: {
      type: new GraphQLNonNull(DateScalarType),
      resolve: ({ created_at }): Date =>
        typeof created_at === "string" ? new Date(created_at) : created_at,
    },
    type: {
      type: new GraphQLNonNull(TransactionType),
      resolve: ({ type }): TransactionMongoType => type,
    },
    js: JSDependencyField,
  },
  interfaces: [nodeInterface],
});

export const GraphQLTransaction = new GraphQLUnionType({
  name: "Transaction",
  types: [GraphQLInvestTransaction, GraphQLMoneyTransaction],
  resolveType: (value) => {
    return (value as TransactionMongo).type === "invest"
      ? "InvestTransaction"
      : "MoneyTransaction";
  },
});

const {
  connectionType: TransactionConnection,
  edgeType: GraphQLTransactionEdge,
} = connectionDefinitions({
  name: "Transaction",
  nodeType: GraphQLTransaction,
});

export const GraphQLScheduledPayments =
  new GraphQLObjectType<ScheduledPaymentsMongo>({
    name: "ScheduledPayments",
    fields: {
      id: globalIdField("ScheduledPayments", ({ _id }): string =>
        typeof _id === "string" ? _id : _id.toHexString()
      ),
      loan_id: globalIdField("Loan", ({ loan_oid }): string =>
        typeof loan_oid === "string" ? loan_oid : loan_oid.toHexString()
      ),
      amortize: {
        type: new GraphQLNonNull(MXNScalarType),
        resolve: ({ amortize }): number => amortize,
      },
      status: {
        type: new GraphQLNonNull(LoanScheduledPaymentStatus),
        resolve: ({ status }): ScheduledPaymentsStatus => status,
      },
      scheduledDate: {
        type: new GraphQLNonNull(DateScalarType),
        resolve: ({ scheduled_date }): Date =>
          typeof scheduled_date === "string"
            ? new Date(scheduled_date)
            : scheduled_date,
      },
    },
  });

export const GraphQLLoan = new GraphQLObjectType<LoanMongo>({
  name: "Loan",
  fields: {
    id: globalIdField("Loan", ({ _id }): string =>
      typeof _id === "string" ? _id : _id.toHexString()
    ),
    user_id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ user_id }): string => user_id,
    },
    score: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ score }): string => score,
    },
    ROI: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: ({ roi }): number => roi,
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
    id: globalIdField("User"),
    accountAvailable: {
      type: new GraphQLNonNull(MXNScalarType),
      resolve: ({ account_available }): number => account_available,
    },
    accountToBePaid: {
      type: new GraphQLNonNull(MXNScalarType),
      resolve: ({ account_to_be_paid }): number => account_to_be_paid,
    },
    accountTotal: {
      type: new GraphQLNonNull(MXNScalarType),
      resolve: ({ account_total }): number => account_total,
    },
    accountWithheld: {
      type: new GraphQLNonNull(MXNScalarType),
      resolve: ({ account_withheld }): number => account_withheld,
    },
    approveLoans: {
      type: LoanConnection,
      args: {
        ...forwardConnectionArgs,
        reset: {
          type: GraphQLFloat,
        },
      },
      resolve: async (
        _root: unknown,
        args: unknown,
        { loans, id, isSupport }: Context
      ): Promise<Connection<LoanMongo>> => {
        const { after, first } = args as ConnectionArguments;
        if (!id) {
          throw new Error("Unauthenticated");
        }
        if (!isSupport) {
          throw new Error("Unauthorized");
        }
        const loan_id = unbase64(after || "");
        const limit = first ? first + 1 : 0;
        if (limit <= 0) {
          throw new Error("Se requiere que 'first' sea un entero positivo");
        }
        const query: Filter<LoanMongo> = {
          status: "waiting for approval",
        };
        if (loan_id) {
          query._id = { $lt: new ObjectId(loan_id) };
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
      },
    },
    myLoans: {
      type: LoanConnection,
      args: {
        ...forwardConnectionArgs,
        reset: {
          type: GraphQLFloat,
        },
      },
      resolve: async (
        _root: unknown,
        args: unknown,
        { loans, isBorrower, id }: Context
      ): Promise<Connection<LoanMongo>> => {
        const { after, first } = args as ConnectionArguments;
        if (!id) {
          throw new Error("Unauthenticated");
        }
        if (!isBorrower) {
          throw new Error("Unauthorized");
        }
        const loan_id = unbase64(after || "");
        const limit = first ? first + 1 : 0;
        if (limit <= 0) {
          throw new Error("Se requiere que 'first' sea un entero positivo");
        }
        const query: Filter<LoanMongo> = {
          user_id: id,
        };
        if (loan_id) {
          query._id = { $lt: new ObjectId(loan_id) };
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
      },
    },
    investments: {
      type: InvestmentConnection,
      args: {
        ...forwardConnectionArgs,
        status: {
          type: new GraphQLList(new GraphQLNonNull(InvestmentStatus)),
        },
        reset: {
          type: GraphQLFloat,
        },
      },
      resolve: async (
        _root: unknown,
        args: unknown,
        { investments, id }: Context
      ): Promise<Connection<InvestmentMongo>> => {
        const { status, first, after } = args as ArgsInvestments;
        if (!id) {
          throw new Error("Unauthenticated");
        }
        const investment_id = unbase64(after || "");
        const limit = first ? first + 1 : 0;
        if (limit <= 0) {
          throw new Error("Se requiere que 'first' sea un entero positivo");
        }
        const query: Filter<InvestmentMongo> = {
          lender_id: id,
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
      },
    },
    transactions: {
      type: TransactionConnection,
      args: {
        ...forwardConnectionArgs,
        reset: {
          type: GraphQLFloat,
        },
      },
      resolve: async (
        _root: unknown,
        args: unknown,
        { transactions, id }: Context
      ): Promise<Connection<TransactionMongo>> => {
        const { first, after } = args as ConnectionArguments;
        if (!id) {
          throw new Error("Unauthenticated");
        }
        const transaction_id = unbase64(after || "");
        const limit = first ? first + 1 : 0;
        if (limit <= 0) {
          throw new Error("Se requiere que 'first' sea un entero positivo");
        }
        const query: Filter<TransactionMongo> = {
          user_id: id,
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
      },
    },
    loansFinancing: {
      type: LoanConnection,
      args: {
        ...forwardConnectionArgs,
        reset: {
          type: GraphQLFloat,
        },
      },
      resolve: async (
        _root: unknown,
        args: unknown,
        { loans }: Context
      ): Promise<Connection<LoanMongo>> => {
        const { after, first } = args as ArgsLoans;
        try {
          const loan_id = unbase64(after || "");
          const limit = first ? first + 1 : 0;
          if (limit <= 0) {
            throw new Error("Se requiere que 'first' sea un entero positivo");
          }
          const query: Filter<LoanMongo> = {
            status: "financing",
          };
          if (loan_id) {
            query._id = { $lt: new ObjectId(loan_id) };
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
