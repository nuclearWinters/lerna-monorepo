import { mutationWithClientMutationId } from "graphql-relay";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { Context } from "../types";
import { addMinutes } from "date-fns";

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
      res.clearCookie("refreshToken");
      const now = new Date();
      now.setMilliseconds(0);
      const time = now.getTime() / 1000;
      const expireDate = addMinutes(now, -15);
      const session = await sessions.findOneAndUpdate(
        { refreshToken },
        { $set: { expirationDate: expireDate } }
      );
      if (session.value) {
        await rdb.set(session.value.refreshToken, time, { EX: 60 * 15 });
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
