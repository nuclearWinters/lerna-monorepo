import { mutationWithClientMutationId } from "graphql-relay";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { Context } from "../types";
import { ACCESSSECRET, NODE_ENV, REFRESHSECRET } from "../config";
import {
  ACCESS_TOKEN_EXP_NUMBER,
  jwt,
  REFRESH_TOKEN_EXP_NUMBER,
} from "../utils";
import { addMinutes, isAfter } from "date-fns";

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
    { rdb, refreshToken, id, res }: Context
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

      const blacklistedUserTime = await rdb?.get(refreshToken);
      if (blacklistedUserTime) {
        const time = new Date(Number(blacklistedUserTime) * 1000);
        const issuedTime = addMinutes(new Date(user.exp * 1000), -3);
        const loggedAfter = isAfter(issuedTime, time);
        if (!loggedAfter) {
          throw new Error("User is suspended");
        }
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
          refreshTokenExpireTime: refreshTokenExpireTime,
          exp: refreshTokenExpireTime,
        },
        REFRESHSECRET
      );
      const refreshTokenExpireDate = new Date(refreshTokenExpireTime * 1000);
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        expires: refreshTokenExpireDate,
        secure: NODE_ENV === "production" ? true : false,
      });
      const accessToken = jwt.sign(
        {
          id,
          isBorrower: !isLender,
          isLender: isLender,
          isSupport: false,
          refreshTokenExpireTime: refreshTokenExpireTime,
          exp: accessTokenExpireTime,
        },
        ACCESSSECRET
      );
      res?.setHeader("accessToken", accessToken);
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
