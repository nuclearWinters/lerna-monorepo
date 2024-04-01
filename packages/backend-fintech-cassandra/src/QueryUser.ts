import { GraphQLNonNull } from "graphql";
import { GraphQLUser } from "./Nodes";
import { Context, UserCassandra } from "./types";

const QueryUser = {
  type: new GraphQLNonNull(GraphQLUser),
  resolve: async (
    _root: unknown,
    _args: unknown,
    { client, id }: Context
  ): Promise<UserCassandra> => {
    try {
      const result = await client.execute(
        `SELECT * FROM fintech.users WHERE id = ${id}`
      );
      const user = result.first();
      if (!user) {
        throw new Error("User do not exists");
      }
      return {
        id: user.get("id"),
        account_available: user.get("account_available"),
        account_to_be_paid: user.get("account_to_be_paid"),
        account_total: user.get("account_total"),
        account_withheld: user.get("account_total"),
      };
    } catch (e) {
      return {
        account_available: 0,
        account_to_be_paid: 0,
        id: "",
        account_total: 0,
        account_withheld: 0,
      };
    }
  },
};

export { QueryUser };
