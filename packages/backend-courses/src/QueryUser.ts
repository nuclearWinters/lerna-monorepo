import { ObjectId } from "bson";
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
        _id: new ObjectId("000000000000000000000000"),
        accountAvailable: 0,
        accountInterests: 0,
        accountLent: 0,
        id: "",
      };
    }
  },
};

export { QueryUser };
