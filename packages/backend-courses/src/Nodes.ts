import { ObjectID } from "bson";
import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} from "graphql";
import {
  fromGlobalId,
  globalIdField,
  nodeDefinitions,
  connectionDefinitions,
  connectionArgs,
  connectionFromArray,
  ConnectionArguments,
  Connection,
} from "graphql-relay";
import { RootUser, Context, LoanMongo } from "./types";
import { getContext, base64, unbase64 } from "./utils";

const { nodeInterface, nodeField } = nodeDefinitions(
  async (globalId, ctx) => {
    const { type, id } = fromGlobalId(globalId);
    const { users } = getContext(ctx);
    if (type === "User") {
      const user = await users.findOne({ _id: new ObjectID(id) });
      const typedUser = { ...user, type };
      return typedUser;
    }
    return null;
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

export const GraphQLLoan = new GraphQLObjectType({
  name: "Loan",
  fields: {
    id: globalIdField("Loan", ({ _id }): string => _id),
    user_id: {
      type: GraphQLNonNull(GraphQLString),
      resolve: ({ user_id }) => user_id,
    },
    score: {
      type: GraphQLNonNull(GraphQLInt),
      resolve: ({ score }) => score,
    },
    rate: {
      type: GraphQLNonNull(GraphQLInt),
      resolve: ({ rate }) => rate,
    },
    total: {
      type: GraphQLNonNull(GraphQLInt),
      resolve: ({ total }) => total,
    },
    term: {
      type: GraphQLNonNull(GraphQLInt),
      resolve: ({ term }) => term,
    },
    need: {
      type: GraphQLNonNull(GraphQLInt),
      resolve: ({ need }) => need,
    },
    ends: {
      type: GraphQLNonNull(GraphQLInt),
      resolve: ({ ends }) => ends,
    },
    lend: {
      type: GraphQLNonNull(GraphQLInt),
      resolve: ({ lend }) => lend,
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
    loans: {
      type: new GraphQLNonNull(LoanConnection),
      args: connectionArgs,
      resolve: async (
        user,
        args: ConnectionArguments,
        ctx
      ): Promise<Connection<LoanMongo>> => {
        try {
          if (!user._id) {
            throw new Error("No user");
          }
          const { loans } = getContext(ctx);
          const offset = unbase64(args.after || "YXJyYXljb25uZWN0aW9uOjA=");
          const skip = Number(offset) === 0 ? 0 : Number(offset) + 1;
          const limit = args.first ? args.first + 1 : 0;
          if (limit === 0) {
            throw new Error("Se requiere 'first'");
          }
          const result = await loans.find().skip(skip).limit(limit).toArray();
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
    email: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ email }): string => email,
    },
    accountTotal: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: ({ accountTotal }): number => accountTotal,
    },
    accountAvailable: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: ({ accountAvailable }): number => accountAvailable,
    },
    error: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ error }): string => error,
    },
  },
  interfaces: [nodeInterface],
});

export { GraphQLUser, nodeField, GraphQLLoanEdge };
