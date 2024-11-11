import { mutationWithClientMutationId } from "graphql-relay";
import { GraphQLString, GraphQLNonNull } from "graphql";
import type { Context } from "../types.ts";
import { Languages } from "./SignUpMutation.ts";
import { GraphQLAuthUser } from "../AuthUserQuery.ts";
import type { AuthUserMongo } from "@repo/mongo-utils";

interface Input {
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
  error: string;
  authUser: AuthUserMongo | null;
};

export const UpdateUserMutation = mutationWithClientMutationId({
  name: "UpdateUser",
  description:
    "Actualiza los datos personales: recibe el usuario actualizado y obtén un AccessToken valido. Datos disponibles: name, apellidoPaterno, apellidoMaterno, id, RFC, CURP, clabe, mobile, email y language",
  inputFields: {
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
    authUser: {
      type: GraphQLAuthUser,
      resolve: ({ authUser }: Payload): AuthUserMongo | null => authUser,
    },
  },
  mutateAndGetPayload: async (
    user: Input,
    { authusers, id }: Context
  ): Promise<Payload> => {
    try {
      if (!id) {
        throw new Error("Unauthenticated");
      }
      const result = await authusers.findOneAndUpdate(
        { id },
        { $set: user },
        { returnDocument: "after" }
      );
      if (!result) {
        throw new Error("User do not exists");
      }
      return {
        error: "",
        authUser: result,
      };
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : "",
        authUser: null,
      };
    }
  },
});
