import { GraphQLUser } from "./Nodes.ts";
import type { Context } from "./types.ts";
import type { FintechUserMongo } from "@repo/mongo-utils";

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
