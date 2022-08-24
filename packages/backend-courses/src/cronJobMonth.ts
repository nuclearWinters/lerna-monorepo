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
import { isSameDay } from "date-fns";
import {
  publishTransactionInsert,
  publishUser,
} from "./subscriptions/subscriptionsUtils";

export const monthFunction = async (db: Db): Promise<void> => {
  const loans = db.collection<LoanMongo>("loans");
  const investments = db.collection<InvestmentMongo>("investments");
  const transactions = db.collection<TransactionMongo>("transactions");
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
        {
          returnDocument: "after",
        }
      );
      if (result.value) {
        publishUser(result.value);
      }
      if (!result.value) {
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
        userFilter: Filter<UserMongo>;
        userUpdate: UpdateFilter<UserMongo>;
        transactionsInsert: OptionalId<TransactionMongo>;
      }>(({ id_lender, quantity, amortize }) => {
        const lent = quantity / term;
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
              accountAvailable: amortize,
              accountLent: -lent,
              accountInterests: -(amortize - lent),
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
        type: "payment",
        quantity: -delayedTotal,
        created: now,
        id_user: user_id,
      };
      transactionsOperations.unshift(transactionUpdateOne);
      await transactions.insertMany(transactionsOperations);
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
