import { GraphQLUser } from "./Nodes";
import { Context } from "./types";
import { FintechUserMongo } from "@repo/mongo-utils/types";

const QueryUser = {
  type: GraphQLUser,
  resolve: async (
    _root: unknown,
    _args: unknown,
    { users, id }: Context
  ): Promise<FintechUserMongo> => {
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
