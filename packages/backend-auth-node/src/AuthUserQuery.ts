import { ObjectId } from "bson";
import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLFloat,
} from "graphql";
import {
  Connection,
  ConnectionArguments,
  connectionDefinitions,
  connectionFromArray,
  forwardConnectionArgs,
  fromGlobalId,
  globalIdField,
  nodeDefinitions,
} from "graphql-relay";
import { Filter } from "mongodb";
import { Languages } from "./mutations/SignUpMutation";
import { Context, UserLogins, UserMongo, UserSessions } from "./types";
import {
  base64,
  DateScalarType,
  unbase64,
  UUID,
} from "@lerna-monorepo/backend-utilities";

const { nodeInterface, nodeField } = nodeDefinitions<Context>(
  async (globalId, { authusers }) => {
    const { type, id } = fromGlobalId(globalId);
    switch (type) {
      case "AuthUser":
        return { ...(await authusers.findOne({ id: id as UUID })), type };
      default:
        return { type: "" };
    }
  },
  (obj: { type: string }) => obj.type
);

export const GraphQLSession = new GraphQLObjectType<UserSessions>({
  name: "Session",
  fields: {
    id: globalIdField("Session", ({ _id }): string =>
      typeof _id === "string" ? _id : _id.toHexString()
    ),
    applicationName: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ applicationName }): string => applicationName,
    },
    type: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ type }): string => type,
    },
    deviceName: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ deviceName }): string => deviceName,
    },
    address: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ address }): string => address,
    },
    lastTimeAccessed: {
      type: new GraphQLNonNull(DateScalarType),
      resolve: ({ lastTimeAccessed }): Date => lastTimeAccessed,
    },
    userId: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ userId }): string => userId,
    },
    expirationDate: {
      type: new GraphQLNonNull(DateScalarType),
      resolve: ({ expirationDate }): Date => expirationDate,
    },
  },
});

const { connectionType: SessionsConnection, edgeType: GraphQLSessionEdge } =
  connectionDefinitions({
    name: "Sessions",
    nodeType: GraphQLSession,
  });

export const GraphQLLogin = new GraphQLObjectType<UserLogins>({
  name: "Login",
  fields: {
    id: globalIdField("Login", ({ _id }): string => _id.toHexString()),
    applicationName: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ applicationName }): string => applicationName,
    },
    time: {
      type: new GraphQLNonNull(DateScalarType),
      resolve: ({ time }): Date => time,
    },
    address: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ address }): string => address,
    },
    userId: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ userId }): string => userId,
    },
  },
});

const { connectionType: LoginConnection, edgeType: GraphQLLoginEdge } =
  connectionDefinitions({
    name: "Logins",
    nodeType: GraphQLLogin,
  });

export const GraphQLAuthUser = new GraphQLObjectType<UserMongo, Context>({
  name: "AuthUser",
  fields: {
    id: globalIdField("AuthUser"),
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
    sessions: {
      type: new GraphQLNonNull(SessionsConnection),
      args: {
        ...forwardConnectionArgs,
        reset: {
          type: GraphQLFloat,
        },
      },
      resolve: async (
        _root: unknown,
        args: unknown,
        { sessions, id }: Context
      ): Promise<Connection<UserSessions>> => {
        const { after, first } = args as ConnectionArguments;
        try {
          if (!id) {
            throw new Error("Unauthenticated");
          }
          const sessions_id = unbase64(after || "");
          const limit = first ? first + 1 : 0;
          if (limit <= 0) {
            throw new Error("Se requiere que 'first' sea un entero positivo");
          }
          const query: Filter<UserSessions> = {
            userId: id,
            expirationDate: { $gt: new Date() },
          };
          if (sessions_id) {
            query._id = { $lt: new ObjectId(sessions_id) };
          }
          const result = await sessions
            .find(query)
            .limit(limit)
            .sort({ $natural: -1 })
            .toArray();
          const edgesMapped = result.map((session) => {
            return {
              cursor: base64(session._id.toHexString()),
              node: session,
            };
          });
          const edges = edgesMapped.slice(0, first || 5);
          return {
            edges,
            pageInfo: {
              startCursor: edges[0]?.cursor || null,
              endCursor: edges[edges.length - 1]?.cursor || null,
              hasPreviousPage: false,
              hasNextPage: edgesMapped.length > (first || 0),
            },
          };
        } catch (e) {
          return connectionFromArray([], { first, after });
        }
      },
    },
    logins: {
      type: new GraphQLNonNull(LoginConnection),
      args: {
        ...forwardConnectionArgs,
        reset: {
          type: GraphQLFloat,
        },
      },
      resolve: async (
        _root: unknown,
        args: unknown,
        { logins, id }: Context
      ): Promise<Connection<UserLogins>> => {
        const { first, after } = args as ConnectionArguments;
        try {
          if (!id) {
            throw new Error("Unauthenticated");
          }
          const logins_id = unbase64(after || "");
          const limit = first ? first + 1 : 0;
          if (limit <= 0) {
            throw new Error("Se requiere que 'first' sea un entero positivo");
          }
          const query: Filter<UserLogins> = {
            userId: id,
          };
          if (logins_id) {
            query._id = { $lt: new ObjectId(logins_id) };
          }
          const result = await logins
            .find(query)
            .limit(limit)
            .sort({ $natural: -1 })
            .toArray();
          const edgesMapped = result.map((login) => {
            return {
              cursor: base64(login._id.toHexString()),
              node: login,
            };
          });
          const edges = edgesMapped.slice(0, first || 5);
          return {
            edges,
            pageInfo: {
              startCursor: edges[0]?.cursor || null,
              endCursor: edges[edges.length - 1]?.cursor || null,
              hasPreviousPage: false,
              hasNextPage: edgesMapped.length > (first || 0),
            },
          };
        } catch (e) {
          return connectionFromArray([], { first, after });
        }
      },
    },
  },
  interfaces: [nodeInterface],
});

const QueryUser = {
  type: GraphQLAuthUser,
  resolve: async (
    _root: unknown,
    _args: unknown,
    { authusers, id }: Context
  ): Promise<UserMongo> => {
    if (!id) {
      throw new Error("Unauthenticated");
    }
    const user = await authusers.findOne({
      id,
    });
    if (!user) {
      throw new Error("User do not exist");
    }
    return user;
  },
};

export { QueryUser, GraphQLLoginEdge, GraphQLSessionEdge, nodeField };
