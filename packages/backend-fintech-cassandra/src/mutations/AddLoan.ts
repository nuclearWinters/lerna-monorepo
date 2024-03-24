import { mutationWithClientMutationId } from "graphql-relay";
import { GraphQLString, GraphQLNonNull, GraphQLInt } from "graphql";
import { Context } from "../types";
import { MXNScalarType } from "../Nodes";

interface Input {
  goal: number;
  term: number;
}

type Payload = {
  error: string;
};

export const AddLoanMutation = mutationWithClientMutationId({
  name: "AddLoan",
  description:
    "Crea una deuda en la que se pueda invertir y obtén un AccessToken valido.",
  inputFields: {
    goal: { type: new GraphQLNonNull(MXNScalarType) },
    term: { type: new GraphQLNonNull(GraphQLInt) },
  },
  outputFields: {
    error: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ error }: Payload): string => error,
    },
  },
  mutateAndGetPayload: async (
    loan: Input,
    { client, id }: Context
  ): Promise<Payload> => {
    try {
      if (!id) {
        throw new Error("No valid access token.");
      }
      await client.execute(
        `INSERT INTO fintech.loans (id, user_id, score, raised, expiry, roi, status, pending, term)
          VALUES (now(), ${id}, ?, 0, now(), 17, ?, ${loan.goal}, ${loan.term}`,
        ["AAA", "waiting for approval"]
      );
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
