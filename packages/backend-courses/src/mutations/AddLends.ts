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
import { BucketTransactionMongo, Context } from "../types";
import { ObjectId, AnyBulkWriteOperation } from "mongodb";
import { MXNScalarType } from "../Nodes";
import { addMonths, startOfMonth } from "date-fns";

interface Input {
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
    { lends: newLends }: Input,
    { users, investments, loans, transactions, validAccessToken, id }: Context
  ): Promise<Payload> => {
    try {
      if (!id || !validAccessToken) {
        throw new Error("No valid access token.");
      }
      const now = new Date();
      //Crear lista de elementos con datos en el input
      const docs = newLends.map(
        ({ loan_gid, quantity, borrower_id, goal, term, ROI }) => {
          const _id_loan = fromGlobalId(loan_gid).id;
          //Tasa efectiva mensual
          const TEM = Math.pow(1 + ROI / 100, 1 / 12) - 1;
          return {
            _id: new ObjectId(),
            id_lender: id,
            id_borrower: borrower_id,
            quantity,
            _id_loan: new ObjectId(_id_loan),
            goal,
            raised: 0,
            term,
            ROI,
            TEM,
          };
        }
      );
      //Calcular el total que se le restará al usuario y Aumentar la cantidad prestada valuada al usuario
      const total = docs.reduce((account, { quantity }) => {
        return account + quantity;
      }, 0);
      //Actualizar el usuario
      const result = await users.updateOne(
        { id, accountAvailable: { $gte: total } },
        {
          $inc: {
            accountAvailable: -total,
            accountLent: total,
          },
        }
      );
      if (!result.modifiedCount) {
        throw new Error("No se tienen suficientes fondos.");
      }
      //Crear lista filtrada vacía
      const docsFiltered = docs.filter(() => false);
      for (const doc of docs) {
        const { quantity, goal, _id_loan, id_borrower, term, ROI } = doc;
        //Aumentar propiedad raised de la deuda si no se sobrepasa la propiedad goal
        const result = await loans.findOneAndUpdate(
          {
            _id: _id_loan,
            raised: { $lte: goal - quantity },
          },
          {
            $inc: {
              raised: quantity,
              pending: -quantity,
            },
          },
          { returnDocument: "after" }
        );
        //Si NO se realizó la operación: incrementar saldo y no realizar más acciones
        if (!result.value) {
          await users.updateOne(
            { id },
            {
              $inc: { accountAvailable: quantity, accountLent: -quantity },
            }
          );
          continue;
        }
        //Si se realizó la operación: agregar elemento a la lista
        docsFiltered.push(doc);
        const completed = result.value.raised === result.value.goal;
        //Si se realizo la operacion crear inversion
        await investments.updateOne(
          {
            _id_loan: doc._id_loan,
            id_borrower: doc.id_borrower,
            id_lender: id,
          },
          {
            $inc: { quantity, still_invested: quantity },
            $setOnInsert: {
              _id: new ObjectId(),
              id_lender: id,
              id_borrower,
              _id_loan,
              created: now,
              updated: now,
              status: completed ? "up to date" : "financing",
              payments: 0,
              term,
              ROI,
              moratory: 0,
              interest_to_earn: 0,
              amortize: 0,
              paid_already: 0,
            },
          },
          {
            upsert: true,
          }
        );
        //Si raised NO es igual a goal: no realizar más acciones
        if (!(result.value.raised === result.value.goal)) {
          continue;
        }
        //Obtener todas las inversiones del prestamo completado
        const investmentsResults = await investments
          .find({ _id_loan: _id_loan })
          .toArray();
        //Calcular intereses por cada prestamo de cada inversionista
        for (const inv of investmentsResults) {
          const TEM = Math.pow(1 + inv.ROI / 100, 1 / 12) - 1;
          const amortize = Math.floor(
            inv.quantity / ((1 - Math.pow(1 / (1 + TEM), inv.term)) / TEM)
          );
          const amortizes = amortize * inv.term;
          const accountInterests = amortizes - inv.quantity;
          //Añadir intereses a la cuenta de cada usuario
          await users.updateOne(
            {
              id: inv.id_lender,
            },
            {
              $inc: { accountInterests },
            }
          );
          //Añadir intereses a cada inversion
          await investments.updateOne(
            {
              _id: inv._id,
            },
            {
              $set: {
                interest_to_earn: accountInterests,
                amortize,
                still_invested: amortizes,
              },
            }
          );
        }
        //Si raised es igual a goal: Actualizar scheduledPayments y status
        await loans.updateOne(
          {
            _id: _id_loan,
          },
          {
            $set: {
              scheduledPayments: new Array(doc.term)
                .fill({})
                .map((_, index) => {
                  const TEM = doc.TEM;
                  return {
                    amortize: Math.floor(
                      doc.goal / ((1 - Math.pow(1 / (1 + TEM), doc.term)) / TEM)
                    ),
                    //Pago cada mismo dia del mes?
                    scheduledDate: startOfMonth(addMonths(now, index + 1)),
                    status: "to be paid",
                  };
                }),
              status: "to be paid",
            },
          }
        );
        //Si raised es igual a goal: añadir fondos a quien pidio prestado
        await users.updateOne(
          { id: result.value.id_user },
          { $inc: { accountAvailable: result.value.goal } }
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
        AnyBulkWriteOperation<BucketTransactionMongo>
      >(({ quantity, _id_loan, id_borrower }) => ({
        updateOne: {
          filter: { _id: new RegExp(`^${id}`), count: { $lt: 5 } },
          update: {
            $push: {
              history: {
                _id: new ObjectId(),
                type: "invest",
                quantity,
                created: now,
                _id_loan,
                id_borrower,
              },
            },
            $inc: { count: 1 },
            $setOnInsert: {
              _id: `${id}_${now.getTime()}`,
              id_user: id,
            },
          },
          upsert: true,
        },
      }));
      //Actualizar transacciones
      transactions.bulkWrite(transactionsOperations);
      return { validAccessToken, error: "" };
    } catch (e) {
      return {
        validAccessToken: "",
        error: e instanceof Error ? e.message : "",
      };
    }
  },
});
