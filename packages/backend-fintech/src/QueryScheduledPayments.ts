import { GraphQLID, GraphQLList, GraphQLNonNull } from "graphql";
import { GraphQLScheduledPayments } from "./Nodes";
import { Context, ScheduledPaymentsMongo } from "./types";
import { unbase64 } from "./utils";
import { ObjectId } from "mongodb";

const QueryScheduledPayments = {
  type: new GraphQLList(GraphQLScheduledPayments),
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: async (
    _root: unknown,
    args: unknown,
    { scheduledPayments }: Context
  ): Promise<ScheduledPaymentsMongo[]> => {
    try {
      const { id: loan_id } = args as { id: string };
      const id = unbase64(loan_id);
      const loan_oid = new ObjectId(id);
      const scheduledPaymentsList = await scheduledPayments
        .find({ loan_oid })
        .toArray();
      return scheduledPaymentsList;
    } catch (e) {
      return [];
    }
  },
};

export { QueryScheduledPayments };
