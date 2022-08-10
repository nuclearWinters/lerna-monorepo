import { mutationWithClientMutationId } from "graphql-relay";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { Context } from "../types";
import bcrypt from "bcryptjs";
import { REFRESHSECRET, ACCESSSECRET } from "../config";
import {
  ACCESS_TOKEN_EXP_STRING,
  jwt,
  REFRESH_TOKEN_EXP_NUMBER,
} from "../utils";
import { addMinutes } from "date-fns";

interface Input {
  email: string;
  password: string;
}

type Payload = {
  accessToken: string;
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
  },
  mutateAndGetPayload: async (
    { email, password }: Input,
    { users, rdb, res }: Context
  ): Promise<Payload> => {
    try {
      const user = await users.findOne({ email });
      if (!user) throw new Error("El usuario no existe.");
      const blacklistedUser = await rdb.get(user._id.toHexString());
      if (blacklistedUser) {
        throw new Error("El usuario estará bloqueado.");
      }
      const hash = await bcrypt.compare(password, user.password);
      if (!hash) throw new Error("La contraseña no coincide.");
      const refreshTokenExpireTime = addMinutes(
        new Date(),
        REFRESH_TOKEN_EXP_NUMBER
      );
      refreshTokenExpireTime.setMilliseconds(0);
      const refreshToken = jwt.sign(
        {
          id: user.id,
          isLender: user.isLender,
          isBorrower: user.isBorrower,
          isSupport: user.isSupport,
        },
        REFRESHSECRET,
        { expiresIn: refreshTokenExpireTime.getTime() / 1000 }
      );
      const accessToken = jwt.sign(
        {
          id: user.id,
          isLender: user.isLender,
          isBorrower: user.isBorrower,
          isSupport: user.isSupport,
        },
        ACCESSSECRET,
        { expiresIn: ACCESS_TOKEN_EXP_STRING }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        expires: refreshTokenExpireTime,
        path: "/",
        sameSite: "strict",
        //secure: true,
      });
      return {
        error: "",
        accessToken,
      };
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : "",
        accessToken: "",
      };
    }
  },
});
