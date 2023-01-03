import { mutationWithClientMutationId } from "graphql-relay";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { Context } from "../types";

interface Input {
  sessionId: string;
}

type Payload = {
  error: string;
};

export const RevokeSessionMutation = mutationWithClientMutationId({
  name: "RevokeSession",
  description: "Revoca una sesion.",
  inputFields: {
    sessionId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    error: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ error }: Payload): string => error,
    },
  },
  mutateAndGetPayload: async (
    { sessionId }: Input,
    { rdb, id, sessions }: Context
  ): Promise<Payload> => {
    try {
      if (!id) {
        throw new Error("Sin usuario.");
      }
      const now = new Date();
      now.setMilliseconds(0);
      const time = now.getTime() / 1000;
      await sessions.deleteOne({ sessionId, userId: id });
      await rdb.set(sessionId, time, { EX: 60 * 15 });
      return { error: "" };
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : "",
      };
    }
  },
});
