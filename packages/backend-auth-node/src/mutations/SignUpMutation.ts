import { mutationWithClientMutationId } from "graphql-relay";
import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLEnumType,
} from "graphql";
import type { Context } from "../types.ts";
import bcrypt from "bcryptjs";
import { serialize } from "cookie";
import {
  ACCESSSECRET,
  IS_PRODUCTION,
  REFRESHSECRET,
  ACCESS_TOKEN_EXP_NUMBER,
  REFRESH_TOKEN_EXP_NUMBER,
} from "@repo/utils";
import { jwt } from "@repo/jwt-utils";
import { createUser } from "@repo/grpc-utils";
import { parse as woothee } from "woothee";

interface Input {
  email: string;
  password: string;
  isLender: boolean;
  language: "en" | "es" | "default";
}

type Payload = {
  error: string;
};

export const Languages = new GraphQLEnumType({
  name: "Languages",
  values: {
    EN: { value: "en" },
    ES: { value: "es" },
    DEFAULT: { value: "default" },
  },
});

export const SignUpMutation = mutationWithClientMutationId({
  name: "SignUp",
  description:
    "Registra un nuevo usuario y obtén un Refresh Token y un AccessToken.",
  inputFields: {
    password: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    isLender: { type: new GraphQLNonNull(GraphQLBoolean) },
    language: { type: new GraphQLNonNull(Languages) },
  },
  outputFields: {
    error: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ error }: Payload): string => error,
    },
  },
  mutateAndGetPayload: async (
    { email, password, isLender, language }: Input,
    { authusers, res, logins, ip, sessions, userAgent, grpcClient }: Context
  ): Promise<Payload> => {
    try {
      const user = await authusers.findOne({ email });
      if (user) throw new Error("Email already in use");
      const hash_password = await bcrypt.hash(password, 12);
      const id = crypto.randomUUID();
      await authusers.insertOne({
        email,
        password: hash_password,
        isLender: isLender,
        isBorrower: !isLender,
        isSupport: false,
        language,
        name: "",
        apellidoMaterno: "",
        apellidoPaterno: "",
        RFC: "",
        CURP: "",
        clabe: "",
        mobile: "",
        id,
      });
      const now = new Date();
      now.setMilliseconds(0);
      const nowTime = now.getTime() / 1000;
      const refreshTokenExpireTime = nowTime + REFRESH_TOKEN_EXP_NUMBER;
      const accessTokenExpireTime = nowTime + ACCESS_TOKEN_EXP_NUMBER;
      const refreshToken = jwt.sign(
        {
          id,
          isBorrower: !isLender,
          isLender: isLender,
          isSupport: false,
          refreshTokenExpireTime,
          exp: refreshTokenExpireTime,
        },
        REFRESHSECRET
      );
      const accessToken = jwt.sign(
        {
          id,
          isBorrower: !isLender,
          isLender: isLender,
          isSupport: false,
          refreshTokenExpireTime,
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
      await createUser(id, grpcClient);
      await logins.insertOne({
        applicationName: "Lerna Monorepo",
        address: ip || "",
        time: now,
        userId: id,
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
        userId: id,
        expirationDate: refreshTokenExpireDate,
      });
      return { error: "" };
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : "",
      };
    }
  },
});
