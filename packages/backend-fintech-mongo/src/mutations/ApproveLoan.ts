import { fromGlobalId, mutationWithClientMutationId } from "graphql-relay";
import { GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";
import { Context, LoanMongo } from "../types";
import { ObjectId } from "mongodb";
import { GraphQLLoan } from "../Nodes";
import {
  publishLoanInsert,
  publishLoanUpdate,
} from "../subscriptions/subscriptionsUtils";

interface Input {
  loan_gid: string;
}

type Payload = {
  error: string;
  loan: LoanMongo | null;
};

export const ApproveLoanMutation = mutationWithClientMutationId<
  Input,
  Payload,
  Context
>({
  name: "ApproveLoan",
  description: "Aprueba una deuda para que empieze a ser financiada.",
  inputFields: {
    loan_gid: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    error: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ error }): string => error,
    },
    loan: {
      type: GraphQLLoan,
      resolve: ({ loan }): LoanMongo | null => loan,
    },
  },
  mutateAndGetPayload: async (
    { loan_gid },
    { loans, id, isSupport, pubsub }
  ) => {
    try {
      if (!id) {
        throw new Error("Unauthenticated");
      }
      if (!isSupport) {
        throw new Error("Unauthorized");
      }
      const { id: loan_id } = fromGlobalId(loan_gid);
      const loan = await loans.findOneAndUpdate(
        { _id: new ObjectId(loan_id) },
        { $set: { status: "financing" } },
        { returnDocument: "after" }
      );
      if (!loan) {
        throw new Error("No se encontró la deuda.");
      }
      publishLoanUpdate(loan, pubsub);
      publishLoanInsert(loan, pubsub);
      return { error: "", loan };
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : "",
        loan: null,
      };
    }
  },
});
