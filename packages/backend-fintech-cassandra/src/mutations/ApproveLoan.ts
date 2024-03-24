import { fromGlobalId, mutationWithClientMutationId } from "graphql-relay";
import { GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";
import { Context } from "../types";

interface Input {
  loan_gid: string;
}

type Payload = {
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
  },
  mutateAndGetPayload: async (
    { loan_gid }: Input,
    { client, id, isSupport }: Context
  ): Promise<Payload> => {
    try {
      if (!id) {
        throw new Error("No valid access token.");
      }
      if (!isSupport) {
        throw new Error("User is not support.");
      }
      const { id: loan_id } = fromGlobalId(loan_gid);
      await client.execute(
        `UPDATE fintech.loans SET status = ?
        WHERE id = ${loan_id}`,
        ["financing"]
      );
      return { error: "" };
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : "",
      };
    }
  },
});
