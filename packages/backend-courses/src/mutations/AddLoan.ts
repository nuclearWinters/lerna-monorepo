import { fromGlobalId, mutationWithClientMutationId } from "graphql-relay";
import { GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLID } from "graphql";
import { Context, LoanMongo } from "../types";
import { ObjectID } from "mongodb";
import { getContext, refreshTokenMiddleware } from "../utils";
import { add } from "date-fns";
import { GraphQLLoan } from "../Nodes";

interface Input {
  refreshToken: string;
  user_gid: string;
  goal: number;
  term: number;
}

type Payload = {
  validAccessToken: string;
  loan: LoanMongo | null;
  error: string;
};

export const AddLoanMutation = mutationWithClientMutationId({
  name: "AddLoan",
  description:
    "Crea una deuda en la que se pueda invertir y obtén un AccessToken valido.",
  inputFields: {
    refreshToken: { type: new GraphQLNonNull(GraphQLString) },
    user_gid: { type: new GraphQLNonNull(GraphQLID) },
    goal: { type: new GraphQLNonNull(GraphQLInt) },
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
    loan: {
      type: GraphQLLoan,
      resolve: ({ loan }: Payload): LoanMongo | null => loan,
    },
  },
  mutateAndGetPayload: async (
    { refreshToken, user_gid, ...loan }: Input,
    ctx: Context
  ): Promise<Payload> => {
    try {
      const { id: user_id } = fromGlobalId(user_gid);
      const { accessToken, loans } = getContext(ctx);
      const { _id, validAccessToken } = await refreshTokenMiddleware(
        accessToken,
        refreshToken
      );
      if (user_id !== _id) {
        throw new Error("No es el mismo usuario.");
      }
      const _id_loan = new ObjectID();
      const _id_user = new ObjectID(user_id);
      const expiry = add(new Date(), { months: 3 });
      await loans.insertOne({
        _id: _id_loan,
        _id_user,
        score: "AAA",
        raised: 0,
        expiry,
        ROI: 17.0,
        ...loan,
      });
      return {
        validAccessToken,
        error: "",
        loan: {
          _id: _id_loan,
          _id_user,
          score: "AAA",
          raised: 0,
          expiry,
          ROI: 17.0,
          ...loan,
        },
      };
    } catch (e) {
      return { validAccessToken: "", error: e.message, loan: null };
    }
  },
});
