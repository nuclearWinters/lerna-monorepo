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
