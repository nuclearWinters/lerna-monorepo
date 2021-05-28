import { ObjectID } from "bson";
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
  ConnectionArguments,
  connectionFromArray,
  ForwardConnectionArgs,
} from "graphql-relay";
import { FilterQuery } from "mongodb";
import { BucketTransactionConnection } from "./Nodes";
import { Context, BucketTransactionMongo } from "./types";
import { base64, refreshTokenMiddleware, unbase64 } from "./utils";

interface IQuery {
  type: GraphQLNonNull<GraphQLNullableType>;
  args: GraphQLFieldConfigArgumentMap &
    ForwardConnectionArgs &
    BackwardConnectionArgs;
  resolve: (
    root: { [argName: string]: string },
    args: { [argName: string]: string },
    ctx: Context
  ) => Promise<Connection<BucketTransactionMongo>>;
}

interface Args extends ConnectionArguments {
  user_id?: string | null;
}

export const QueryTransactions: IQuery = {
  type: new GraphQLNonNull(BucketTransactionConnection),
  args: {
    user_id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    ...connectionArgs,
  },
  resolve: async (
    _,
    args: Args,
    { transactions, accessToken, refreshToken }
  ): Promise<Connection<BucketTransactionMongo>> => {
    try {
      const { _id } = await refreshTokenMiddleware(accessToken, refreshToken);
      if (args.user_id !== _id) {
        throw new Error("No es el mismo usuario.");
      }
      const transaction_id = unbase64(args.after || "");
      const limit = args.first ? args.first + 1 : 0;
      if (limit <= 0) {
        throw new Error("Se requiere que 'first' sea un entero positivo");
      }
      const query: FilterQuery<BucketTransactionMongo> = {
        _id_user: new ObjectID(_id),
      };
      if (transaction_id) {
        query._id = { $lt: transaction_id };
      }
      const result = await transactions
        .find(query)
        .limit(limit)
        .sort({ $natural: -1 })
        .toArray();
      const edgesMapped = result.map((loan) => {
        return {
          cursor: base64(loan._id),
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
