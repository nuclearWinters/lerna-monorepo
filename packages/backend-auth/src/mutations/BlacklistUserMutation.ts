import { mutationWithClientMutationId } from "graphql-relay";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { Context } from "../types";
import { getContext, refreshTokenMiddleware } from "../utils";

interface Input {
  refreshToken: string;
  id: string;
}

type Payload = {
  validAccessToken: string;
  error: string;
};

export const BlacklistUserMutation = mutationWithClientMutationId({
  name: "BlacklistUser",
  description: "Bloquea los refresh token de un usuario por una hora.",
  inputFields: {
    refreshToken: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLString) },
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
    { refreshToken, id }: Input,
    { req }: Context
  ): Promise<Payload> => {
    try {
      const { rdb, accessToken } = getContext(req);
      const { validAccessToken, _id } = await refreshTokenMiddleware(
        accessToken,
        refreshToken
      );
      if (id !== _id) {
        throw new Error("Solo el usuario puede bloquear su cuenta.");
      }
      await rdb.set(_id, _id, "EX", 60 * 60);
      return { validAccessToken, error: "" };
    } catch (e) {
      return { validAccessToken: "", error: e.message };
    }
  },
});
