import { ObjectID } from "bson";
import { GraphQLString, GraphQLNonNull, GraphQLNullableType } from "graphql";
import { GraphQLUser } from "./Nodes";
import { RootUser, Context } from "./types";
import { getContext, refreshTokenMiddleware } from "./utils";

interface IQueryUser {
  type: GraphQLNonNull<GraphQLNullableType>;
  args: {
    id: {
      type: GraphQLNonNull<GraphQLNullableType>;
    };
    refreshToken: {
      type: GraphQLNonNull<GraphQLNullableType>;
    };
  };
  resolve: (
    root: { [argName: string]: string },
    args: { [argName: string]: string },
    ctx: Context
  ) => Promise<RootUser>;
}

const QueryUser: IQueryUser = {
  type: new GraphQLNonNull(GraphQLUser),
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    refreshToken: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, { id, refreshToken }, ctx) => {
    try {
      const { users, accessToken } = getContext(ctx);
      const { _id } = await refreshTokenMiddleware(accessToken, refreshToken);
      if (_id !== id) {
        throw new Error("No es el mismo usuario.");
      }
      const user = await users.findOne({
        _id: new ObjectID(_id),
      });
      if (!user) {
        throw new Error("El usuario no existe.");
      }
      const {
        name,
        apellidoMaterno,
        apellidoPaterno,
        RFC,
        CURP,
        clabe,
        mobile,
        accountTotal,
        accountAvailable,
      } = user;
      return {
        _id,
        name,
        apellidoPaterno,
        apellidoMaterno,
        RFC,
        CURP,
        clabe,
        mobile,
        accountTotal,
        accountAvailable,
        error: "",
      };
    } catch (e) {
      return {
        _id: "",
        name: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        RFC: "",
        CURP: "",
        clabe: "",
        mobile: "",
        accountTotal: 0,
        accountAvailable: 0,
        error: e.message,
      };
    }
  },
};

export { QueryUser };
