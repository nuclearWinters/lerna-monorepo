import { mutationWithClientMutationId } from "graphql-relay";
import { GraphQLString, GraphQLNonNull } from "graphql";
import type { Context } from "../types.ts";
import { MXNScalarType } from "../Nodes.ts";

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
    { quantity: quantity_cents }: Input,
    { id, producer, records }: Context
  ): Promise<Payload> => {
    try {
      if (!id) {
        throw new Error("Unauthenticated");
      }
      if (quantity_cents === 0) {
        throw new Error("La cantidad no puede ser cero.");
      }
      const result = await records.insertOne({
        status: "pending",
      });
      const record_oid_str = result.insertedId.toHexString();
      await producer.send({
        topic: "user-transaction",
        messages: [
          {
            value: JSON.stringify({
              operationTotalAndAvailable: quantity_cents,
              user_uuid: id,
              record_oid_str,
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
