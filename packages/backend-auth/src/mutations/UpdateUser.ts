import { fromGlobalId, mutationWithClientMutationId } from "graphql-relay";
import { GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";
import { Context, UserMongo } from "../types";
import { ObjectId } from "mongodb";
import { refreshTokenMiddleware } from "../utils";
import { Languages } from "./SignUpMutation";
import { GraphQLAuthUser } from "../AuthUserQuery";

interface Input {
  user_gid: string;
  name: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  RFC: string;
  CURP: string;
  clabe: string;
  mobile: string;
  email: string;
  language: "es" | "en" | "default";
}

type Payload = {
  validAccessToken: string;
  error: string;
  authUser: UserMongo | null;
};

export const UpdateUserMutation = mutationWithClientMutationId({
  name: "UpdateUser",
  description:
    "Actualiza los datos personales: recibe el usuario actualizado y obtén un AccessToken valido. Datos disponibles: name, apellidoPaterno, apellidoMaterno, id, RFC, CURP, clabe, mobile, email y language",
  inputFields: {
    user_gid: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    apellidoMaterno: { type: new GraphQLNonNull(GraphQLString) },
    apellidoPaterno: { type: new GraphQLNonNull(GraphQLString) },
    RFC: { type: new GraphQLNonNull(GraphQLString) },
    CURP: { type: new GraphQLNonNull(GraphQLString) },
    clabe: { type: new GraphQLNonNull(GraphQLString) },
    mobile: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    language: { type: new GraphQLNonNull(Languages) },
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
    authUser: {
      type: new GraphQLNonNull(GraphQLAuthUser),
      resolve: ({ validAccessToken }: Payload): string => validAccessToken,
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
      const _id_user = new ObjectId(user_id);
      const result = await users.updateOne({ _id: _id_user }, { $set: user });
      if (!result.modifiedCount) {
        throw new Error("No user found.");
      }
      return {
        validAccessToken,
        error: "",
        authUser: {
          ...user,
          _id: _id_user,
          isSupport: false,
          isLender: false,
          isBorrower: false,
          password: "",
        },
      };
    } catch (e) {
      return { validAccessToken: "", error: e.message, authUser: null };
    }
  },
});
