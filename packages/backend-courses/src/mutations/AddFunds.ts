import { fromGlobalId, mutationWithClientMutationId } from "graphql-relay";
import { GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";
import { Context } from "../types";
import { ObjectId } from "mongodb";
import { refreshTokenMiddleware } from "../utils";
import { MXNScalarType } from "../Nodes";

interface Input {
  user_gid: string;
  quantity: number;
}

type Payload = {
  validAccessToken: string;
  error: string;
};

export const AddFundsMutation = mutationWithClientMutationId({
  name: "AddFunds",
  description:
    "Añade fondos a tu cuenta: recibe el usuario actualziao y obtén un AccessToken valido.",
  inputFields: {
    user_gid: { type: new GraphQLNonNull(GraphQLID) },
    quantity: { type: new GraphQLNonNull(MXNScalarType) },
  },
  outputFields: {
    error: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ error }: Payload): string => error,
    },
    validAccessToken: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ validAccessToken }: Payload): string => validAccessToken,
    },
  },
  mutateAndGetPayload: async (
    { user_gid, quantity }: Input,
    { users, accessToken, transactions, refreshToken }: Context
  ): Promise<Payload> => {
    try {
      const { id: user_id } = fromGlobalId(user_gid);
      const { _id, validAccessToken } = await refreshTokenMiddleware(
        accessToken,
        refreshToken
      );
      if (user_id !== _id) {
        throw new Error("No es el mismo usuario.");
      }
      const result = await users.updateOne(
        { _id: new ObjectId(user_id), accountAvailable: { $gte: -quantity } },
        { $inc: { accountAvailable: quantity } }
      );
      if (!result.modifiedCount) {
        throw new Error("No cuentas con fondos suficientes.");
      }
      transactions.updateOne(
        { _id: new RegExp(`^${user_id}`), count: { $lt: 5 } },
        {
          $push: {
            history: {
              _id: new ObjectId(),
              type: quantity > 0 ? "CREDIT" : "WITHDRAWAL",
              quantity,
              created: new Date(),
            },
          },
          $inc: { count: 1 },
          $setOnInsert: {
            _id: `${user_id}_${new Date().getTime()}`,
            _id_user: new ObjectId(user_id),
          },
        },
        { upsert: true }
      );
      return { validAccessToken, error: "" };
    } catch (e) {
      return { validAccessToken: "", error: e.message };
    }
  },
});
