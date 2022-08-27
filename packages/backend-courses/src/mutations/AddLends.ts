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
import { TransactionMongo, Context } from "../types";
import { ObjectId } from "mongodb";
import { MXNScalarType } from "../Nodes";
import { addMonths, startOfMonth } from "date-fns";
import {
  publishInvestmentUpdate,
  publishLoanUpdate,
  publishTransactionInsert,
  publishUser,
} from "../subscriptions/subscriptionsUtils";

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
      const result = await users.findOneAndUpdate(
        { id, accountAvailable: { $gte: total } },
        {
          $inc: {
            accountAvailable: -total,
          },
        },
        { returnDocument: "after" }
      );
      if (!result.value) {
        throw new Error("No se tienen suficientes fondos.");
      }
      publishUser(result.value);
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
        if (result.value) {
          publishLoanUpdate(result.value);
        }
        //Si NO se realizó la operación: incrementar saldo y no realizar más acciones
        if (!result.value) {
          const result = await users.findOneAndUpdate(
            { id },
            {
              $inc: { accountAvailable: quantity },
            },
            { returnDocument: "after" }
          );
          if (result.value) {
            publishUser(result.value);
          }
          continue;
        }
        //Si se realizó la operación: agregar elemento a la lista
        docsFiltered.push(doc);
        const completed = result.value.raised === result.value.goal;
        //Si se realizo la operacion crear inversion
        const updatedInvestment = await investments.findOneAndUpdate(
          {
            _id_loan: doc._id_loan,
            id_borrower: doc.id_borrower,
            id_lender: id,
          },
          {
            $inc: { quantity },
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
              to_be_paid: 0,
            },
          },
          {
            upsert: true,
            returnDocument: "after",
          }
        );
        if (updatedInvestment.value) {
          publishInvestmentUpdate(updatedInvestment.value);
        }
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
          const interest_to_earn = amortizes - inv.quantity;
          //Añadir intereses a la cuenta de cada usuario
          const updatedUser = await users.findOneAndUpdate(
            {
              id: inv.id_lender,
            },
            {
              $inc: {
                accountToBePaid: amortizes,
                accountTotal: interest_to_earn,
              },
            },
            { returnDocument: "after" }
          );
          if (updatedUser.value) {
            publishUser(updatedUser.value);
          }
          //Añadir intereses a cada inversion
          const updatedInvestments = await investments.findOneAndUpdate(
            {
              _id: inv._id,
            },
            {
              $set: {
                interest_to_earn,
                amortize,
                to_be_paid: amortizes,
              },
            },
            { returnDocument: "after" }
          );
          if (updatedInvestments.value) {
            publishInvestmentUpdate(updatedInvestments.value);
          }
        }
        //Si raised es igual a goal: Actualizar scheduledPayments y status
        const updatedLoan = await loans.findOneAndUpdate(
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
          },
          { returnDocument: "after" }
        );
        if (updatedLoan.value) {
          publishLoanUpdate(updatedLoan.value);
        }
        //Si raised es igual a goal: añadir fondos a quien pidio prestado
        const { value } = await users.findOneAndUpdate(
          { id: result.value.id_user },
          {
            $inc: {
              accountAvailable: result.value.goal,
              accountTotal: result.value.goal,
            },
          },
          { returnDocument: "after" }
        );
        if (value) {
          publishUser(value);
        }
      }
      //Si no se realizó nungun cambio en loans arrojar error
      if (docsFiltered.length === 0) {
        throw new Error(
          "Error: no se realizó ninguna operación. Intenta de nuevo."
        );
      }
      //Crear lista de operaciones para el bulkWrite en transacciones
      const transactionsOperations = docsFiltered.map<TransactionMongo>(
        ({ quantity, _id_loan, id_borrower }) => ({
          _id: new ObjectId(),
          id_user: id,
          type: "invest",
          quantity,
          created: now,
          _id_loan,
          id_borrower,
        })
      );
      //Insertar transacciones
      transactions.insertMany(transactionsOperations);
      transactionsOperations.forEach((op) => {
        publishTransactionInsert(op);
      });
      return { validAccessToken, error: "" };
    } catch (e) {
      return {
        validAccessToken: "",
        error: e instanceof Error ? e.message : "",
      };
    }
  },
});
