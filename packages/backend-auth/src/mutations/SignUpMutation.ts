import { mutationWithClientMutationId } from "graphql-relay";
import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLEnumType,
} from "graphql";
import { ACCESSSECRET, NODE_ENV, REFRESHSECRET } from "../config";
import { Context } from "../types";
import bcrypt from "bcryptjs";
import {
  ACCESS_TOKEN_EXP_STRING,
  createUser,
  jwt,
  REFRESH_TOKEN_EXP_NUMBER,
} from "../utils";
import { addMinutes } from "date-fns";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  21
);

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
      res,
      logins,
      ip,
      sessions,
      sessionId,
      deviceName,
      deviceType,
    }: Context
  ): Promise<Payload> => {
    try {
      const user = await authusers.findOne({ email });
      if (user) throw new Error("El email ya esta siendo usado.");
      const hash_password = await bcrypt.hash(password, 12);
      const id = nanoid();
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
      const refreshTokenExpireTime = addMinutes(now, REFRESH_TOKEN_EXP_NUMBER);
      now.setMilliseconds(0);
      refreshTokenExpireTime.setMilliseconds(0);
      const refreshTokenExpireTimeInt = refreshTokenExpireTime.getTime() / 1000;
      const nowTime = now.getTime() / 1000;
      const refreshTokenExpiresIn = refreshTokenExpireTimeInt - nowTime;
      const refreshToken = jwt.sign(
        {
          id,
          isBorrower: !isLender,
          isLender: isLender,
          isSupport: false,
          refreshTokenExpireTime: refreshTokenExpireTimeInt,
        },
        REFRESHSECRET,
        { expiresIn: refreshTokenExpiresIn }
      );
      const accessToken = jwt.sign(
        {
          id,
          isBorrower: !isLender,
          isLender: isLender,
          isSupport: false,
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
      await createUser(id);
      await logins.insertOne({
        applicationName: "Lerna Monorepo",
        address: ip || "",
        time: now,
        userId: id,
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
            deviceName,
            sessionId,
            address: ip,
            userId: id,
          },
        },
        { upsert: true }
      );
      //const msg = {
      //  to: email,
      //  from: "soporte@amigoprogramador.com",
      //  subject: "Sending with Twilio SendGrid is Fun",
      //  text: "and easy to do anywhere, even with Node.js",
      //  html: "<strong>and easy to do anywhere, even with Node.js</strong>",
      //};
      //sgMail.send(msg);
      return { error: "" };
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : "",
      };
    }
  },
});
