import { mutationWithClientMutationId } from "graphql-relay";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { Context } from "../types";
import { IS_PRODUCTION } from "@lerna-monorepo/backend-utilities/config";
import { serialize } from "cookie";

type Payload = {
  error: string;
};

export const LogOutMutation = mutationWithClientMutationId({
  name: "LogOut",
  description: "Quita el Refresh Token.",
  inputFields: {},
  outputFields: {
    error: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ error }: Payload): string => error,
    },
  },
  mutateAndGetPayload: async (
    _: unknown,
    { res, refreshToken, rdb, sessions }: Context
  ): Promise<Payload> => {
    try {
      const now = new Date();
      now.setMilliseconds(0);
      res.appendHeader(
        "Set-Cookie",
        serialize("refreshToken", "", {
          httpOnly: true,
          expires: now,
          secure: true,
          sameSite: IS_PRODUCTION ? "strict" : "none",
          domain: IS_PRODUCTION ? "relay-graphql-monorepo.com" : undefined,
        })
      );
      const time = now.getTime();
      const session = await sessions.findOneAndUpdate(
        { refreshToken },
        { $set: { expirationDate: now } }
      );
      if (session) {
        await rdb.set(session.refreshToken, time, { EX: 60 * 15 });
      }
      return {
        error: "",
      };
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : "",
      };
    }
  },
});
