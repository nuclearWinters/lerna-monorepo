import { fromGlobalId, mutationWithClientMutationId } from "graphql-relay";
import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
  GraphQLInputObjectType,
} from "graphql";
import {
  BucketTransactionMongo,
  Context,
  InvestmentMongo,
  LoanMongo,
  UserMongo,
} from "../types";
import { ObjectId, BulkWriteUpdateOneOperation } from "mongodb";
import { refreshTokenMiddleware } from "../utils";
import { GraphQLUser, MXNScalarType } from "../Nodes";
import { addMonths, startOfMonth } from "date-fns";

interface Input {
  lender_gid: string;
  lends: { quantity: number; borrower_id: string; loan_gid: string }[];
}

type Payload = {
  validAccessToken: string;
  error: string;
  user: UserMongo | null;
};

export const GraphQLLendList = new GraphQLInputObjectType({
  name: "LendList",
  fields: {
    loan_gid: {
      type: new GraphQLNonNull(GraphQLID),
    },
    quantity: {
      type: new GraphQLNonNull(MXNScalarType),
    },
    borrower_id: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});

export const AddLendsMutation = mutationWithClientMutationId({
  name: "AddLends",
  description:
    "Envía una lista de prestamos: recibe una lista con deudas actualizadas y un usuario actualizado.",
  inputFields: {
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
    user: {
      type: GraphQLUser,
      resolve: ({ user }: Payload): UserMongo | null => user,
    },
  },
  mutateAndGetPayload: async (
    { lender_gid, lends: newLends }: Input,
    {
      users,
      accessToken,
      investments,
      loans,
      transactions,
      refreshToken,
    }: Context
  ): Promise<Payload> => {
    try {
      const { id: lender_id } = fromGlobalId(lender_gid);
      const { _id, validAccessToken } = await refreshTokenMiddleware(
        accessToken,
        refreshToken
      );
      if (lender_id !== _id) {
        throw new Error("No es el mismo usuario.");
      }
      const _id_lender = new ObjectId(lender_id);
      const now = new Date();
      const docs = newLends.map(({ loan_gid, quantity, borrower_id }) => {
        const _id_loan = fromGlobalId(loan_gid).id;
        return {
          _id: new ObjectId(),
          _id_lender,
          _id_borrower: new ObjectId(borrower_id),
          quantity,
          _id_loan: new ObjectId(_id_loan),
          now,
          goal: 0,
          raised: 0,
          completed: false,
          term: 0,
          ROI: 0,
        };
      });
      const loansResult = await loans
        .find({ _id: { $in: docs.map((doc) => doc._id_loan) } })
        .toArray();
      loansResult.forEach((loan) => {
        const index = docs.findIndex(
          (doc) => doc._id_loan.toHexString() === loan._id.toHexString()
        );
        if (index !== -1) {
          docs[index].goal = loan.goal;
          docs[index].raised = loan.raised;
          docs[index].term = loan.term;
          docs[index].ROI = loan.ROI;
          docs[index].completed =
            docs[index].quantity + loan.raised === loan.goal;
        }
      });
      const docsFiltered = docs.filter(
        (doc) => !(doc.goal === 0 || doc.raised + doc.quantity > doc.goal)
      );
      const investmentsOperations = docsFiltered.map<
        BulkWriteUpdateOneOperation<InvestmentMongo>
      >(
        ({
          quantity,
          _id_loan,
          _id_borrower,
          _id_lender,
          now,
          completed,
          ROI,
          term,
        }) => {
          return {
            updateOne: {
              filter: { _id_loan, _id_borrower, _id_lender },
              update: {
                $inc: { quantity },
                $set: {
                  startPayingDate: completed
                    ? startOfMonth(addMonths(new Date(), 1))
                    : null,
                },
                $setOnInsert: {
                  _id: new ObjectId(),
                  _id_lender,
                  _id_borrower,
                  _id_loan,
                  created: now,
                  updated: now,
                  status: "up to date",
                  payments: 0,
                  term,
                  ROI,
                  moratory: 0,
                },
              },
              upsert: true,
            },
          };
        }
      );
      investments.bulkWrite(investmentsOperations);
      const loansOperations = docsFiltered.map<
        BulkWriteUpdateOneOperation<LoanMongo>
      >(({ quantity, _id_loan, term, goal, completed, ROI }) => ({
        updateOne: {
          filter: { _id: _id_loan },
          update: {
            $inc: { raised: quantity },
            $set: {
              scheduledPayments: completed
                ? new Array(term).fill({}).map((pay, index) => {
                    const TEM = Math.pow(1 + ROI / 100, 1 / 12) - 1;
                    return {
                      amortize: Math.floor(
                        goal / ((1 - Math.pow(1 / (1 + TEM), term)) / TEM)
                      ),
                      scheduledDate: startOfMonth(
                        addMonths(new Date(), index + 1)
                      ),
                      status: "to be paid",
                    };
                  })
                : null,
              status: completed ? "to be paid" : "financing",
            },
            $push: {
              investors: {
                _id_lender,
                quantity,
              },
            },
          },
        },
      }));
      await loans.bulkWrite(loansOperations);
      const total = newLends.reduce((prev, next) => {
        return prev + next.quantity;
      }, 0);
      const result = await users.findOneAndUpdate(
        { _id: _id_lender },
        {
          $inc: { accountAvailable: -total },
          $push: {
            investments: {
              $each: docsFiltered.map(({ ROI, term, _id_loan, quantity }) => ({
                _id_loan,
                quantity,
                term,
                ROI,
                payments: 0,
              })),
            },
          },
        },
        { returnOriginal: false }
      );
      const user = result.value;
      if (!user) {
        throw new Error("El usuario no existe.");
      }
      const transactionsOperations = docsFiltered.map<
        BulkWriteUpdateOneOperation<BucketTransactionMongo>
      >(({ quantity, _id_loan, _id_borrower, now }) => ({
        updateOne: {
          filter: { _id: new RegExp(`^${lender_id}`), count: { $lt: 5 } },
          update: {
            $push: {
              history: {
                _id: new ObjectId(),
                type: "INVEST" as const,
                quantity,
                created: now,
                _id_loan,
                _id_borrower,
              },
            },
            $inc: { count: 1 },
            $setOnInsert: {
              _id: `${lender_id}_${now.getTime()}`,
              _id_user: _id_lender,
            },
          },
          upsert: true,
        },
      }));
      transactions.bulkWrite(transactionsOperations);
      return { validAccessToken, error: "", user };
    } catch (e) {
      return {
        validAccessToken: "",
        error: e.message,
        user: null,
      };
    }
  },
});
