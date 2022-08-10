import { mutationWithClientMutationId } from "graphql-relay";
import { GraphQLString, GraphQLNonNull } from "graphql";
import { Context } from "../types";
import { ObjectId } from "mongodb";
import { MXNScalarType } from "../Nodes";

interface Input {
  quantity: number;
}

type Payload = {
  validAccessToken: string;
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
    validAccessToken: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ validAccessToken }: Payload): string => validAccessToken,
    },
  },
  mutateAndGetPayload: async (
    { quantity }: Input,
    { users, transactions, id, validAccessToken }: Context
  ): Promise<Payload> => {
    try {
      if (!validAccessToken) {
        throw new Error("No valid access token.");
      }
      if (quantity === 0) {
        throw new Error("La cantidad no puede ser cero.");
      }
      const result = await users.updateOne(
        { id, accountAvailable: { $gte: -quantity } },
        { $inc: { accountAvailable: quantity } }
      );
      if (!result.modifiedCount) {
        throw new Error("No cuentas con fondos suficientes.");
      }
      transactions.updateOne(
        { _id: new RegExp(`^${id}`), count: { $lt: 5 } },
        {
          $push: {
            history: {
              _id: new ObjectId(),
              type: quantity > 0 ? "credit" : "withdrawal",
              quantity,
              created: new Date(),
            },
          },
          $inc: { count: 1 },
          $setOnInsert: {
            _id: `${id}_${new Date().getTime()}`,
            id_user: id,
          },
        },
        { upsert: true }
      );
      return { validAccessToken, error: "" };
    } catch (e) {
      return {
        validAccessToken: "",
        error:
          e instanceof Error
            ? e.message
            : (e as { message: string }).message
            ? (e as { message: string }).message
            : "",
      };
    }
  },
});
