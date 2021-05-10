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
  lender_gid: string;
  lends: { quantity: number; borrower_id: string; loan_gid: string }[];
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
    loan_gid: {
      type: GraphQLNonNull(GraphQLID),
    },
    quantity: {
      type: GraphQLNonNull(GraphQLInt),
    },
    borrower_id: {
      type: GraphQLNonNull(GraphQLString),
    },
  },
});

export const AddLendsMutation = mutationWithClientMutationId({
  name: "AddLends",
  description:
    "Envía una lista de prestamos: recibe una lista con deudas actualizadas y un usuario actualizado.",
  inputFields: {
    refreshToken: { type: new GraphQLNonNull(GraphQLString) },
    lender_gid: { type: new GraphQLNonNull(GraphQLID) },
    lends: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLLendList))
      ),
    },
  },
  outputFields: {
    error: {
      type: new GraphQLNonNull(GraphQLString),
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
    { refreshToken, lender_gid, lends: newLends }: Input,
    ctx: Context
  ): Promise<Payload> => {
    try {
      const { id: lender_id } = fromGlobalId(lender_gid);
      const { users, accessToken, lends, loans } = getContext(ctx);
      const { _id, validAccessToken } = await refreshTokenMiddleware(
        accessToken,
        refreshToken
      );
      if (lender_id !== _id) {
        throw new Error("No es el mismo usuario.");
      }
      const docs = newLends.map(({ loan_gid, quantity, borrower_id }) => {
        const _id_loan = fromGlobalId(loan_gid).id;
        return {
          _id: new ObjectID(),
          _id_lender: new ObjectID(lender_id),
          _id_borrower: new ObjectID(borrower_id),
          quantity,
          _id_loan: new ObjectID(_id_loan),
          date: new Date(),
        };
      });
      await lends.insertMany(docs);
      const operations = docs.map(({ quantity, _id_loan }) => ({
        updateOne: {
          filter: { _id: _id_loan },
          update: { $inc: { raised: quantity } },
        },
      }));
      await loans.bulkWrite(operations);
      const total = newLends.reduce<number>((prev, next) => {
        return prev + next.quantity;
      }, 0);
      const result = await users.findOneAndUpdate(
        { _id: new ObjectID(lender_id) },
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
