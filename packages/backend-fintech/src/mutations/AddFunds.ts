import { mutationWithClientMutationId } from "graphql-relay";
import { GraphQLString, GraphQLNonNull } from "graphql";
import { Context, TransactionMongo } from "../types";
import { MXNScalarType } from "../Nodes";
import {
  publishTransactionInsert,
  publishUser,
} from "../subscriptions/subscriptionsUtils";
import { ObjectId, WithId } from "mongodb";

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
    { users, transactions, id }: Context
  ): Promise<Payload> => {
    try {
      if (!id) {
        throw new Error("No valid access token.");
      }
      if (quantity === 0) {
        throw new Error("La cantidad no puede ser cero.");
      }
      const now = new Date();
      const newTransaction: WithId<TransactionMongo> = {
        _id: new ObjectId(),
        id_user: id,
        type: quantity > 0 ? "credit" : "withdrawal",
        quantity,
        created: now,
      };
      const result = await users.findOneAndUpdate(
        { id, accountAvailable: { $gte: -quantity } },
        {
          $inc: {
            accountAvailable: quantity,
            accountTotal: quantity,
          },
        },
        { returnDocument: "after" }
      );
      if (result.value) {
        publishUser(result.value);
      }
      if (!result.value) {
        throw new Error("No cuentas con fondos suficientes.");
      }
      await transactions.insertOne(newTransaction);
      publishTransactionInsert(newTransaction);
      return { error: "" };
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : "",
      };
    }
  },
});
