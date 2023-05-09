import { mutationWithClientMutationId } from "graphql-relay";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { Context } from "../types";
import bcrypt from "bcryptjs";
import { REFRESHSECRET, ACCESSSECRET, NODE_ENV } from "../config";
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
  },
  mutateAndGetPayload: async (
    { email, password }: Input,
    {
      authusers,
      rdb,
      res,
      logins,
      ip,
      sessions,
      sessionId,
      deviceType,
      deviceName,
    }: Context
  ): Promise<Payload> => {
    try {
      const user = await authusers.findOne({ email });
      if (!user) throw new Error("El usuario no existe.");
      const blacklistedUser = await rdb?.get(user._id.toHexString());
      if (blacklistedUser) {
        throw new Error("El usuario estará bloqueado.");
      }
      const hash = await bcrypt.compare(password, user.password);
      if (!hash) throw new Error("La contraseña no coincide.");
      const now = new Date();
      const refreshTokenExpireTime = addMinutes(now, REFRESH_TOKEN_EXP_NUMBER);
      refreshTokenExpireTime.setMilliseconds(0);
      now.setMilliseconds(0);
      const refreshTokenExpireTimeInt = refreshTokenExpireTime.getTime() / 1000;
      const nowTime = now.getTime() / 1000;
      const refreshTokenExpiresIn = refreshTokenExpireTimeInt - nowTime;
      const refreshToken = jwt.sign(
        {
          id: user.id,
          isLender: user.isLender,
          isBorrower: user.isBorrower,
          isSupport: user.isSupport,
          refreshTokenExpireTime: refreshTokenExpireTimeInt,
        },
        REFRESHSECRET,
        { expiresIn: refreshTokenExpiresIn }
      );
      const accessToken = jwt.sign(
        {
          id: user.id,
          isLender: user.isLender,
          isBorrower: user.isBorrower,
          isSupport: user.isSupport,
          refreshTokenExpireTime: refreshTokenExpireTimeInt,
        },
        ACCESSSECRET,
        { expiresIn: ACCESS_TOKEN_EXP_STRING }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        expires: refreshTokenExpireTime,
        secure: NODE_ENV === "production" ? true : false,
      });
      res?.setHeader("accessToken", accessToken);
      await logins.insertOne({
        applicationName: "Lerna Monorepo",
        address: ip || "",
        time: now,
        userId: user.id,
      });
      await sessions.updateOne(
        { sessionId },
        {
          $set: {
            lastTimeAccessed: now,
          },
          $setOnInsert: {
            applicationName: "Lerna Monorepo",
            type: deviceType,
            deviceName: deviceName,
            sessionId,
            address: ip,
            userId: user.id,
          },
        },
        { upsert: true }
      );
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
