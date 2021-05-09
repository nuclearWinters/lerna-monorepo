import { fromGlobalId, mutationWithClientMutationId } from "graphql-relay";
import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLInputObjectType,
} from "graphql";
import { Context, LoanMongo, UserMongo } from "../types";
import { ObjectID } from "mongodb";
import { getContext, refreshTokenMiddleware } from "../utils";
import { GraphQLLoan, GraphQLUser } from "../Nodes";

interface Input {
  refreshToken: string;
  id: string;
  lends: { lend: number; _id_borrower: string; id: string }[];
}

type Payload = {
  validAccessToken: string;
  loans: LoanMongo[] | null;
  error: string;
  user: UserMongo | null;
};

export const GraphQLLendList = new GraphQLInputObjectType({
  name: "LendList",
  fields: {
    id: {
      type: GraphQLNonNull(GraphQLID),
    },
    lend: {
      type: GraphQLNonNull(GraphQLInt),
    },
    _id_borrower: {
      type: GraphQLNonNull(GraphQLID),
    },
  },
});

export const AddLendsMutation = mutationWithClientMutationId({
  name: "AddLends",
  description:
    "Envía una lista de prestamos y recibe una lista con deudas actualizadas y un usuario actualizado.",
  inputFields: {
    refreshToken: { type: GraphQLNonNull(GraphQLString) },
    id: { type: GraphQLNonNull(GraphQLID) },
    lends: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLLendList))
      ),
    },
  },
  outputFields: {
    error: {
      type: GraphQLString,
      resolve: ({ error }: Payload): string => error,
    },
    validAccessToken: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ validAccessToken }: Payload): string => validAccessToken,
    },
    loans: {
      type: new GraphQLList(new GraphQLNonNull(GraphQLLoan)),
      resolve: ({ loans }: Payload): LoanMongo[] | null => loans,
    },
    user: {
      type: GraphQLUser,
      resolve: ({ user }: Payload): UserMongo | null => user,
    },
  },
  mutateAndGetPayload: async (
    { refreshToken, id: lender_gid, lends: newLends }: Input,
    ctx: Context
  ): Promise<Payload> => {
    try {
      const { id: _id_lender } = fromGlobalId(lender_gid);
      const { users, accessToken, lends, loans } = getContext(ctx);
      const { _id, validAccessToken } = await refreshTokenMiddleware(
        accessToken,
        refreshToken
      );
      if (_id_lender !== _id) {
        throw new Error("No es el mismo usuario.");
      }
      const docs = newLends.map(({ id: loan_gid, lend, _id_borrower }) => {
        const _id_loan = fromGlobalId(loan_gid).id;
        return {
          _id: new ObjectID(),
          _id_lender: new ObjectID(_id_lender),
          _id_borrower: new ObjectID(_id_borrower),
          lend,
          _id_loan: new ObjectID(_id_loan),
          date: new Date(),
        };
      });
      await lends.insertMany(docs);
      const operations = docs.map(({ lend, _id_borrower }) => ({
        updateOne: {
          filter: { user_id: new ObjectID(_id_borrower) },
          update: { $inc: { total: lend } },
        },
      }));
      await loans.bulkWrite(operations);
      const total = newLends.reduce<number>((prev, next) => {
        return prev + next.lend;
      }, 0);
      const result = await users.findOneAndUpdate(
        { _id: new ObjectID(_id_lender) },
        { $inc: { accountAvailable: -total } },
        { returnOriginal: false }
      );
      const ids = docs.map((doc) => doc._id_loan);
      const updatedLoans = await loans.find({ _id: { $in: ids } }).toArray();
      const user = result.value;
      if (!user) {
        throw new Error("El usuario no existe.");
      }
      return { validAccessToken, error: "", loans: updatedLoans, user };
    } catch (e) {
      return {
        validAccessToken: "",
        error: e.message,
        loans: null,
        user: null,
      };
    }
  },
});
