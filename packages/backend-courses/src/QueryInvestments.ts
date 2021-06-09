import { FilterQuery, ObjectId } from "mongodb";
import {
  GraphQLFieldConfigArgumentMap,
  GraphQLList,
  GraphQLNonNull,
  GraphQLNullableType,
  GraphQLString,
} from "graphql";
import {
  Connection,
  connectionArgs,
  connectionFromArray,
  ConnectionArguments,
} from "graphql-relay";
import { InvestmentConnection, InvestmentStatus } from "./Nodes";
import { Context, IInvestmentStatus, InvestmentMongo } from "./types";
import { base64, refreshTokenMiddleware, unbase64 } from "./utils";

interface IQuery {
  type: GraphQLNonNull<GraphQLNullableType>;
  args: GraphQLFieldConfigArgumentMap;
  resolve: (
    root: { [argName: string]: string },
    args: { [argName: string]: string },
    ctx: Context
  ) => Promise<Connection<InvestmentMongo>>;
}

interface Args extends ConnectionArguments {
  user_id?: string | null;
  status?: IInvestmentStatus[];
}

export const QueryInvestments: IQuery = {
  type: new GraphQLNonNull(InvestmentConnection),
  args: {
    user_id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    status: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(InvestmentStatus))
      ),
    },
    ...connectionArgs,
  },
  resolve: async (
    _,
    { status, user_id, first, after }: Args,
    { investments, accessToken, refreshToken }
  ): Promise<Connection<InvestmentMongo>> => {
    try {
      const { _id } = await refreshTokenMiddleware(accessToken, refreshToken);
      if (user_id !== _id) {
        throw new Error("No es el mismo usuario.");
      }
      const investment_id = unbase64(after || "");
      const limit = first ? first + 1 : 0;
      if (limit <= 0) {
        throw new Error("Se requiere que 'first' sea un entero positivo");
      }
      const query: FilterQuery<InvestmentMongo> = {
        _id_lender: new ObjectId(_id),
        status: { $in: ["delay payment", "up to date"] },
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
    } catch (e) {
      return connectionFromArray([], { first, after });
    }
  },
};
