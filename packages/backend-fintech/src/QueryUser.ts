import { GraphQLNonNull } from "graphql";
import { GraphQLUser } from "./Nodes";
import { Context, UserMongo } from "./types";

const QueryUser = {
  type: new GraphQLNonNull(GraphQLUser),
  resolve: async (
    _root: unknown,
    _args: unknown,
    { users, id }: Context
  ): Promise<UserMongo> => {
    try {
      const user = await users.findOne({
        id,
      });
      if (!user) {
        throw new Error("El usuario no existe.");
      }
      return user;
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
