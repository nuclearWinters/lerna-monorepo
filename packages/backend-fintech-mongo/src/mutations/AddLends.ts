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
    borrower_id: string;
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
    borrower_id: {
      type: new GraphQLNonNull(GraphQLString),
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
    { id, producer }: Context
  ): Promise<Payload> => {
    try {
      if (!id) {
        throw new Error("Unauthenticated");
      }
      for (const lend of newLends) {
        const { id: loan_id } = fromGlobalId(lend.loan_gid);
        await producer.send({
          topic: "user-transaction",
          messages: [
            {
              key: id,
              value: JSON.stringify({
                user_id: id,
                withheld: lend.quantity,
                nextTopic: "loan-transaction",
                nextKey: loan_id,
                nextValue: JSON.stringify({
                  quantity: lend.quantity,
                  lender_id: id,
                  loan_id,
                  nextTopic: "add-lends",
                  nextKey: id,
                  nextValue: JSON.stringify({
                    quantity: lend.quantity,
                    loan_id,
                    lender_id: id,
                  }),
                }),
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
