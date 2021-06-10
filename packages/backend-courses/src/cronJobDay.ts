import { BulkWriteUpdateOneOperation, Db, ObjectId } from "mongodb";
import {
  BucketTransactionMongo,
  ILoanInvestors,
  InvestmentMongo,
  LoanMongo,
  UserMongo,
} from "./types";
import { isBefore, differenceInDays } from "date-fns";

export const dayFunction = async (db: Db): Promise<void> => {
  const loans = db.collection<LoanMongo>("loans");
  const investments = db.collection<InvestmentMongo>("investments");
  const transactions = db.collection<BucketTransactionMongo>("transactions");
  const results = await loans
    .find({ "scheduledPayments.status": "delayed" })
    .toArray();
  const users = db.collection<UserMongo>("users");
  for (const loan of results) {
    const now = new Date();
    if (!loan.scheduledPayments) {
      continue;
    }
    const delayedPayments = loan.scheduledPayments.filter((payment) => {
      return (
        isBefore(payment.scheduledDate, now) && payment.status === "delayed"
      );
    });
    let count = 0;
    for (const delayedPayment of delayedPayments) {
      //Sumar amortización con interes moratorio
      const delayedTotal =
        delayedPayment.amortize +
        Math.ceil(
          ((delayedPayment.amortize * (loan.ROI / 100)) / 360) *
            Math.abs(differenceInDays(delayedPayment.scheduledDate, now))
        );
      //Se actualiza el usuario del deudor al mover dinero de cuenta
      const result = await users.updateOne(
        {
          _id: loan._id_user,
          accountAvailable: { $gte: delayedTotal },
        },
        {
          $inc: {
            accountAvailable: -delayedTotal,
          },
        }
      );
      //Si el deudor no tiene suficiente dinero el estatus ya no se realizan acciones
      if (result.modifiedCount === 0) {
        continue;
      }
      count++;
      const allPaid =
        loan.scheduledPayments.filter((payment) => payment.status === "paid")
          .length +
          count ===
        loan.scheduledPayments.length;
      const noDelayed =
        loan.scheduledPayments.filter((payment) => payment.status === "delayed")
          .length -
          count ===
        0;
      //El pago SI se realizó, por lo tanto se actualiza la deuda y el estatus del pago correspondiente se vuelve pagada
      await loans.updateOne(
        { _id: loan._id },
        {
          $set: { "scheduledPayments.$[item].status": "paid" },
          ...(allPaid ? { status: "paid" } : {}),
        },
        {
          arrayFilters: [
            {
              "item.scheduledDate": delayedPayment.scheduledDate,
            },
          ],
        }
      );
      const set =
        noDelayed || allPaid
          ? {
              $set: {
                status: allPaid ? ("paid" as const) : ("up to date" as const),
              },
            }
          : {};
      //Conseguir todas las inversiones con el id de la deuda
      const allInvestments = await investments
        .find({ _id_loan: loan._id })
        .toArray();
      //Crear lista de operaciones con intereses moratorios
      const investmentWrites = allInvestments.map<
        BulkWriteUpdateOneOperation<InvestmentMongo>
      >(({ _id, quantity, ROI, term }) => {
        const TEM = Math.pow(1 + ROI / 100, 1 / 12) - 1;
        const amortize = Math.floor(
          quantity / ((1 - Math.pow(1 / (1 + TEM), term)) / TEM)
        );
        const moratory = Math.ceil(
          ((amortize * (ROI / 100)) / 360) *
            Math.abs(differenceInDays(delayedPayment.scheduledDate, now))
        );
        return {
          updateOne: {
            filter: { _id },
            update: {
              $inc: { payments: 1, moratory },
              //Si todos los pagos se realizaron cambiar estatus a "paid" o si todos los pagos atrasados se realizaron cambiar status a "up to date"
              ...set,
            },
          },
        };
      });
      //Actualizar el los intereses moratorios en las inversiones
      await investments.bulkWrite(investmentWrites);
      //La propiedad investors cantidades añadidas en diferentes momentos, se itera para hacer calculos sobre un solo monto prestado
      const investors = loan.investors.reduce<ILoanInvestors[]>((acc, item) => {
        const index = acc.findIndex(
          (acc) =>
            acc._id_lender.toHexString() === item._id_lender.toHexString()
        );
        if (index === -1) {
          acc.push(item);
        } else {
          acc[index].quantity += item.quantity;
        }
        return acc;
      }, []);
      const pull = allPaid
        ? { $pull: { investments: { _id_loan: loan._id } } }
        : {};
      const inc = allPaid ? {} : { "investments.$[item].payments": 1 };
      const options = allPaid
        ? {}
        : {
            arrayFilters: [
              {
                "item._id_loan": loan._id,
              },
            ],
          };
      const { ROI, term } = loan;
      //Crear lista de operaciones bulkwrite para transacciones y usuarios
      const operations = investors.map<{
        transactionsOperations: BulkWriteUpdateOneOperation<BucketTransactionMongo>;
        usersOperations: BulkWriteUpdateOneOperation<UserMongo>;
      }>((investor) => {
        const investor_id = investor._id_lender.toHexString();
        const TEM = Math.pow(1 + ROI / 100, 1 / 12) - 1;
        const amortize = Math.floor(
          investor.quantity / ((1 - Math.pow(1 / (1 + TEM), term)) / TEM)
        );
        const delayed = Math.floor(
          ((amortize * (ROI / 100)) / 360) *
            Math.abs(differenceInDays(delayedPayment.scheduledDate, now))
        );
        return {
          transactionsOperations: {
            updateOne: {
              filter: {
                _id: new RegExp(`^${investor_id}`),
                count: { $lt: 5 },
              },
              update: {
                $push: {
                  history: {
                    _id: new ObjectId(),
                    type: "collect",
                    quantity: amortize,
                    created: now,
                  },
                },
                $inc: { count: 1 },
                $setOnInsert: {
                  _id: `${investor_id}_${now.getTime()}`,
                  _id_user: investor._id_lender,
                },
              },
              upsert: true,
            },
          },
          usersOperations: {
            updateOne: {
              filter: {
                _id: investor._id_lender,
              },
              update: {
                //Si todos los pagos se han cumplido: quitar las inversiones con el id de la deuda
                ...pull,
                $inc: {
                  accountAvailable: amortize + delayed,
                  //Si NO todos los pagos se han cumplido: incrementar en uno el número de pagos de la deuda en el elemento investors correspondiente
                  ...inc,
                },
              },
              //Si NO todos los pagos se han cumplido: identificar los elementos en investors con el id de la deuda
              ...options,
            },
          },
        };
      });
      const transactionsOperations = operations.map(
        (operation) => operation.transactionsOperations
      );
      const user_id = loan._id_user.toHexString();
      //transacción para informar al deudor de su pago
      const transactionUpdateOne: BulkWriteUpdateOneOperation<BucketTransactionMongo> =
        {
          updateOne: {
            filter: { _id: new RegExp(`^${user_id}`), count: { $lt: 5 } },
            update: {
              $push: {
                history: {
                  _id: new ObjectId(),
                  type: "payment",
                  quantity: -delayedTotal,
                  created: now,
                },
              },
              $inc: { count: 1 },
              $setOnInsert: {
                _id: `${user_id}_${now.getTime()}`,
                _id_user: loan._id_user,
              },
            },
            upsert: true,
          },
        };
      transactionsOperations.unshift(transactionUpdateOne);
      await transactions.bulkWrite(transactionsOperations);
      await users.bulkWrite(
        operations.map((operation) => operation.usersOperations)
      );
    }
  }
  return;
};
