import { AnyBulkWriteOperation, Db, ObjectId } from "mongodb";
import {
  BucketTransactionMongo,
  InvestmentMongo,
  LoanMongo,
  UserMongo,
} from "./types";
import { isSameDay } from "date-fns";

export const monthFunction = async (db: Db): Promise<void> => {
  const loans = db.collection<LoanMongo>("loans");
  const investments = db.collection<InvestmentMongo>("investments");
  const transactions = db.collection<BucketTransactionMongo>("transactions");
  const results = await loans
    .find({ "scheduledPayments.status": "to be paid" })
    .toArray();
  const users = db.collection<UserMongo>("users");
  for (const loan of results) {
    const now = new Date();
    if (!loan.scheduledPayments) {
      continue;
    }
    const payments = loan.scheduledPayments.filter((payment) => {
      return (
        isSameDay(payment.scheduledDate, now) && payment.status === "to be paid"
      );
    });
    for (const payment of payments) {
      const delayedTotal = payment.amortize;
      //Se actualiza el usuario del deudor al mover dinero de cuenta
      const result = await users.updateOne(
        {
          id: loan.id_user,
          accountAvailable: { $gte: delayedTotal },
        },
        {
          $inc: {
            accountAvailable: -delayedTotal,
          },
        }
      );
      if (result.modifiedCount === 0) {
        //Si el deudor no tiene suficiente dinero el estatus de su deuda se vuelve atrasada
        await loans.updateOne(
          { _id: loan._id },
          { $set: { "scheduledPayments.$[item].status": "delayed" } },
          {
            arrayFilters: [
              {
                "item.scheduledDate": payment.scheduledDate,
              },
            ],
          }
        );
        //Si el deudor no tiene suficiente dinero el estatus de las inversiones se vuelve atrasada
        await investments.updateMany(
          { _id_loan: loan._id },
          {
            $set: { status: "delay payment" },
          }
        );
        //No se realizan mas acciones pues el pago no se realizó
        continue;
      }
      //Variable que indica que todas los pagos ya se realizaron
      const allPaid =
        loan.scheduledPayments?.filter((payment) => payment.status === "paid")
          .length +
          1 ===
        loan.scheduledPayments?.length;
      //El pago SI se realizó, por lo tanto se actualiza la deuda y el estatus del pago correspondiente se vuelve pagada
      await loans.updateOne(
        { _id: loan._id },
        {
          $set: {
            "scheduledPayments.$[item].status": "paid",
            ...(allPaid ? { status: "paid" } : {}),
          },
        },
        {
          arrayFilters: [
            {
              "item.scheduledDate": payment.scheduledDate,
            },
          ],
        }
      );
      const setStatus = allPaid ? { status: "paid" as const } : {};
      //Conseguir todas las inversiones con el id de la deuda
      const allInvestments = await investments
        .find({ _id_loan: loan._id })
        .toArray();
      //Actualizar lista de operaciones con intereses moratorios
      const investmentWrites = allInvestments.map<
        AnyBulkWriteOperation<InvestmentMongo>
      >(({ _id, amortize, term, payments }) => {
        const totalAmortize = amortize * term;
        const paid_already = amortize * (payments + 1);
        const still_invested = totalAmortize - paid_already;
        return {
          updateOne: {
            filter: { _id },
            update: {
              $set: {
                still_invested,
                paid_already,
                //Si todos los pagos se realizaron cambiar estatus a "paid" o si todos los pagos atrasados se realizaron cambiar status a "up to date"
                ...setStatus,
              },
              $inc: {
                payments: 1,
              },
            },
          },
        };
      });
      //Actualizar el los intereses moratorios en las inversiones
      await investments.bulkWrite(investmentWrites);
      const { term } = loan;
      //Crear lista de operaciones bulkwrite para transacciones y usuarios
      const operations = allInvestments.map<{
        transactionsOperations: AnyBulkWriteOperation<BucketTransactionMongo>;
        usersOperations: AnyBulkWriteOperation<UserMongo>;
      }>(({ id_lender, quantity, amortize }) => {
        const lent = quantity / term;
        return {
          transactionsOperations: {
            updateOne: {
              filter: {
                _id: new RegExp(`^${id_lender}`),
                count: { $lt: 5 },
              },
              update: {
                $push: {
                  history: {
                    _id: new ObjectId(),
                    type: "collect",
                    quantity: amortize,
                    created: now,
                    id_borrower: loan.id_user,
                    _id_loan: loan._id,
                  },
                },
                $inc: { count: 1 },
                $setOnInsert: {
                  _id: `${id_lender}_${now.getTime()}`,
                  id_user: id_lender,
                },
              },
              upsert: true,
            },
          },
          usersOperations: {
            updateOne: {
              filter: {
                id: id_lender,
              },
              update: {
                $inc: {
                  accountAvailable: amortize,
                  accountLent: -lent,
                  accountInterests: -(amortize - lent),
                },
              },
            },
          },
        };
      });
      const transactionsOperations = operations.map(
        (operation) => operation.transactionsOperations
      );
      const user_id = loan.id_user;
      //transacción para informar al deudor de su pago
      const transactionUpdateOne: AnyBulkWriteOperation<BucketTransactionMongo> =
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
                id_user: loan.id_user,
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
