import { mutationWithClientMutationId } from "graphql-relay";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { Context } from "../types";
import bcrypt from "bcryptjs";
import { REFRESHSECRET, ACCESSSECRET, NODE_ENV } from "../config";
import {
  ACCESS_TOKEN_EXP_NUMBER,
  jwt,
  REFRESH_TOKEN_EXP_NUMBER,
} from "../utils";
import { serialize } from "cookie";

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
    { authusers, rdb, req, logins, ip, sessions, deviceType, deviceName }
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
      req.context.res.appendHeader(
        "Set-Cookie",
        serialize("refreshToken", refreshToken, {
          httpOnly: true,
          expires: refreshTokenExpireDate,
          secure: true,
          sameSite: NODE_ENV === "production" ? "lax" : "none",
        })
      );
      req.context.res.setHeader("accessToken", accessToken);
      await logins.insertOne({
        applicationName: "Lerna Monorepo",
        address: ip || "",
        time: now,
        userId: user.id,
      });
      await sessions.insertOne({
        refreshToken,
        lastTimeAccessed: now,
        applicationName: "Lerna Monorepo",
        type: deviceType,
        deviceName: deviceName,
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
