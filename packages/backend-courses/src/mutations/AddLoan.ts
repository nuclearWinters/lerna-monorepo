import { fromGlobalId, mutationWithClientMutationId } from "graphql-relay";
import { GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLID } from "graphql";
import { Context } from "../types";
import { ObjectId } from "mongodb";
import { refreshTokenMiddleware } from "../utils";
import { add } from "date-fns";
import { MXNScalarType } from "../Nodes";

interface Input {
  user_gid: string;
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
    user_gid: { type: new GraphQLNonNull(GraphQLID) },
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
    { user_gid, ...loan }: Input,
    { refreshToken, loans, accessToken }: Context
  ): Promise<Payload> => {
    try {
      const { id: user_id } = fromGlobalId(user_gid);
      const { _id, validAccessToken } = await refreshTokenMiddleware(
        accessToken,
        refreshToken
      );
      if (user_id !== _id) {
        throw new Error("No es el mismo usuario.");
      }
      const _id_loan = new ObjectId();
      const _id_user = new ObjectId(user_id);
      const expiry = add(new Date(), { months: 3 });
      await loans.insertOne({
        _id: _id_loan,
        _id_user,
        score: "AAA",
        raised: 0,
        expiry,
        ROI: 17.0,
        status: "waiting for approval",
        scheduledPayments: null,
        investors: [],
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
