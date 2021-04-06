import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

import { fromGlobalId, globalIdField, nodeDefinitions } from "graphql-relay";

import { RootUser, Context } from "./types";

const { nodeInterface } = nodeDefinitions(
  (globalId) => {
    const { type } = fromGlobalId(globalId);
    return type;
  },
  (type: string): GraphQLObjectType | null => {
    switch (type) {
      case "User":
        return GraphQLUser;
      default:
        return null;
    }
  }
);

const GraphQLUser = new GraphQLObjectType<RootUser, Context>({
  name: "User",
  fields: {
    id: globalIdField("User"),
    username: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ username }): string => username,
    },
  },
  interfaces: [nodeInterface],
});

export { GraphQLUser };
