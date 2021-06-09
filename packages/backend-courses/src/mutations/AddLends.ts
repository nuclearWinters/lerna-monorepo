import { fromGlobalId, mutationWithClientMutationId } from "graphql-relay";
import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLFloat,
} from "graphql";
import { BucketTransactionMongo, Context, InvestmentMongo } from "../types";
import { ObjectId, BulkWriteUpdateOneOperation } from "mongodb";
import { refreshTokenMiddleware } from "../utils";
import { MXNScalarType } from "../Nodes";
import { addMonths, startOfMonth } from "date-fns";

interface Input {
  lender_gid: string;
  lends: {
    quantity: number;
    borrower_id: string;
    loan_gid: string;
    goal: number;
    term: number;
    ROI: number;
  }[];
}

type Payload = {
  validAccessToken: string;
  error: string;
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
    goal: {
      type: new GraphQLNonNull(MXNScalarType),
    },
    term: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    ROI: {
      type: new GraphQLNonNull(GraphQLFloat),
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
      //Crear lista de elementos con datos en el input
      const docs = newLends.map(
        ({ loan_gid, quantity, borrower_id, goal, term, ROI }) => {
          const _id_loan = fromGlobalId(loan_gid).id;
          return {
            _id: new ObjectId(),
            _id_lender,
            _id_borrower: new ObjectId(borrower_id),
            quantity,
            _id_loan: new ObjectId(_id_loan),
            goal,
            raised: 0,
            term,
            ROI,
          };
        }
      );
      //Calcular el total que se le restará al usuario
      const total = docs.reduce((prev, next) => {
        return prev + next.quantity;
      }, 0);
      //Actualizar el usuario
      const result = await users.updateOne(
        { _id: _id_lender, accountAvailable: { $gte: total } },
        {
          $inc: { accountAvailable: -total },
          $push: {
            investments: {
              $each: docs.map(({ ROI, term, _id_loan, quantity }) => ({
                _id_loan,
                quantity,
                term,
                ROI,
                payments: 0,
              })),
            },
          },
        }
      );
      if (!result.modifiedCount) {
        throw new Error("No se tienen suficientes fondos.");
      }
      //Crear lista filtrada vacía
      const docsFiltered = docs.filter(() => false);
      for (const doc of docs) {
        //Aumentar propiedad raised de la deuda si no se sobrepasa la propiedad goal
        const result = await loans.findOneAndUpdate(
          {
            _id: doc._id_loan,
            raised: { $lte: doc.goal - doc.quantity },
          },
          {
            $inc: {
              raised: doc.quantity,
            },
            $push: {
              investors: {
                _id_lender,
                quantity: doc.quantity,
              },
            },
          },
          { returnDocument: "after" }
        );
        //Si NO se realizó la operación: no realizar más acciones
        if (!result.value) {
          await users.updateOne(
            { _id: _id_lender },
            {
              $inc: { accountAvailable: doc.quantity },
              $pull: { "investments._id_loan": doc._id_loan },
            }
          );
          continue;
        }
        //Si se realizó la operación: agregar elemento a la lista
        docsFiltered.push(doc);
        //Si raised NO es igual a goal: no realizar más acciones
        if (!(result.value.raised === result.value.goal)) {
          continue;
        }
        //Si raised es igual a goal: Actualizar scheduledPayments y status
        await loans.updateOne(
          {
            _id: doc._id_loan,
          },
          {
            $set: {
              scheduledPayments: new Array(doc.term)
                .fill({})
                .map((pay, index) => {
                  const TEM = Math.pow(1 + doc.ROI / 100, 1 / 12) - 1;
                  return {
                    amortize: Math.floor(
                      doc.goal / ((1 - Math.pow(1 / (1 + TEM), doc.term)) / TEM)
                    ),
                    scheduledDate: startOfMonth(addMonths(now, index + 1)),
                    status: "to be paid",
                  };
                }),
              status: "to be paid",
            },
          }
        );
      }
      //Si no se realizó nungun cambio en loans arrojar error
      if (docsFiltered.length === 0) {
        throw new Error(
          "Error: no se realizó ninguna operación. Intenta de nuevo."
        );
      }
      //Crear lista de operaciones para el bulkWrite en transacciones
      const transactionsOperations = docsFiltered.map<
        BulkWriteUpdateOneOperation<BucketTransactionMongo>
      >(({ quantity, _id_loan, _id_borrower }) => ({
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
      //Actualizar transacciones
      transactions.bulkWrite(transactionsOperations);
      //Crear lista de operaciones para el bulkWrite en inversiones
      const investmentsOperations = docsFiltered.map<
        BulkWriteUpdateOneOperation<InvestmentMongo>
      >(({ quantity, _id_loan, _id_borrower, _id_lender, ROI, term }) => {
        return {
          updateOne: {
            filter: { _id_loan, _id_borrower, _id_lender },
            update: {
              $inc: { quantity },
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
      });
      //Actualizar inversiones
      investments.bulkWrite(investmentsOperations);
      return { validAccessToken, error: "" };
    } catch (e) {
      return {
        validAccessToken: "",
        error: e.message,
      };
    }
  },
});
