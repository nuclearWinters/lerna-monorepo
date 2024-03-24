import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLScalarType,
  Kind,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
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
import {
  Context,
  InvestmentCassandra,
  LoanCassandra,
  TransactionCassandra,
  ILoanStatus,
  IInvestmentStatus,
  IScheduledPayments,
  IScheduledPaymentsStatus,
  TransactionCassandraType,
  UserCassandra,
  InvestmentTransactionCassandra,
  TransactionInvestCassandraType,
  MoneyTransactionCassandra,
  IInvestmentStatusType,
} from "./types";
import { base64, unbase64 } from "./utils";
import { DateScalarType } from "../../backend-auth-node/src/exports";

interface ArgsInvestments extends ConnectionArguments {
  status?: IInvestmentStatusType;
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

export const InvestmentStatusType = new GraphQLEnumType({
  name: "InvestmentStatusType",
  values: {
    ON_GOING: { value: "on_going" },
    OVER: { value: "over" },
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
  async (globalId, { client, id: userId }) => {
    const { type: typeNodeInterface, id } = fromGlobalId(globalId);
    switch (typeNodeInterface) {
      case "User": {
        if (!userId) {
          return {
            accountAvailable: 0,
            accountToBePaid: 0,
            id: "",
            accountTotal: 0,
            typeNodeInterface,
          };
        }
        const result = await client.execute(
          `SELECT * FROM fintech.users WHERE id = ${id}`
        );
        const user = result.first();
        return { ...user, typeNodeInterface };
      }
      case "Loan": {
        const result = await client.execute(
          `SELECT * FROM fintech.loans WHERE id = ${id}`
        );
        const loan = result.first();
        return { ...loan, typeNodeInterface };
      }
      case "Investment": {
        const result = await client.execute(
          `SELECT * FROM fintech.investments WHERE id = ${id}`
        );
        const investment = result.first();
        return {
          ...investment,
          typeNodeInterface,
        };
      }
      default:
        return { typeNodeInterface: "" };
    }
  },
  (obj: { typeNodeInterface: string }) => obj.typeNodeInterface
);

export const GraphQLInvestment = new GraphQLObjectType<InvestmentCassandra>({
  name: "Investment",
  fields: {
    id: globalIdField("Investment"),
    borrower_id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ borrower_id }): string => borrower_id,
    },
    lender_id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ lender_id }): string => lender_id,
    },
    _loan_id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ loan_id }): string => loan_id,
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
  InvestmentTransactionCassandra,
  Context
>({
  name: "InvestTransaction",
  fields: {
    id: globalIdField("Transaction"),
    user_id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ user_id }): string => user_id,
    },
    borrower_id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ borrower_id }): string => borrower_id,
    },
    _loan_id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ loan_id }): string => loan_id,
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
      resolve: ({ type }): TransactionInvestCassandraType => type,
    },
    js: JSDependencyField,
  },
  interfaces: [nodeInterface],
});

export const GraphQLMoneyTransaction = new GraphQLObjectType<
  MoneyTransactionCassandra,
  Context
>({
  name: "MoneyTransaction",
  fields: {
    id: globalIdField("Transaction"),
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
      resolve: ({ type }): TransactionCassandraType => type,
    },
    js: JSDependencyField,
  },
  interfaces: [nodeInterface],
});

