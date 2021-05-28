import { fromGlobalId, mutationWithClientMutationId } from "graphql-relay";
import { GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";
import { Context, UserMongo } from "../types";
import { ObjectID } from "mongodb";
import { refreshTokenMiddleware } from "../utils";
import { GraphQLUser } from "../Nodes";

interface Input {
  user_gid: string;
  name: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  RFC: string;
  CURP: string;
  clabe: string;
  mobile: string;
}

type Payload = {
  validAccessToken: string;
  user: UserMongo | null;
  error: string;
};

export const UpdateUserMutation = mutationWithClientMutationId({
  name: "UpdateUser",
  description:
    "Actualiza los datos personales: recibe el usuario actualizado y obtén un AccessToken valido.",
  inputFields: {
    user_gid: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString },
    apellidoMaterno: { type: GraphQLString },
    apellidoPaterno: { type: GraphQLString },
    RFC: { type: GraphQLString },
    CURP: { type: GraphQLString },
    clabe: { type: GraphQLString },
    mobile: { type: GraphQLString },
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
    { user_gid, ...user }: Input,
    { users, accessToken, refreshToken }: Context
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
      const result = await users.findOneAndUpdate(
        { _id: new ObjectID(user_id) },
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
