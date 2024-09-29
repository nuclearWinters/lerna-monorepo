import { mutationWithClientMutationId } from "graphql-relay";
import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLEnumType,
} from "graphql";
import { Context } from "../types.js";
import bcrypt from "bcryptjs";
import { serialize } from "cookie";
import {
  ACCESSSECRET,
  IS_PRODUCTION,
  REFRESHSECRET,
  ACCESS_TOKEN_EXP_NUMBER,
  REFRESH_TOKEN_EXP_NUMBER,
} from "@lerna-monorepo/backend-utilities/config";
import { jwt } from "@lerna-monorepo/backend-utilities/index";
import { createUser } from "@lerna-monorepo/backend-utilities/grpc";

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
    {
      authusers,
      req,
      logins,
      ip,
      sessions,
      deviceName,
      deviceType,
      grpcClient,
    }: Context
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
      req.context.res.appendHeader(
        "Set-Cookie",
        serialize("refreshToken", refreshToken, {
          httpOnly: true,
          expires: refreshTokenExpireDate,
          secure: true,
          sameSite: IS_PRODUCTION ? "strict" : "none",
          domain: IS_PRODUCTION ? "relay-graphql-monorepo.com" : undefined,
        })
      );
      req.context.res.setHeader("accessToken", accessToken);
      await createUser(id, grpcClient);
      await logins.insertOne({
        applicationName: "Lerna Monorepo",
        address: ip || "",
        time: now,
        userId: id,
      });
      await sessions.insertOne({
        refreshToken,
        lastTimeAccessed: now,
        applicationName: "Lerna Monorepo",
        type: deviceType,
        deviceName,
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