export const GraphQLTransaction = new GraphQLUnionType({
  name: "Transaction",
  types: [GraphQLInvestTransaction, GraphQLMoneyTransaction],
  resolveType: (value) => {
    return ["invest", "collect"].includes(value.type)
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

export const GraphQLLoan = new GraphQLObjectType<LoanCassandra>({
  name: "Loan",
  fields: {
    id: globalIdField("Loan"),
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

const GraphQLUser = new GraphQLObjectType<UserCassandra, Context>({
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
    myLoans: {
      type: new GraphQLNonNull(LoanConnection),
      args: forwardConnectionArgs,
      resolve: async (
        _root: unknown,
        args: unknown,
        { client, id, isLender, isSupport }: Context
      ): Promise<Connection<LoanCassandra>> => {
        const { after, first } = args as ConnectionArguments;
        try {
          if (isLender || !id) {
            throw new Error("Do not return anything to lenders");
          }
          if (!id) {
            throw new Error("Do not return anything to not registered user");
          }
          const loan_id = unbase64(after || "");
          const limit = first ? first + 1 : 0;
          if (limit <= 0) {
            throw new Error("Se requiere que 'first' sea un entero positivo");
          }
          const result = isSupport
            ? await client.execute(
                `SELECT * FROM fintech.loans_by_status WHERE status = "waiting for approval"${
                  loan_id ? ` AND id < ${loan_id}` : ""
                } LIMIT ${limit}`
              )
            : await client.execute(
                `SELECT * FROM fintech.loans_by_user WHERE user_id = ${id}${
                  loan_id ? ` AND id < ${loan_id}` : ""
                } LIMIT ${limit}`
              );
          const edgesMapped = result.rows.map((loan) => {
            return {
              cursor: base64(loan._id.toHexString()),
              node: {
                id: loan.get("id"),
                user_id: loan.get("user_id"),
                score: loan.get("score"),
                roi: loan.get("roi"),
                goal: loan.get("goal"),
                term: loan.get("term"),
                raised: loan.get("raised"),
                expiry: loan.get("expiry"),
                status: loan.get("status"),
                pending: loan.get("pending"),
                payments_done: loan.get("payments_done"),
                payments_delayed: loan.get("payments_delayed"),
              },
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
        status_type: {
          type: InvestmentStatusType,
        },
        ...forwardConnectionArgs,
      },
      resolve: async (
        _root: unknown,
        args: unknown,
        { client, id }: Context
      ): Promise<Connection<InvestmentCassandra>> => {
        const { status, first, after } = args as ArgsInvestments;
        try {
          if (!id) {
            throw new Error("Do not return anything to not registered user");
          }
          const investment_id = unbase64(after || "");
          const limit = first ? first + 1 : 0;
          if (limit <= 0) {
            throw new Error("Se requiere que 'first' sea un entero positivo");
          }
          const result = status
            ? await client.execute(
                `SELECT * FROM fintech.investments_by_status_type WHERE status_type = ? AND lender_id = ${id}${
                  investment_id ? ` AND id < ${investment_id}` : ""
                } LIMIT ${limit}`,
                [status]
              )
            : await client.execute(
                `SELECT * FROM fintech.investments_by_lender WHERE lender_id = ${id}${
                  investment_id ? ` AND id < ${investment_id}` : ""
                } LIMIT ${limit}`
              );
          const edgesMapped = result.rows.map((investment) => {
            return {
              cursor: base64(investment._id.toHexString()),
              node: {
                id: investment.get("id"),
                borrower_id: investment.get("borrower_id"),
                lender_id: investment.get("lender_id"),
                loan_id: investment.get("loan_id"),
                quantity: investment.get("quantity"),
                created_at: investment.get("created_at"),
                updated_at: investment.get("updated_at"),
                status: investment.get("status"),
                status_type: investment.get("status_type"),
                roi: investment.get("roi"),
                term: investment.get("term"),
                payments: investment.get("payments"),
                moratory: investment.get("moratory"),
                amortize: investment.get("amortize"),
                interest_to_earn: investment.get("interest_to_earn"),
                paid_already: investment.get("paid_already"),
                to_be_paid: investment.get("to_be_paid"),
              },
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
      args: {
        ...forwardConnectionArgs,
      },
      resolve: async (
        _root: unknown,
        args: unknown,
        { client, id }: Context
      ): Promise<Connection<TransactionCassandra>> => {
        const { first, after } = args as ConnectionArguments;
        try {
          if (!id) {
            throw new Error("Do not return anything to not registered user");
          }
          const transaction_id = unbase64(after || "");
          const limit = first ? first + 1 : 0;
          if (limit <= 0) {
            throw new Error("Se requiere que 'first' sea un entero positivo");
          }
          const result = await client.execute(
            `SELECT * FROM fintech.transactions_by_user WHERE user_id = ${id}${
              transaction_id ? ` AND id < ${transaction_id}` : ""
            } LIMIT ${limit}`
          );
          const edgesMapped = result.rows.map((transaction) => {
            return {
              cursor: base64(transaction._id.toHexString()),
              node: {
                id: transaction.get("id"),
                user_id: transaction.get("user_id"),
                type: transaction.get("type"),
                quantity: transaction.get("quantity"),
                borrower_id: transaction.get("borrower_id"),
                loan_id: transaction.get("loan_id"),
                created_at: transaction.get("created_at"),
              },
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
    loansFinancing: {
      type: new GraphQLNonNull(LoanConnection),
      args: forwardConnectionArgs,
      resolve: async (
        _root: unknown,
        args: unknown,
        { client }: Context
      ): Promise<Connection<LoanCassandra>> => {
        const { after, first } = args as ArgsLoans;
        try {
          const loan_id = unbase64(after || "");
          const limit = first ? first + 1 : 0;
          if (limit <= 0) {
            throw new Error("Se requiere que 'first' sea un entero positivo");
          }
          const result = await client.execute(
            `SELECT * FROM fintech.loans_by_status WHERE status = "financing"${
              loan_id ? ` AND id < ${loan_id}` : ""
            } LIMIT ${limit}`
          );
          const edgesMapped = result.rows.map((loan) => {
            return {
              cursor: base64(loan._id.toHexString()),
              node: {
                id: loan.get("id"),
                user_id: loan.get("user_id"),
                score: loan.get("score"),
                roi: loan.get("roi"),
                goal: loan.get("goal"),
                term: loan.get("term"),
                raised: loan.get("raised"),
                expiry: loan.get("expiry"),
                status: loan.get("status"),
                pending: loan.get("pending"),
                payments_done: loan.get("payments_done"),
                payments_delayed: loan.get("payments_delayed"),
              },
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
