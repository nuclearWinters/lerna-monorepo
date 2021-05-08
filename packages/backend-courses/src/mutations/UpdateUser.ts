import { fromGlobalId, mutationWithClientMutationId } from "graphql-relay";
import { GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLID } from "graphql";
import { Context, UserMongo } from "../types";
import { ObjectID } from "mongodb";
import { getContext, refreshTokenMiddleware } from "../utils";
import { GraphQLUser } from "../Nodes";

interface Input {
  refreshToken: string;
  id: string;
  name: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  RFC: string;
  CURP: string;
  clabe: string;
  mobile: string;
  accountTotal: number;
  accountAvailable: number;
}

type Payload = {
  validAccessToken: string;
  user: UserMongo | null;
  error: string;
};

export const UpdateUserMutation = mutationWithClientMutationId({
  name: "UpdateUser",
  description:
    "Actualiza los datos personales un nuevo usuario y obtén un AccessToken.",
  inputFields: {
    refreshToken: { type: GraphQLNonNull(GraphQLString) },
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString },
    apellidoMaterno: { type: GraphQLString },
    apellidoPaterno: { type: GraphQLString },
    RFC: { type: GraphQLString },
    CURP: { type: GraphQLString },
    clabe: { type: GraphQLString },
    mobile: { type: GraphQLString },
    accountTotal: { type: GraphQLInt },
    accountAvailable: { type: GraphQLInt },
  },
  outputFields: {
    error: {
      type: GraphQLString,
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
    { refreshToken, id, ...user }: Input,
    ctx: Context
  ): Promise<Payload> => {
    try {
      const { id: o_id } = fromGlobalId(id);
      const { users, accessToken } = getContext(ctx);
      const { _id, validAccessToken } = await refreshTokenMiddleware(
        accessToken,
        refreshToken
      );
      if (o_id !== _id) {
        throw new Error("No es el mismo usuario.");
      }
      const result = await users.findOneAndUpdate(
        { _id: new ObjectID(o_id) },
        { $set: user },
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
