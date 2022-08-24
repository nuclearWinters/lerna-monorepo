import { ObjectId } from "bson";
import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLBoolean,
} from "graphql";
import { globalIdField } from "graphql-relay";
import { Languages } from "./mutations/SignUpMutation";
import { Context, UserMongo } from "./types";

export const GraphQLAuthUser = new GraphQLObjectType<UserMongo, Context>({
  name: "AuthUser",
  fields: {
    id: globalIdField("AuthUser", ({ _id }): string => _id.toHexString()),
    accountId: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ id }): string => id,
    },
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
    language: {
      type: new GraphQLNonNull(Languages),
      resolve: ({ language }): "es" | "en" | "default" => language,
    },
    isSupport: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: ({ isSupport }): boolean => isSupport,
    },
    isLender: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: ({ isLender }): boolean => isLender,
    },
    isBorrower: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: ({ isBorrower }): boolean => isBorrower,
    },
  },
});

const QueryUser = {
  type: new GraphQLNonNull(GraphQLAuthUser),
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
        email: "",
        password: "",
        language: "default",
        name: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        RFC: "",
        CURP: "",
        clabe: "",
        mobile: "",
        isBorrower: false,
        isLender: true,
        isSupport: false,
        id: "",
      };
    }
  },
};

export { QueryUser };
