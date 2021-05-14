import { ObjectID } from "bson";
import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLScalarType,
  Kind,
  GraphQLEnumType,
  GraphQLList,
} from "graphql";
import {
  fromGlobalId,
  globalIdField,
  nodeDefinitions,
  connectionDefinitions,
  connectionArgs,
  ConnectionArguments,
  Connection,
  connectionFromArray,
} from "graphql-relay";
import {
  RootUser,
  Context,
  LoanMongo,
  TransactionMongo,
  BucketTransactionMongo,
} from "./types";
import { base64, getContext, unbase64 } from "./utils";

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

const TransactionType = new GraphQLEnumType({
  name: "TransactionType",
  values: {
    CREDIT: { value: "CREDIT" },
    WITHDRAWAL: { value: "WITHDRAWAL" },
    INVEST: { value: "INVEST" },
  },
});

const { nodeInterface, nodeField } = nodeDefinitions(
  async (globalId, ctx) => {
    const { type, id } = fromGlobalId(globalId);
    const { users, loans } = getContext(ctx);
    if (type === "User") {
      const user = await users.findOne({ _id: new ObjectID(id) });
      if (!user) {
        return { type: "" };
      }
      const typedUser = { ...user, type };
      return typedUser;
    } else if (type === "Loan") {
      const loan = await loans.findOne({ _id: new ObjectID(id) });
      if (!loan) {
        return { type: "" };
      }
      const typedUser = { ...loan, type };
      return typedUser;
    } else {
      return { type: "" };
    }
  },
  (obj: { type: string }): GraphQLObjectType | null => {
    switch (obj.type) {
      case "Loan":
        return GraphQLLoan;
      case "User":
        return GraphQLUser;
      default:
        return null;
    }
  }
);

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
      resolve: ({ type }): "CREDIT" | "WITHDRAWAL" | "INVEST" => type,
    },
  },
});

export const GraphQLBucketTransaction = new GraphQLObjectType<BucketTransactionMongo>(
  {
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
  }
);

const {
  connectionType: BucketTransactionConnection,
  edgeType: GraphQLBucketTransactionEdge,
} = connectionDefinitions({
  name: "BucketTransaction",
  nodeType: GraphQLBucketTransaction,
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
  },
  interfaces: [nodeInterface],
});

const {
  connectionType: LoanConnection,
  edgeType: GraphQLLoanEdge,
} = connectionDefinitions({
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
    transactions: {
      type: new GraphQLNonNull(BucketTransactionConnection),
      args: connectionArgs,
      resolve: async (
        _,
        args: ConnectionArguments,
        ctx
      ): Promise<Connection<BucketTransactionMongo>> => {
        try {
          const { transactions } = getContext(ctx);
          const offset = unbase64(args.after || "YXJyYXljb25uZWN0aW9uOjA=");
          const skip = Number(offset) === 0 ? 0 : Number(offset) + 1;
          const limit = args.first ? args.first + 1 : 0;
          if (limit === 0) {
            throw new Error("Se requiere 'first'");
          }
          const result = await transactions
            .find()
            .skip(skip)
            .limit(limit)
            .toArray();
          const edgesMapped = result.map((loan, idx) => {
            return {
              cursor: base64(String(skip + idx)),
              node: loan,
            };
          });
          const edges = edgesMapped.slice(0, args.first || 5);
          return {
            edges,
            pageInfo: {
              startCursor: edges[0]?.cursor || null,
              endCursor: edges[edges.length - 1]?.cursor || null,
              hasPreviousPage: false,
              hasNextPage: edgesMapped.length > (args.first || 0),
            },
          };
        } catch (e) {
          return connectionFromArray([], args);
        }
      },
    },
    error: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ error }): string => error,
    },
  },
  interfaces: [nodeInterface],
});

export {
  GraphQLUser,
  nodeField,
  GraphQLLoanEdge,
  LoanConnection,
  GraphQLBucketTransactionEdge,
};
