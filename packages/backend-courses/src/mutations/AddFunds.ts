import { fromGlobalId, mutationWithClientMutationId } from "graphql-relay";
import { GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLID } from "graphql";
import { Context, UserMongo } from "../types";
import { ObjectID } from "mongodb";
import { getContext, refreshTokenMiddleware } from "../utils";
import { GraphQLUser } from "../Nodes";

interface Input {
  refreshToken: string;
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
    refreshToken: { type: new GraphQLNonNull(GraphQLString) },
    user_gid: { type: new GraphQLNonNull(GraphQLID) },
    quantity: { type: new GraphQLNonNull(GraphQLInt) },
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
    { refreshToken, user_gid, quantity }: Input,
    ctx: Context
  ): Promise<Payload> => {
    try {
      const { id: user_id } = fromGlobalId(user_gid);
      const { users, accessToken } = getContext(ctx);
      const { _id, validAccessToken } = await refreshTokenMiddleware(
        accessToken,
        refreshToken
      );
      if (user_id !== _id) {
        throw new Error("No es el mismo usuario.");
      }
      const result = await users.findOneAndUpdate(
        { _id: new ObjectID(user_id) },
        { $inc: { accountTotal: quantity, accountAvailable: quantity } },
        { returnOriginal: false }
      );
      const updatedUser = result.value;
      if (!updatedUser) {
        throw new Error("El usuario no existe.");
      }
      return { validAccessToken, error: "", user: updatedUser };
    } catch (e) {
      return { validAccessToken: "", error: e.message, user: null };
    }
  },
});
