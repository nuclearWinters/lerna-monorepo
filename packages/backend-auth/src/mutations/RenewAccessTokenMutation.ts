import { REFRESHSECRET, ACCESSSECRET } from "../config";
import { jwt } from "../utils";
import { mutationWithClientMutationId } from "graphql-relay";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { Context } from "../types";
import { getContext } from "../utils";

interface Input {
  refreshToken: string;
}

type Payload = {
  validAccessToken: string;
  error: string;
};

export const RenewAccessTokenMutation = mutationWithClientMutationId({
  name: "RenewAccessToken",
  description: "Obtén un nuevo access token con un refresh token.",
  inputFields: {
    refreshToken: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    validAccessToken: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ validAccessToken }: Payload): string => validAccessToken,
    },
    error: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ error }: Payload): string => error,
    },
  },
  mutateAndGetPayload: async (
    { refreshToken }: Input,
    { req }: Context
  ): Promise<Payload> => {
    try {
      if (refreshToken === undefined) {
        throw new Error("No refresh token.");
      }
      const { rdb } = getContext(req);

      const user = jwt.verify(refreshToken, REFRESHSECRET);
      if (!user) {
        throw new Error("El token esta corrompido.");
      }
      const blacklistedUser = await rdb.get(user._id);
      if (blacklistedUser) {
        throw new Error("El usuario estará bloqueado por una hora.");
      }
      const validAccessToken = jwt.sign(
        { _id: user._id, email: user.email },
        ACCESSSECRET,
        {
          expiresIn: "15s",
        }
      );
      return { validAccessToken, error: "" };
    } catch (e) {
      return { validAccessToken: "", error: e.message };
    }
  },
});
