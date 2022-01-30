import { Filter, ObjectId } from "mongodb";
import { GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import {
  Connection,
  connectionArgs,
  ConnectionArguments,
  connectionFromArray,
} from "graphql-relay";
import { LoanConnection, LoanStatus } from "./Nodes";
import { Context, ILoanStatus, LoanMongo } from "./types";
import { base64, unbase64 } from "./utils";

interface Args extends ConnectionArguments {
  status?: ILoanStatus[];
  borrower_id?: string;
}

export const QueryLoans = {
  type: new GraphQLNonNull(LoanConnection),
  args: {
    borrower_id: {
      type: GraphQLString,
    },
    status: {
      type: new GraphQLList(new GraphQLNonNull(LoanStatus)),
    },
    ...connectionArgs,
  },
  resolve: async (
    _root: unknown,
    args: unknown,
    { loans }: Context
  ): Promise<Connection<LoanMongo>> => {
    const { status, after, first, borrower_id } = args as Args;
    try {
      const loan_id = unbase64(after || "");
      const limit = first ? first + 1 : 0;
      if (limit <= 0) {
        throw new Error("Se requiere que 'first' sea un entero positivo");
      }
      const query: Filter<LoanMongo> = { status: "financing" };
      if (loan_id) {
        query._id = { $lt: new ObjectId(loan_id) };
      }
      if (status) {
        query.status = { $in: status };
      }
      if (borrower_id) {
        query._id_user = new ObjectId(borrower_id);
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
};
