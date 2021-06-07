import { fromGlobalId, mutationWithClientMutationId } from "graphql-relay";
import { GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";
import { Context, UserMongo } from "../types";
import { ObjectId } from "mongodb";
import { refreshTokenMiddleware } from "../utils";
import { GraphQLUser, MXNScalarType } from "../Nodes";

interface Input {
  user_gid: string;
  quantity: number;
}

type Payload = {
  validAccessToken: string;
  user: UserMongo | null;
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
    user: {
      type: GraphQLUser,
      resolve: ({ user }: Payload): UserMongo | null => user,
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
      const resultUser = await users.findOneAndUpdate(
        { _id: new ObjectId(user_id) },
        { $inc: { accountAvailable: quantity } },
        { returnDocument: "after" }
      );
      const updatedUser = resultUser.value;
      if (!updatedUser) {
        throw new Error("El usuario no existe.");
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
      return { validAccessToken, error: "", user: updatedUser };
    } catch (e) {
      return { validAccessToken: "", error: e.message, user: null };
    }
  },
});
