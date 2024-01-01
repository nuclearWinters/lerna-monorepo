import {
  Db,
  Filter,
  FindOneAndUpdateOptions,
  ObjectId,
  UpdateFilter,
  WithId,
} from "mongodb";
import {
  TransactionMongo,
  InvestmentMongo,
  LoanMongo,
  UserMongo,
} from "./types";
import { isBefore, differenceInDays } from "date-fns";
import {
  publishInvestmentUpdate,
  publishLoanUpdate,
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
    const delayedPayments = loan.scheduledPayments
      .map((payment, index) => ({ ...payment, index }))
      .filter((payment) => {
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
      const user_id = loan.id_user;
      //transacción para informar al deudor de su pago
      const transactionUpdateOne: WithId<TransactionMongo> = {
        _id: new ObjectId(),
        id_user: user_id,
        type: "payment",
        quantity: -delayedTotal,
        created_at: now,
      };
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
      if (result) {
        publishUser(result);
      }
      //Si el deudor no tiene suficiente dinero el estatus ya no se realizan acciones
      if (!result) {
        const allInvestments = await investments
          .find({ _id_loan: loan._id })
          .toArray();
        for (const invest of allInvestments) {
          const moratory = Math.floor(
            (invest.amortize * (loan.ROI / 100)) / 360
          );
          const updatedInvestments = await investments.updateOne(
            { _id: invest._id },
            {
              $inc: {
                moratory,
              },
            }
          );
          invest.moratory += moratory;
          if (updatedInvestments.modifiedCount) {
            publishInvestmentUpdate(invest);
          }
          const result = await users.findOneAndUpdate(
            { id: invest.id_lender },
            {
              $inc: {
                accountToBePaid: moratory,
                accountTotal: moratory,
              },
            },
            {
              returnDocument: "after",
            }
          );
          if (result) {
            publishUser(result);
          }
        }
        continue;
      }
      //El pago SI se realizó, por lo tanto se actualiza la deuda y el estatus del pago correspondiente se vuelve pagada
      loan.scheduledPayments[delayedPayment.index].status = "paid" as const;
      if (allPaid) {
        loan.status = "paid";
      }
      const updatedLoan = await loans.updateOne(
        { _id: loan._id },
        {
          $set: {
            [`scheduledPayments.${delayedPayment.index}.status`]: "paid",
            ...(allPaid ? { status: "paid" } : {}),
          },
        }
      );
      if (updatedLoan.modifiedCount) {
        publishLoanUpdate(loan);
      }
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
      const { ROI, term } = loan;
      //Crear lista de operaciones bulkwrite para transacciones y usuarios
      const operations = allInvestments.map<{
        userFilter: Filter<UserMongo>;
        userUpdate: UpdateFilter<UserMongo>;
        transactionsInsert: WithId<TransactionMongo>;
        investmentsFilter: Filter<InvestmentMongo>;
        investmentsUpdates: UpdateFilter<InvestmentMongo>;
        userOptions: FindOneAndUpdateOptions;
        investment: InvestmentMongo;
        to_be_paid: number;
        paid_already: number;
      }>((investment) => {
        const { _id, id_lender, payments, amortize } = investment;
        const moratory = Math.floor((amortize * (ROI / 100)) / 360);
        const totalAmortize = amortize * term;
        const paid_already = amortize * (payments + 1);
        const to_be_paid = totalAmortize - paid_already;
        const newTransaction: WithId<TransactionMongo> = {
          _id: new ObjectId(),
          id_user: id_lender,
          type: "collect",
          quantity: amortize,
          created_at: now,
          id_borrower: loan.id_user,
          _id_loan: loan._id,
        };
        return {
          to_be_paid,
          paid_already,
          investment,
          transactionsInsert: newTransaction,
          userFilter: {
            id: id_lender,
          },
          userUpdate: {
            $inc: {
              accountAvailable: amortize + moratory,
              accountToBePaid: -(amortize + moratory),
            },
          },
          userOptions: {
            returnDocument: "after",
          },
          investmentsFilter: {
            _id,
          },
          investmentsUpdates: {
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
      transactions.insertMany(transactionsOperations);
      for (const operation of operations) {
        const result = await users.findOneAndUpdate(
          operation.userFilter,
          operation.userUpdate,
          operation.userOptions
        );
        publishTransactionInsert(operation.transactionsInsert);
        if (result) {
          publishUser(result);
        }
        //Actualizar el los intereses moratorios en las inversiones
        const updatedInvestment = await investments.updateOne(
          operation.investmentsFilter,
          operation.investmentsUpdates
        );
        if (updatedInvestment.modifiedCount) {
          if (noDelayed || allPaid) {
            operation.investment.status = allPaid ? "paid" : "up to date";
          }
          operation.investment.to_be_paid = operation.to_be_paid;
          operation.investment.paid_already = operation.paid_already;
          operation.investment.payments = operation.investment.payments += 1;
          publishInvestmentUpdate(operation.investment);
        }
      }
    }
  }
  return;
};
