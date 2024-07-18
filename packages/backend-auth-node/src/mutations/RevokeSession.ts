import { fromGlobalId, mutationWithClientMutationId } from "graphql-relay";
import { GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";
import { Context, UserSessions } from "../types";
import { ObjectId } from "mongodb";
import { GraphQLSession } from "../AuthUserQuery";
import { serialize } from "cookie";
import { NODE_ENV } from "../config";

interface Input {
  sessionId: string;
}

type Payload = {
  error: string;
  session: UserSessions | null;
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
  },
  mutateAndGetPayload: async (
    { sessionId }: Input,
    { rdb, id, sessions, refreshToken, req }: Context
  ): Promise<Payload> => {
    try {
      if (!id) {
        throw new Error("Unauthenticated");
      }
      const { id: session_id } = fromGlobalId(sessionId);
      const now = new Date();
      now.setMilliseconds(0);
      const time = now.getTime();
      const session = await sessions.findOneAndUpdate(
        { _id: new ObjectId(session_id) },
        { $set: { expirationDate: now } },
        { returnDocument: "after" }
      );
      if (session) {
        await rdb.set(session.refreshToken, time, { EX: 60 * 15 });
        if (refreshToken === session.refreshToken) {
          req.context.res.setHeader("accessToken", "");
          req.context.res.appendHeader(
            "Set-Cookie",
            serialize("refreshToken", "", {
              httpOnly: true,
              expires: now,
              secure: true,
              sameSite: NODE_ENV === "production" ? "lax" : "none",
            })
          );
        }
      }
      return { error: "", session };
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : "",
        session: null,
      };
    }
  },
});
