import {
  GraphQLFieldConfigArgumentMap,
  GraphQLNonNull,
  GraphQLNullableType,
  GraphQLString,
} from "graphql";
import {
  BackwardConnectionArgs,
  Connection,
  connectionArgs,
  connectionFromArray,
  ForwardConnectionArgs,
  ConnectionArguments,
} from "graphql-relay";
import { InvestmentConnection } from "./Nodes";
import { Context, InvestmentMongo } from "./types";
import { base64, getContext, refreshTokenMiddleware, unbase64 } from "./utils";

interface IQuery {
  type: GraphQLNonNull<GraphQLNullableType>;
  args: GraphQLFieldConfigArgumentMap &
    ForwardConnectionArgs &
    BackwardConnectionArgs;
  resolve: (
    root: { [argName: string]: string },
    args: { [argName: string]: string },
    ctx: Context
  ) => Promise<Connection<InvestmentMongo>>;
}

interface Args extends ConnectionArguments {
  user_id?: string | null;
  refreshToken?: string | null;
}

export const QueryInvestments: IQuery = {
  type: new GraphQLNonNull(InvestmentConnection),
  args: {
    user_id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    refreshToken: {
      type: new GraphQLNonNull(GraphQLString),
    },
    ...connectionArgs,
  },
  resolve: async (_, args: Args, ctx): Promise<Connection<InvestmentMongo>> => {
    try {
      const { investments, accessToken } = getContext(ctx);
      const { _id } = await refreshTokenMiddleware(
        accessToken,
        args.refreshToken || ""
      );
      if (args.user_id !== _id) {
        throw new Error("No es el mismo usuario.");
      }
      const offset = unbase64(args.after || "YXJyYXljb25uZWN0aW9uOjA=");
      const skip = Number(offset) === 0 ? 0 : Number(offset) + 1;
      const limit = args.first ? args.first + 1 : 0;
      if (limit === 0) {
        throw new Error("Se requiere 'first'");
      }
      const result = await investments
        .find()
        .skip(skip)
        .limit(limit)
        .sort({ $natural: -1 })
        .toArray();
      const edgesMapped = result.map((investment, idx) => {
        return {
          cursor: base64(String(skip + idx)),
          node: investment,
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
