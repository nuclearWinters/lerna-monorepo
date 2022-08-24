import {
  AnyBulkWriteOperation,
  Db,
  Filter,
  ObjectId,
  OptionalId,
  UpdateFilter,
} from "mongodb";
import {
  TransactionMongo,
  InvestmentMongo,
  LoanMongo,
  UserMongo,
} from "./types";
import { isBefore, differenceInDays } from "date-fns";
import {
  publishTransactionInsert,
  publishUser,
} from "./subscriptions/subscriptionsUtils";

export const dayFunction = async (db: Db): Promise<void> => {
  const loans = db.collection<LoanMongo>("loans");
  const investments = db.collection<InvestmentMongo>("investments");
  const transactions = db.collection<TransactionMongo>("transactions");
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
      const moratory = Math.floor(
        ((delayedPayment.amortize * (loan.ROI / 100)) / 360) *
          Math.abs(differenceInDays(delayedPayment.scheduledDate, now))
      );
      const delayedTotal = delayedPayment.amortize + moratory;
      //Se actualiza el usuario del deudor al mover dinero de cuenta
      const result = await users.findOneAndUpdate(
        {
          id: loan.id_user,
          accountAvailable: { $gte: delayedTotal },
        },
        {
          $inc: {
            accountAvailable: -delayedTotal,
            accountTotal: -delayedTotal,
          },
        },
        { returnDocument: "after" }
      );
      if (result.value) {
        publishUser(result.value);
      }
      //Si el deudor no tiene suficiente dinero el estatus ya no se realizan acciones
      if (!result.value) {
        const allInvestments = await investments
          .find({ _id_loan: loan._id })
          .toArray();
        for (const invest of allInvestments) {
          const moratory = Math.floor(
            (invest.amortize * (loan.ROI / 100)) / 360
          );
          investments.updateOne(
            { _id: invest._id },
            {
              $inc: {
                moratory,
              },
            }
          );
          const result = await users.findOneAndUpdate(
            { id: invest.id_lender },
            {
              $inc: {
                accountInterests: moratory,
                accountTotal: moratory,
              },
            },
            {
              returnDocument: "after",
            }
          );
          if (result.value) {
            publishUser(result.value);
          }
        }
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
          $set: {
            "scheduledPayments.$[item].status": "paid",
            ...(allPaid ? { status: "paid" } : {}),
          },
        },
        {
          arrayFilters: [
            {
              "item.scheduledDate": delayedPayment.scheduledDate,
            },
          ],
        }
      );
      const setStatus =
        noDelayed || allPaid
          ? {
              status: allPaid ? ("paid" as const) : ("up to date" as const),
            }
          : {};
      //Conseguir todas las inversiones con el id de la deuda
      const allInvestments = await investments
        .find({ _id_loan: loan._id })
        .toArray();
      //Crear lista de operaciones con intereses moratorios
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
      const { ROI, term } = loan;
      //Crear lista de operaciones bulkwrite para transacciones y usuarios
      const operations = allInvestments.map<{
        userFilter: Filter<UserMongo>;
        userUpdate: UpdateFilter<UserMongo>;
        transactionsInsert: OptionalId<TransactionMongo>;
      }>(({ id_lender, amortize, quantity }) => {
        //Decimales?
        const lent = quantity / term;
        const moratory = Math.floor((amortize * (ROI / 100)) / 360);
        return {
          transactionsInsert: {
            _id: new ObjectId(),
            id_user: id_lender,
            type: "collect",
            quantity: amortize,
            created: now,
            id_borrower: loan.id_user,
            _id_loan: loan._id,
          },
          userFilter: {
            id: id_lender,
          },
          userUpdate: {
            $inc: {
              accountAvailable: amortize + moratory,
              accountLent: -lent,
              accountInterests: -(amortize - lent + moratory),
            },
          },
        };
      });
      const transactionsOperations = operations.map(
        (operation) => operation.transactionsInsert
      );
      const user_id = loan.id_user;
      //transacción para informar al deudor de su pago
      const transactionUpdateOne: OptionalId<TransactionMongo> = {
        _id: new ObjectId(),
        id_user: user_id,
        type: "payment",
        quantity: -delayedTotal,
        created: now,
      };
      transactionsOperations.unshift(transactionUpdateOne);
      transactions.insertMany(transactionsOperations);
      for (const operation of operations) {
        const result = await users.findOneAndUpdate(
          operation.userFilter,
          operation.userUpdate,
          { returnDocument: "after" }
        );
        publishTransactionInsert(operation.transactionsInsert);
        if (result.value) {
          publishUser(result.value);
        }
      }
    }
  }
  return;
};
