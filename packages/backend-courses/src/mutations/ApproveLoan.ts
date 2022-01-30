import { fromGlobalId, mutationWithClientMutationId } from "graphql-relay";
import { GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";
import { Context, LoanMongo } from "../types";
import { ObjectId } from "mongodb";
import { base64, refreshTokenMiddleware } from "../utils";
import { GraphQLLoan } from "../Nodes";
import { LOAN, pubsub } from "../subscriptions/subscriptions";

interface Input {
  loan_gid: string;
}

type Payload = {
  validAccessToken: string;
  error: string;
  loan: LoanMongo | null;
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
    loan: {
      type: GraphQLLoan,
      resolve: ({ loan }: Payload): LoanMongo | null => loan,
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
      const { value: loan } = await loans.findOneAndUpdate(
        { _id: new ObjectId(loan_id) },
        { $set: { status: "financing" } },
        { returnDocument: "after" }
      );
      if (!loan) {
        throw new Error("No se encontró la deuda.");
      }
      pubsub.publish(LOAN, {
        loans_subscribe: {
          loan_edge: {
            node: loan,
            cursor: base64(loan._id.toHexString()),
          },
          type: "insert",
        },
      });
      return { validAccessToken, error: "", loan };
    } catch (e) {
      return {
        validAccessToken: "",
        error: e instanceof Error ? e.message : "",
        loan: null,
      };
    }
  },
});
