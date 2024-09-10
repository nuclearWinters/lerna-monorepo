import { mutationWithClientMutationId } from "graphql-relay";
import { GraphQLString, GraphQLNonNull } from "graphql";
import { Context } from "../types.js";
import { MXNScalarType } from "../Nodes.js";

interface Input {
  quantity: number;
}

type Payload = {
  error: string;
};

export const AddFundsMutation = mutationWithClientMutationId({
  name: "AddFunds",
  description:
    "Añade fondos a tu cuenta: recibe el usuario actualziao y obtén un AccessToken valido.",
  inputFields: {
    quantity: { type: new GraphQLNonNull(MXNScalarType) },
  },
  outputFields: {
    error: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ error }: Payload): string => error,
    },
  },
  mutateAndGetPayload: async (
    { quantity }: Input,
    { id, producer }: Context
  ): Promise<Payload> => {
    try {
      if (!id) {
        throw new Error("Unauthenticated");
      }
      if (quantity === 0) {
        throw new Error("La cantidad no puede ser cero.");
      }
      await producer.send({
        topic: "user-transaction",
        messages: [
          {
            value: JSON.stringify({
              quantity,
              user_id: id,
            }),
            key: id,
          },
        ],
      });
      return { error: "" };
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : "",
      };
    }
  },
});
