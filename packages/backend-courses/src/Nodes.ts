import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { fromGlobalId, globalIdField, nodeDefinitions } from "graphql-relay";
import { RootUser, Context } from "./types";

const { nodeInterface, nodeField } = nodeDefinitions(
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
    id: globalIdField("User", ({ _id }): string => _id),
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ name }): string => name,
    },
    apellidoPaterno: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ apellidoPaterno }): string => apellidoPaterno,
    },
    apellidoMaterno: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ apellidoMaterno }): string => apellidoMaterno,
    },
    RFC: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ RFC }): string => RFC,
    },
    CURP: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ CURP }): string => CURP,
    },
    clabe: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ clabe }): string => clabe,
    },
    mobile: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ mobile }): string => mobile,
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ email }): string => email,
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ password }): string => password,
    },
    accountTotal: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ accountTotal }): number => accountTotal,
    },
    accountAvailable: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ accountAvailable }): number => accountAvailable,
    },
    error: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ error }): string => error,
    },
  },
  interfaces: [nodeInterface],
});

export { GraphQLUser, nodeField };
