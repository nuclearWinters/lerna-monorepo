import { ObjectId } from "bson";
import { GraphQLNonNull, GraphQLString } from "graphql";
import {
  Connection,
  connectionArgs,
  ConnectionArguments,
  connectionFromArray,
} from "graphql-relay";
import { Filter } from "mongodb";
import { BucketTransactionConnection } from "./Nodes";
import { Context, BucketTransactionMongo } from "./types";
import { base64, refreshTokenMiddleware, unbase64 } from "./utils";

interface Args extends ConnectionArguments {
  user_id?: string | null;
}

export const QueryTransactions = {
  type: new GraphQLNonNull(BucketTransactionConnection),
  args: {
    user_id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    ...connectionArgs,
  },
  resolve: async (
    _: unknown,
    argss: unknown,
    { transactions, accessToken, refreshToken }: Context
  ): Promise<Connection<BucketTransactionMongo>> => {
    const args = argss as Args;
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
      const query: Filter<BucketTransactionMongo> = {
        _id_user: new ObjectId(_id),
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
