import { mutationWithClientMutationId } from "graphql-relay";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { Context } from "../types";
import { ACCESSSECRET, NODE_ENV, REFRESHSECRET } from "../config";
import {
  ACCESS_TOKEN_EXP_NUMBER,
  jwt,
  REFRESH_TOKEN_EXP_NUMBER,
} from "../utils";
import { serialize } from "cookie";

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
    _: unknown,
    { rdb, refreshToken, id, req }: Context
  ): Promise<Payload> => {
    try {
      if (!id) {
        throw new Error("Unauthenticated");
      }
      if (!refreshToken) {
        throw new Error("Do not have Refresh Token");
      }
      const user = jwt.verify(refreshToken, REFRESHSECRET);
      if (!user) throw new Error("User do not exists");

      const isBlacklisted = await rdb?.get(refreshToken);
      if (isBlacklisted) {
        throw new Error("User is suspended");
      }
      const { isBorrower, isLender, isSupport } = user;
      const now = new Date();
      now.setMilliseconds(0);
      const nowTime = now.getTime() / 1000;
      const refreshTokenExpireTime = nowTime + REFRESH_TOKEN_EXP_NUMBER;
      const accessTokenExpireTime = nowTime + ACCESS_TOKEN_EXP_NUMBER;
      const newRefreshToken = jwt.sign(
        {
          id,
          isLender,
          isBorrower,
          isSupport,
          refreshTokenExpireTime,
          exp: refreshTokenExpireTime,
        },
        REFRESHSECRET
      );
      const refreshTokenExpireDate = new Date(refreshTokenExpireTime * 1000);
      req.context.res.appendHeader(
        "Set-Cookie",
        serialize("refreshToken", newRefreshToken, {
          httpOnly: true,
          expires: refreshTokenExpireDate,
          secure: true,
          sameSite: NODE_ENV === "production" ? "lax" : "none",
        })
      );
      const accessToken = jwt.sign(
        {
          id,
          isBorrower,
          isLender,
          isSupport,
          refreshTokenExpireTime,
          exp: accessTokenExpireTime,
        },
        ACCESSSECRET
      );
      req.context.res.setHeader("accessToken", accessToken);
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
