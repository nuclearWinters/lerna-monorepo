import { mutationWithClientMutationId } from "graphql-relay";
import { GraphQLString, GraphQLNonNull, GraphQLBoolean } from "graphql";
import { ACCESSSECRET, REFRESHSECRET } from "../config";
import { Context } from "../types";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { channelSendToQueue, jwt } from "../utils";

interface Input {
  email: string;
  password: string;
  isLender: boolean;
}

type Payload = {
  refreshToken: string;
  accessToken: string;
  error: string;
};

export const SignUpMutation = mutationWithClientMutationId({
  name: "SignUp",
  description:
    "Registra un nuevo usuario y obtén un Refresh Token y un AccessToken.",
  inputFields: {
    password: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    isLender: { type: new GraphQLNonNull(GraphQLBoolean) },
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
    refreshToken: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ refreshToken }: Payload): string => refreshToken,
    },
  },
  mutateAndGetPayload: async (
    { email, password, isLender }: Input,
    { users, ch }: Context
  ): Promise<Payload> => {
    try {
      const user = await users.findOne({ email });
      if (user) throw new Error("El email ya esta siendo usado.");
      const hash_password = await bcrypt.hash(password, 12);
      const _id = new ObjectId();
      await users.insertOne({
        _id,
        email,
        password: hash_password,
        isLender: isLender,
        isBorrower: !isLender,
        isSupport: false,
      });
      const refreshToken = jwt.sign(
        {
          _id: _id.toHexString(),
          email,
          isLender: true,
          isBorrower: false,
          isSupport: false,
        },
        REFRESHSECRET,
        { expiresIn: "1h" }
      );
      const accessToken = jwt.sign(
        {
          _id: _id.toHexString(),
          email,
          isLender: true,
          isBorrower: false,
          isSupport: false,
        },
        ACCESSSECRET,
        { expiresIn: "15m" }
      );
      channelSendToQueue(ch, _id.toHexString());
      //const msg = {
      //  to: email,
      //  from: "soporte@amigoprogramador.com",
      //  subject: "Sending with Twilio SendGrid is Fun",
      //  text: "and easy to do anywhere, even with Node.js",
      //  html: "<strong>and easy to do anywhere, even with Node.js</strong>",
      //};
      //sgMail.send(msg);
      return { refreshToken, accessToken, error: "" };
    } catch (e) {
      return { refreshToken: "", accessToken: "", error: e.message };
    }
  },
});
