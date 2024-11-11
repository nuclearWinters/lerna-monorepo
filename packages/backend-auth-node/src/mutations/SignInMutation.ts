import { mutationWithClientMutationId } from "graphql-relay";
import { GraphQLNonNull, GraphQLString } from "graphql";
import type { Context } from "../types.ts";
import bcrypt from "bcryptjs";
import {
  ACCESS_TOKEN_EXP_NUMBER,
  REFRESH_TOKEN_EXP_NUMBER,
  REFRESHSECRET,
  ACCESSSECRET,
  IS_PRODUCTION,
} from "@repo/utils";
import { jwt } from "@repo/jwt-utils";
import { serialize } from "cookie";
import { parse as woothee } from "woothee";

interface Input {
  email: string;
  password: string;
}

type Payload = {
  error: string;
};

export const SignInMutation = mutationWithClientMutationId<
  Input,
  Payload,
  Context
>({
  name: "SignIn",
  description: "Obtén un Refresh Token y un AccessToken.",
  inputFields: {
    password: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    error: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ error }): string => error,
    },
  },
  mutateAndGetPayload: async (
    { email, password },
    { authusers, rdb, res, logins, ip, sessions, userAgent }
  ) => {
    try {
      const user = await authusers.findOne({ email });
      if (!user) throw new Error("User do not exists");
      const isBlacklisted = await rdb.get(user._id.toHexString());
      if (isBlacklisted) {
        throw new Error("User is suspended");
      }
      const hash = await bcrypt.compare(password, user.password);
      if (!hash) throw new Error("Incorrect password");
      const now = new Date();
      now.setMilliseconds(0);
      const nowTime = now.getTime() / 1000;
      const refreshTokenExpireTime = nowTime + REFRESH_TOKEN_EXP_NUMBER;
      const accessTokenExpireTime = nowTime + ACCESS_TOKEN_EXP_NUMBER;
      const refreshToken = jwt.sign(
        {
          id: user.id,
          isLender: user.isLender,
          isBorrower: user.isBorrower,
          isSupport: user.isSupport,
          refreshTokenExpireTime: refreshTokenExpireTime,
          exp: refreshTokenExpireTime,
        },
        REFRESHSECRET
      );
      const accessToken = jwt.sign(
        {
          id: user.id,
          isLender: user.isLender,
          isBorrower: user.isBorrower,
          isSupport: user.isSupport,
          refreshTokenExpireTime: refreshTokenExpireTime,
          exp: accessTokenExpireTime,
        },
        ACCESSSECRET
      );
      const refreshTokenExpireDate = new Date(refreshTokenExpireTime * 1000);
      res.appendHeader(
        "Set-Cookie",
        serialize("refreshToken", refreshToken, {
          httpOnly: true,
          expires: refreshTokenExpireDate,
          secure: true,
          sameSite: IS_PRODUCTION ? "strict" : "none",
          domain: IS_PRODUCTION ? "relay-graphql-monorepo.com" : undefined,
        })
      );
      res.setHeader("accessToken", accessToken);
      await logins.insertOne({
        applicationName: "Lerna Monorepo",
        address: ip || "",
        time: now,
        userId: user.id,
      });
      const data = woothee(userAgent);
      const deviceOS = `${data.os} ${data.version}`;
      const deviceBrowser = `${data.category} ${data.name} ${data.version} ${data.vendor}`;
      await sessions.insertOne({
        refreshToken,
        lastTimeAccessed: now,
        applicationName: "Lerna Monorepo",
        deviceOS,
        deviceBrowser,
        address: ip || "",
        userId: user.id,
        expirationDate: refreshTokenExpireDate,
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
