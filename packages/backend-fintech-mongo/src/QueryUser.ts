import { GraphQLUser } from "./Nodes.js";
import { Context, UserMongo } from "./types.js";

const QueryUser = {
  type: GraphQLUser,
  resolve: async (
    _root: unknown,
    _args: unknown,
    { users, id }: Context
  ): Promise<UserMongo> => {
    const user = await users.findOne({
      id,
    });
    if (!user) {
      throw new Error("Unauthenticated");
    }
    return user;
  },
};

export { QueryUser };
