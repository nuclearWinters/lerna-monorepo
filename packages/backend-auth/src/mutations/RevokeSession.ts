import { fromGlobalId, mutationWithClientMutationId } from "graphql-relay";
import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import { Context, UserSessions } from "../types";
import { ObjectId } from "mongodb";
import { addMinutes } from "date-fns";
import { GraphQLSession } from "../AuthUserQuery";

interface Input {
  sessionId: string;
}

type Payload = {
  error: string;
  session: UserSessions | null;
  shouldReloadBrowser: boolean;
};

export const RevokeSessionMutation = mutationWithClientMutationId({
  name: "RevokeSession",
  description: "Revoca una sesion.",
  inputFields: {
    sessionId: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  outputFields: {
    error: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ error }: Payload): string => error,
    },
    session: {
      type: GraphQLSession,
      resolve: ({ session }: Payload): UserSessions | null => session,
    },
    shouldReloadBrowser: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: ({ shouldReloadBrowser }: Payload): boolean =>
        shouldReloadBrowser,
    },
  },
  mutateAndGetPayload: async (
    { sessionId }: Input,
    { rdb, id, sessions, refreshToken, res }: Context
  ): Promise<Payload> => {
    try {
      if (!id) {
        throw new Error("Sin usuario.");
      }
      const { id: session_id } = fromGlobalId(sessionId);
      const now = new Date();
      now.setMilliseconds(0);
      const time = now.getTime() / 1000;
      const expireDate = addMinutes(now, -15);
      const session = await sessions.findOneAndUpdate(
        { _id: new ObjectId(session_id) },
        { $set: { expirationDate: expireDate } },
        { returnDocument: "after" }
      );
      if (session.value) {
        await rdb.set(session.value.refreshToken, time, { EX: 60 * 15 });
        if (refreshToken === session.value.refreshToken) {
          res.clearCookie("refreshToken");
          return {
            error: "",
            session: session.value,
            shouldReloadBrowser: true,
          };
        }
      }
      return { error: "", session: session.value, shouldReloadBrowser: false };
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : "",
        session: null,
        shouldReloadBrowser: false,
      };
    }
  },
});
