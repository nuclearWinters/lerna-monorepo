import { fromGlobalId, mutationWithClientMutationId } from "graphql-relay";
import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
  GraphQLInputObjectType,
} from "graphql";
import { Context } from "../types";
import { MXNScalarType } from "../Nodes";

interface Input {
  lends: {
    quantity: number;
    loan_gid: string;
  }[];
}

type Payload = {
  error: string;
};

export const GraphQLLendList = new GraphQLInputObjectType({
  name: "LendList",
  fields: {
    loan_gid: {
      type: new GraphQLNonNull(GraphQLID),
    },
    quantity: {
      type: new GraphQLNonNull(MXNScalarType),
    },
  },
});

export const AddLendsMutation = mutationWithClientMutationId({
  name: "AddLends",
  description:
    "Envía una lista de prestamos: recibe una lista con deudas actualizadas y un usuario actualizado.",
  inputFields: {
    lends: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLLendList))
      ),
    },
  },
  outputFields: {
    error: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ error }: Payload): string => error,
    },
  },
  mutateAndGetPayload: async (
    { lends: newLends }: Input,
    { producer, id }: Context
  ): Promise<Payload> => {
    try {
      if (!id) {
        throw new Error("No valid access token.");
      }
      for (const lend of newLends) {
        const { id: id_loan } = fromGlobalId(lend.loan_gid);
        await producer.send({
          topic: "add-lend",
          messages: [
            {
              value: JSON.stringify({
                id_lender: id,
                quantity: lend.quantity,
                id_loan: id_loan,
              }),
            },
          ],
        });
      }
      return { error: "" };
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : "",
      };
    }
  },
});
