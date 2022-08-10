import { mutationWithClientMutationId } from "graphql-relay";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { Context } from "../types";
import { REFRESHSECRET } from "../config";
import { jwt, REFRESH_TOKEN_EXP_NUMBER } from "../utils";
import { addMinutes } from "date-fns";

interface Input {
  email: string;
  password: string;
}

type Payload = {
  error: string;
};

export const ExtendSessionMutation = mutationWithClientMutationId({
  name: "ExtendSession",
  description: "Obtén un Refresh Token nuevo.",
  inputFields: {},
  outputFields: {
    error: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ error }: Payload): string => error,
    },
  },
  mutateAndGetPayload: async (
    _input: Input,
    { rdb, refreshToken, id, res }: Context
  ): Promise<Payload> => {
    try {
      if (!refreshToken || !id) {
        throw new Error("No hay refreshToken o accessToken.");
      }
      const user = jwt.verify(refreshToken, REFRESHSECRET);
      if (!user) throw new Error("El usuario no existe.");
      const blacklistedUser = await rdb.get(user.id);
      if (blacklistedUser) {
        throw new Error("El usuario esta bloqueado.");
      }
      const { isBorrower, isLender, isSupport } = user;
      const expireTime = addMinutes(new Date(), REFRESH_TOKEN_EXP_NUMBER);
      expireTime.setMilliseconds(0);
      const newRefreshToken = jwt.sign(
        {
          id,
          isLender,
          isBorrower,
          isSupport,
        },
        REFRESHSECRET,
        { expiresIn: expireTime.getTime() / 1000 }
      );
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        expires: expireTime,
        path: "/",
        sameSite: "strict",
        //secure: true,
      });
      return {
        error: "",
      };
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : "",
      };
    }
  },
});
