import { mutationWithClientMutationId } from "graphql-relay";
import { GraphQLString, GraphQLNonNull } from "graphql";
import { ACCESSSECRET, REFRESHSECRET } from "../config";
import { Context } from "../types";
import bcrypt from "bcryptjs";
import { ObjectID } from "mongodb";
import { getContext, channelSendToQueue, jwt } from "../utils";

interface Input {
  username: string;
  email: string;
  password: string;
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
    { email, password }: Input,
    ctx: Context
  ): Promise<Payload> => {
    try {
      const { users, ch } = getContext(ctx);
      const user = await users.findOne({ email });
      if (user) throw new Error("El email ya esta siendo usado.");
      const hash_password = await bcrypt.hash(password, 12);
      const _id = new ObjectID();
      await users.insertOne({
        _id,
        email,
        password: hash_password,
      });
      const refreshToken = jwt.sign(
        { _id: _id.toHexString(), email },
        REFRESHSECRET,
        { expiresIn: "1h" }
      );
      const accessToken = jwt.sign(
        { _id: _id.toHexString(), email },
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
