import type { ScheduledPaymentsMongo } from "@repo/mongo-utils";
import { unbase64 } from "@repo/utils";
import { GraphQLID, GraphQLList, GraphQLNonNull } from "graphql";
import { ObjectId } from "mongodb";
import { GraphQLScheduledPayments } from "./Nodes.ts";
import type { Context } from "./types.ts";

const QueryScheduledPayments = {
  type: new GraphQLList(GraphQLScheduledPayments),
  args: {
    loan_gid: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: async (_root: unknown, args: unknown, { scheduledPayments }: Context): Promise<ScheduledPaymentsMongo[]> => {
    try {
      const { loan_gid } = args as { loan_gid: string };
      const loan_id = unbase64(loan_gid);
      const loan_oid = new ObjectId(loan_id);
      const scheduledPaymentsList = await scheduledPayments.find({ loan_oid }).toArray();
      return scheduledPaymentsList;
    } catch {
      return [];
    }
  },
};

export { QueryScheduledPayments };
