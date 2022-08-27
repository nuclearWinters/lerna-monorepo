import { mutationWithClientMutationId } from "graphql-relay";
import { GraphQLString, GraphQLNonNull, GraphQLInt } from "graphql";
import { Context } from "../types";
import { ObjectId } from "mongodb";
import { add } from "date-fns";
import { MXNScalarType } from "../Nodes";
import { publishLoanInsert } from "../subscriptions/subscriptionsUtils";

interface Input {
  goal: number;
  term: number;
}

type Payload = {
  validAccessToken: string;
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
    validAccessToken: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ validAccessToken }: Payload): string => validAccessToken,
    },
  },
  mutateAndGetPayload: async (
    loan: Input,
    { loans, id, validAccessToken }: Context
  ): Promise<Payload> => {
    try {
      if (!validAccessToken || !id) {
        throw new Error("No valid access token.");
      }
      const _id_loan = new ObjectId();
      const expiry = add(new Date(), { months: 3 });
      await loans.insertOne({
        _id: _id_loan,
        id_user: id,
        score: "AAA",
        raised: 0,
        expiry,
        ROI: 17.0,
        status: "waiting for approval",
        scheduledPayments: null,
        pending: 0,
        ...loan,
      });
      publishLoanInsert({
        _id: _id_loan,
        id_user: id,
        score: "AAA",
        raised: 0,
        expiry,
        ROI: 17.0,
        status: "waiting for approval",
        scheduledPayments: null,
        pending: 0,
        ...loan,
      });
      return {
        validAccessToken,
        error: "",
      };
    } catch (e) {
      return {
        validAccessToken: "",
        error: e instanceof Error ? e.message : "",
      };
    }
  },
});
