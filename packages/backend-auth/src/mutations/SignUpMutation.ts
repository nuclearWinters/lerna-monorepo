import { mutationWithClientMutationId } from "graphql-relay";
import { GraphQLString, GraphQLNonNull } from "graphql";
import { ACCESSSECRET, REFRESHSECRET } from "../config";
import { jwt } from "../utils";
import { Context } from "../types";
import bcrypt from "bcryptjs";
import { ObjectID } from "mongodb";
import { getContext } from "../utils";

interface Input {
  username: string;
  email: string;
  password: string;
}

type Payload = {
  refreshToken: string;
  accessToken: string;
  error?: string;
};

export const SignUpMutation = mutationWithClientMutationId({
  name: "SignUp",
  description:
    "Registra un nuevo usuario y obtén un Refresh Token y un AccessToken.",
  inputFields: {
    password: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    error: {
      type: GraphQLString,
      resolve: ({ error }: Payload): string | null => error || null,
    },
    accessToken: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ accessToken }: Payload): string => accessToken,
    },
  },
  mutateAndGetPayload: async (
    { email, password }: Input,
    ctx: Context
  ): Promise<Payload> => {
    try {
      const { users } = getContext(ctx);
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
      ctx.newRefreshToken = refreshToken;
      //const msg = {
      //  to: email,
      //  from: "soporte@amigoprogramador.com",
      //  subject: "Sending with Twilio SendGrid is Fun",
      //  text: "and easy to do anywhere, even with Node.js",
      //  html: "<strong>and easy to do anywhere, even with Node.js</strong>",
      //};
      //sgMail.send(msg);
      return { refreshToken, accessToken };
    } catch (e) {
      return { refreshToken: "", accessToken: "", error: e.message };
    }
  },
});
