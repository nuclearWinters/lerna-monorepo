import { add } from "date-fns";
import { GraphQLInt, GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { ObjectId } from "mongodb";
import { MXNScalarType } from "../Nodes.ts";
import { publishMyLoanInsert } from "../subscriptions/subscriptionsUtils.ts";
import type { Context } from "../types.ts";

interface Input {
  goal: number;
  term: number;
}

type Payload = {
  error: string;
};

export const AddLoanMutation = mutationWithClientMutationId({
  name: "AddLoan",
  description: "Crea una deuda en la que se pueda invertir y obtén un AccessToken valido.",
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
  mutateAndGetPayload: async (loan: Input, { loans, id, pubsub }: Context): Promise<Payload> => {
    try {
      if (!id) {
        throw new Error("Unauthenticated");
      }
      const loan_oid = new ObjectId();
      const expiry = add(new Date(), { months: 3 });
      const docLoan = {
        _id: loan_oid,
        user_id: id,
        score: "AAA",
        raised: 0,
        expiry,
        roi: 17.0,
        status: "waiting for approval" as const,
        pending: loan.goal,
        payments_delayed: 0,
        payments_done: 0,
        ...loan,
      };
      await loans.insertOne(docLoan);
      publishMyLoanInsert(
        {
          _id: loan_oid,
          user_id: id,
          score: "AAA",
          raised: 0,
          expiry,
          roi: 17.0,
          status: "waiting for approval",
          pending: loan.goal,
          payments_delayed: 0,
          payments_done: 0,
          ...loan,
        },
        pubsub,
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
