import { fromGlobalId, mutationWithClientMutationId } from "graphql-relay";
import { GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";
import { Context } from "../types";
import { ObjectID } from "mongodb";
import { refreshTokenMiddleware } from "../utils";

interface Input {
  loan_gid: string;
}

type Payload = {
  validAccessToken: string;
  error: string;
};

export const ApproveLoanMutation = mutationWithClientMutationId({
  name: "ApproveLoan",
  description: "Aprueba una deuda para que empieze a ser financiada.",
  inputFields: {
    loan_gid: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    error: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ error }: Payload): string => error,
    },
    validAccessToken: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ validAccessToken }: Payload): string => validAccessToken,
    },
  },
  mutateAndGetPayload: async (
    { loan_gid }: Input,
    { loans, accessToken, refreshToken }: Context
  ): Promise<Payload> => {
    try {
      const { id: loan_id } = fromGlobalId(loan_gid);
      const { validAccessToken } = await refreshTokenMiddleware(
        accessToken,
        refreshToken
      );
      await loans.updateOne(
        { _id: new ObjectID(loan_id) },
        { $set: { status: "financing" } }
      );
      return { validAccessToken, error: "" };
    } catch (e) {
      return { validAccessToken: "", error: e.message };
    }
  },
});
