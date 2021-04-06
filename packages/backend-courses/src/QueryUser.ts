import { GraphQLString } from "graphql";
import { GraphQLUser } from "./Nodes";
import { RootUser } from "./types";

const UserQuery = {
  type: GraphQLUser,
  args: {
    id: { type: GraphQLString },
  },
  resolve: async (): Promise<RootUser> => {
    try {
      return {
        username: "Default",
      };
    } catch (e) {
      return { username: "Default" };
    }
  },
};

export { UserQuery };
