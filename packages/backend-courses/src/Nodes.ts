import { ObjectID } from "bson";
import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLScalarType,
  Kind,
} from "graphql";
import {
  fromGlobalId,
  globalIdField,
  nodeDefinitions,
  connectionDefinitions,
} from "graphql-relay";
import { RootUser, Context, LoanMongo } from "./types";
import { getContext } from "./utils";

const DateScalarType = new GraphQLScalarType({
  name: "Date",
  serialize: (value) => {
    return value.getTime();
  },
  parseValue: (value) => {
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10));
    }
    return null;
  },
});

const { nodeInterface, nodeField } = nodeDefinitions(
  async (globalId, ctx) => {
    const { type, id } = fromGlobalId(globalId);
    const { users, loans } = getContext(ctx);
    if (type === "User") {
      const user = await users.findOne({ _id: new ObjectID(id) });
      if (!user) {
        return { type: "" };
      }
      const typedUser = { ...user, type };
      return typedUser;
    } else if (type === "Loan") {
      const loan = await loans.findOne({ _id: new ObjectID(id) });
      if (!loan) {
        return { type: "" };
      }
      const typedUser = { ...loan, type };
      return typedUser;
    } else {
      return { type: "" };
    }
  },
  (obj: { type: string }): GraphQLObjectType | null => {
    switch (obj.type) {
      case "Loan":
        return GraphQLLoan;
      case "User":
        return GraphQLUser;
      default:
        return null;
    }
  }
);

export const GraphQLLoan = new GraphQLObjectType<LoanMongo>({
  name: "Loan",
  fields: {
    id: globalIdField("Loan", ({ _id }): string => _id.toHexString()),
    _id_user: {
      type: GraphQLNonNull(GraphQLString),
      resolve: ({ _id_user }): string => _id_user.toHexString(),
    },
    score: {
      type: GraphQLNonNull(GraphQLString),
      resolve: ({ score }): string => score,
    },
    ROI: {
      type: GraphQLNonNull(GraphQLFloat),
      resolve: ({ ROI }): number => ROI,
    },
    goal: {
      type: GraphQLNonNull(GraphQLInt),
      resolve: ({ goal }): number => goal,
    },
    term: {
      type: GraphQLNonNull(GraphQLInt),
      resolve: ({ term }): number => term,
    },
    raised: {
      type: GraphQLNonNull(GraphQLInt),
      resolve: ({ raised }): number => raised,
    },
    expiry: {
      type: GraphQLNonNull(DateScalarType),
      resolve: ({ expiry }): Date => expiry,
    },
  },
  interfaces: [nodeInterface],
});

const {
  connectionType: LoanConnection,
  edgeType: GraphQLLoanEdge,
} = connectionDefinitions({
  name: "Loan",
  nodeType: GraphQLLoan,
});

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
    accountTotal: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: ({ accountTotal }): number => accountTotal,
    },
    accountAvailable: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: ({ accountAvailable }): number => accountAvailable,
    },
    error: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ error }): string => error,
    },
  },
  interfaces: [nodeInterface],
});

export { GraphQLUser, nodeField, GraphQLLoanEdge, LoanConnection };
