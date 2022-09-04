import { Db, Filter, ObjectId, UpdateFilter, WithId } from "mongodb";
import {
  TransactionMongo,
  InvestmentMongo,
  LoanMongo,
  UserMongo,
} from "./types";
import { isSameDay } from "date-fns";
import {
  publishInvestmentUpdate,
  publishLoanUpdate,
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
    const payments = loan.scheduledPayments
      .map((payment, index) => ({ ...payment, index }))
      .filter((payment) => {
        return (
          isSameDay(payment.scheduledDate, now) &&
          payment.status === "to be paid"
        );
      });
    for (const payment of payments) {
      const delayedTotal = payment.amortize;
      const user_id = loan.id_user;
      //transacción para informar al deudor de su pago
      const transactionUpdateOne: WithId<TransactionMongo> = {
        _id: new ObjectId(),
        type: "payment",
        quantity: -delayedTotal,
        created: now,
        id_user: user_id,
      };
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
          $push: {
            transactions: {
              $each: [transactionUpdateOne],
              $sort: { _id: -1 },
              $slice: -5,
            },
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
        loan.scheduledPayments[payment.index].status = "delayed" as const;
        //Si el deudor no tiene suficiente dinero el estatus de su deuda se vuelve atrasada
        const updatedLoan = await loans.updateOne(
          { _id: loan._id },
          {
            $set: {
              [`scheduledPayments.${payment.index}.status`]: "delayed",
              ...{},
            },
          }
        );
        if (updatedLoan.modifiedCount) {
          await users.updateOne(
            { "myLoans._id": loan._id },
            {
              $set: {
                [`myLoans.$[item].scheduledPayments.${payment.index}.status`]:
                  "delayed",
                ...{},
              },
            },
            {
              arrayFilters: [
                {
                  "item._id": loan._id,
                },
              ],
            }
          );
          publishLoanUpdate(loan);
        }
        //Si el deudor no tiene suficiente dinero el estatus de las inversiones se vuelve atrasada
        const allInvestments = await investments
          .find({ _id_loan: loan._id })
          .toArray();
        for (const investment of allInvestments) {
          investments.updateOne(
            { _id: investment._id },
            { $set: { status: "delay payment" } }
          );
          investment.status = "delay payment";
          publishInvestmentUpdate(investment);
        }
        //No se realizan mas acciones pues el pago no se realizó
        continue;
      }
      //Variable que indica que todas los pagos ya se realizaron
      const allPaid =
        loan.scheduledPayments?.filter((payment) => payment.status === "paid")
          .length +
          1 ===
        loan.scheduledPayments?.length;
      if (allPaid) {
        loan.status = "paid";
      }
      //El pago SI se realizó, por lo tanto se actualiza la deuda y el estatus del pago correspondiente se vuelve pagada
      const updatedLoan = await loans.updateOne(
        { _id: loan._id },
        {
          $set: {
            [`scheduledPayments.${payment.index}.status`]: "paid",
            ...(allPaid ? { status: "paid" } : {}),
          },
        }
      );
      if (updatedLoan.modifiedCount) {
        await users.updateOne(
          { "myLoans._id": loan._id },
          {
            $set: {
              [`myLoans.$[item].scheduledPayments.${payment.index}.status`]:
                "paid",
              ...(allPaid ? { "myLoans.$[item].status": "paid" } : {}),
            },
          },
          {
            arrayFilters: [
              {
                "item._id": loan._id,
              },
            ],
          }
        );
        publishLoanUpdate(loan);
      }
      const setStatus = allPaid ? { status: "paid" as const } : {};
      //Conseguir todas las inversiones con el id de la deuda
      const allInvestments = await investments
        .find({ _id_loan: loan._id })
        .toArray();
      const { term } = loan;
      //Crear lista de operaciones bulkwrite para transacciones y usuarios
      const operations = allInvestments.map<{
        userFilter: Filter<UserMongo>;
        userUpdate: UpdateFilter<UserMongo>;
        transactionsInsert: WithId<TransactionMongo>;
        investmentFilter: Filter<InvestmentMongo>;
        investmentUpdate: UpdateFilter<InvestmentMongo>;
      }>(({ _id, id_lender, payments, amortize }) => {
        const totalAmortize = amortize * term;
        const paid_already = amortize * (payments + 1);
        const to_be_paid = totalAmortize - paid_already;
        const newTransaction: WithId<TransactionMongo> = {
          _id: new ObjectId(),
          id_user: id_lender,
          type: "collect",
          quantity: amortize,
          created: now,
          id_borrower: loan.id_user,
          _id_loan: loan._id,
        };
        return {
          transactionsInsert: newTransaction,
          userFilter: {
            id: id_lender,
          },
          userUpdate: {
            $inc: {
              accountAvailable: amortize,
              accountToBePaid: -amortize,
            },
            $push: {
              transactions: {
                $each: [newTransaction],
                $sort: { _id: -1 },
                $slice: -5,
              },
            },
          },
          investmentFilter: {
            _id,
          },
          investmentUpdate: {
            $set: {
              to_be_paid,
              paid_already,
              //Si todos los pagos se realizaron cambiar estatus a "paid" o si todos los pagos atrasados se realizaron cambiar status a "up to date"
              ...setStatus,
            },
            $inc: {
              payments: 1,
            },
          },
        };
      });
      const transactionsOperations = operations.map(
        (operation) => operation.transactionsInsert
      );
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
        //Actualizar el los intereses moratorios en las inversiones
        const updatedInvestment = await investments.findOneAndUpdate(
          operation.investmentFilter,
          operation.investmentUpdate,
          { returnDocument: "after" }
        );
        if (updatedInvestment.value) {
          publishInvestmentUpdate(updatedInvestment.value);
        }
      }
    }
  }
  return;
};
