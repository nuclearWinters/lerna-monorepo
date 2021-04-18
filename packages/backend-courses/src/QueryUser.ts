import { GraphQLString, GraphQLNonNull } from "graphql";
import { GraphQLUser } from "./Nodes";
import { RootUser } from "./types";

const UserQuery = {
  type: new GraphQLNonNull(GraphQLUser),
  args: {
    id: { type: GraphQLString },
  },
  resolve: async (): Promise<RootUser> => {
    try {
      return {
        name: "Armando Narcizo",
        apellidoPaterno: "Rueda",
        apellidoMaterno: "Perez",
        RFC: "3276342RFC",
        CURP: "23946239CURP",
        clabe: "123456789012345678",
        mobile: "9831228788",
        email: "armandonarcizoruedaperez@gmail.com",
        password: "anrp1224",
        accountTotal: 10000,
        accountAvailable: 1000,
      };
    } catch (e) {
      return {
        name: "Armando Narcizo",
        apellidoPaterno: "Rueda",
        apellidoMaterno: "Perez",
        RFC: "3276342RFC",
        CURP: "23946239CURP",
        clabe: "123456789012345678",
        mobile: "9831228788",
        email: "armandonarcizoruedaperez@gmail.com",
        password: "anrp1224",
        accountTotal: 10000,
        accountAvailable: 1000,
      };
    }
  },
};

export { UserQuery };
