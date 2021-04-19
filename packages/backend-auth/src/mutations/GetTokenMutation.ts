import { mutationWithClientMutationId } from "graphql-relay";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { Context } from "../types";
import bcrypt from "bcryptjs";
import { REFRESHSECRET, ACCESSSECRET } from "../config";
import { jwt } from "../utils";
import { getContext } from "../utils";

interface Input {
  email: string;
  password: string;
}

type Payload = {
  refreshToken: string;
  accessToken: string;
  error?: string;
};

export const GetTokenMutation = mutationWithClientMutationId({
  name: "GetToken",
  description: "Obtén un Refresh Token y un AccessToken.",
  inputFields: {
    password: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    error: {
      type: GraphQLString,
      resolve: ({ error }: Payload): string | null => error || null,
    },
    refreshToken: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ refreshToken }: Payload): string => refreshToken,
    },
    accessToken: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ accessToken }: Payload): string => accessToken,
    },
  },
  mutateAndGetPayload: async (
    { email, password }: Input,
    { req }: Context
  ): Promise<Payload> => {
    try {
      const { users } = getContext(req);
      const user = await users.findOne({ email });
      if (!user) throw new Error("El usuario no existe.");
      const hash = await bcrypt.compare(password, user.password);
      if (!hash) throw new Error("La contraseña no coincide.");
      const refreshToken = jwt.sign(
        { _id: user._id.toHexString(), email: user.email },
        REFRESHSECRET,
        { expiresIn: "45s" }
      );
      const accessToken = jwt.sign(
        { _id: user._id.toHexString(), email: user.email },
        ACCESSSECRET,
        { expiresIn: "15s" }
      );
      return {
        refreshToken,
        accessToken,
      };
    } catch (e) {
      return {
        error: e.message,
        refreshToken: "",
        accessToken: "",
      };
    }
  },
});
