import {
  GraphQLFieldConfigArgumentMap,
  GraphQLNonNull,
  GraphQLNullableType,
} from "graphql";
import {
  BackwardConnectionArgs,
  Connection,
  connectionArgs,
  ConnectionArguments,
  connectionFromArray,
  ForwardConnectionArgs,
} from "graphql-relay";
import { LoanConnection } from "./Nodes";
import { Context, LoanMongo } from "./types";
import { base64, getContext, unbase64 } from "./utils";

interface IQueryLoans {
  type: GraphQLNonNull<GraphQLNullableType>;
  args: GraphQLFieldConfigArgumentMap &
    ForwardConnectionArgs &
    BackwardConnectionArgs;
  resolve: (
    root: { [argName: string]: string },
    args: { [argName: string]: string },
    ctx: Context
  ) => Promise<Connection<LoanMongo>>;
}

const QueryLoans: IQueryLoans = {
  type: new GraphQLNonNull(LoanConnection),
  args: connectionArgs,
  resolve: async (
    _,
    args: ConnectionArguments,
    ctx
  ): Promise<Connection<LoanMongo>> => {
    try {
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
};

export { QueryLoans };
