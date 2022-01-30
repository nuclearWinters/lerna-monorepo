import { ObjectId } from "bson";
import { GraphQLString, GraphQLNonNull } from "graphql";
import { GraphQLUser } from "./Nodes";
import { Context } from "./types";
import { refreshTokenMiddleware } from "./utils";

const QueryUser = {
  type: new GraphQLNonNull(GraphQLUser),
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (
    _root: unknown,
    { id }: any,
    { users, accessToken, refreshToken }: Context
  ) => {
    try {
      const { _id: user_id } = await refreshTokenMiddleware(
        accessToken,
        refreshToken
      );
      if (user_id !== id) {
        throw new Error("No es el mismo usuario.");
      }
      const user = await users.findOne({
        _id: new ObjectId(user_id),
      });
      if (!user) {
        throw new Error("El usuario no existe.");
      }
      return user;
    } catch (e) {
      return {
        _id: new ObjectId("000000000000000000000000"),
        name: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        RFC: "",
        CURP: "",
        clabe: "",
        mobile: "",
        accountAvailable: 0,
        investments: [],
      };
    }
  },
};

export { QueryUser };
