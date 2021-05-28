import { ObjectID } from "bson";
import { GraphQLString, GraphQLNonNull, GraphQLNullableType } from "graphql";
import { GraphQLUser } from "./Nodes";
import { RootUser, Context } from "./types";
import { refreshTokenMiddleware } from "./utils";

interface IQueryUser {
  type: GraphQLNonNull<GraphQLNullableType>;
  args: {
    id: {
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
  },
  resolve: async (_, { id }, { users, accessToken, refreshToken }) => {
    try {
      const { _id: user_id } = await refreshTokenMiddleware(
        accessToken,
        refreshToken
      );
      if (user_id !== id) {
        throw new Error("No es el mismo usuario.");
      }
      const user = await users.findOne({
        _id: new ObjectID(user_id),
      });
      if (!user) {
        throw new Error("El usuario no existe.");
      }
      return {
        ...user,
        _id: user_id,
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
