import { ObjectID } from "mongodb";
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
import { base64, unbase64 } from "./utils";

interface IQuery {
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

export const QueryLoans: IQuery = {
  type: new GraphQLNonNull(LoanConnection),
  args: connectionArgs,
  resolve: async (
    _,
    args: ConnectionArguments,
    { loans }
  ): Promise<Connection<LoanMongo>> => {
    try {
      const loan_id = unbase64(args.after || "");
      const limit = args.first ? args.first + 1 : 0;
      if (limit <= 0) {
        throw new Error("Se requiere que 'first' sea un entero positivo");
      }
      const result = await (loan_id
        ? loans
            .find({ _id: { $lt: new ObjectID(loan_id) } })
            .limit(limit)
            .sort({ $natural: -1 })
            .toArray()
        : loans.find().limit(limit).sort({ $natural: -1 }).toArray());
      const edgesMapped = result.map((loan) => {
        return {
          cursor: base64(loan._id.toHexString()),
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
