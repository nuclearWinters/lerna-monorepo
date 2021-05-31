import { mutationWithClientMutationId } from "graphql-relay";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { Context } from "../types";
import bcrypt from "bcryptjs";
import { REFRESHSECRET, ACCESSSECRET } from "../config";
import { jwt } from "../utils";

interface Input {
  email: string;
  password: string;
}

type Payload = {
  accessToken: string;
  refreshToken: string;
  error: string;
};

export const SignInMutation = mutationWithClientMutationId({
  name: "SignIn",
  description: "Obtén un Refresh Token y un AccessToken.",
  inputFields: {
    password: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    error: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ error }: Payload): string => error,
    },
    accessToken: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ accessToken }: Payload): string => accessToken,
    },
    refreshToken: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ refreshToken }: Payload): string => refreshToken,
    },
  },
  mutateAndGetPayload: async (
    { email, password }: Input,
    { users, rdb }: Context
  ): Promise<Payload> => {
    try {
      const user = await users.findOne({ email });
      if (!user) throw new Error("El usuario no existe.");
      const blacklistedUser = await rdb.get(user._id.toHexString());
      if (blacklistedUser) {
        throw new Error("El usuario estará bloqueado por una hora.");
      }
      const hash = await bcrypt.compare(password, user.password);
      if (!hash) throw new Error("La contraseña no coincide.");
      const refreshToken = jwt.sign(
        { ...user, _id: user._id.toHexString() },
        REFRESHSECRET,
        { expiresIn: "1h" }
      );
      const accessToken = jwt.sign(
        { ...user, _id: user._id.toHexString() },
        ACCESSSECRET,
        { expiresIn: "15m" }
      );
      return {
        error: "",
        accessToken,
        refreshToken,
      };
    } catch (e) {
      return {
        error: e.message,
        accessToken: "",
        refreshToken: "",
      };
    }
  },
});
