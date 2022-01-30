import { fromGlobalId, mutationWithClientMutationId } from "graphql-relay";
import { GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";
import { Context } from "../types";
import { refreshTokenMiddleware } from "../utils";

interface Input {
  user_gid: string;
}

type Payload = {
  validAccessToken: string;
  error: string;
};

export const BlacklistUserMutation = mutationWithClientMutationId({
  name: "BlacklistUser",
  description: "Bloquea los refresh token de un usuario por una hora.",
  inputFields: {
    user_gid: { type: new GraphQLNonNull(GraphQLID) },
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
    { user_gid }: Input,
    { rdb, accessToken, refreshToken }: Context
  ): Promise<Payload> => {
    try {
      const { id: user_id } = fromGlobalId(user_gid);
      const { _id } = await refreshTokenMiddleware(accessToken, refreshToken);
      if (user_id !== _id) {
        throw new Error("Solo el usuario puede bloquear su cuenta.");
      }
      await rdb.set(_id, _id, { EX: 60 * 60 });
      return { validAccessToken: "", error: "" };
    } catch (e) {
      return {
        validAccessToken: "",
        error: e instanceof Error ? e.message : "",
      };
    }
  },
});
