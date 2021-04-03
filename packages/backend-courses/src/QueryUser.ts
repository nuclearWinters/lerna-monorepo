import { GraphQLString } from "graphql";
import { GraphQLUser } from "./Nodes";
import { RootUser, Context } from "./types";
import { ObjectID } from "mongodb";

const UserQuery = {
  type: GraphQLUser,
  args: {
    id: { type: GraphQLString },
  },
  resolve: async (
    _: any,
    { id, refreshToken }: any,
    { usersCollection }: Context
  ): Promise<RootUser> => {
    try {
      return {
        username: "Default",
      };
    } catch (e) {
      return {username: "Default"};
    }
  },
};

export { UserQuery };