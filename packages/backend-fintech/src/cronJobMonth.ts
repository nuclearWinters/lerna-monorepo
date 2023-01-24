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
      //Variable que indica que todas los pagos ya se realizaron
      const allPaid =
        loan.scheduledPayments?.filter((payment) => payment.status === "paid")
          .length +
          1 ===
        loan.scheduledPayments?.length;
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
        loan.scheduledPayments[payment.index].status = "delayed";
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
          publishLoanUpdate(loan);
        }
        //Si el deudor no tiene suficiente dinero el estatus de las inversiones se vuelve atrasada
        const allInvestments = await investments
          .find({ _id_loan: loan._id })
          .toArray();
        const ids = allInvestments.reduce<{
          usersIds: string[];
          investmentIds: ObjectId[];
        }>(
          (curr, next) => {
            curr.usersIds.push(next.id_lender);
            curr.investmentIds.push(next._id);
            return curr;
          },
          { usersIds: [], investmentIds: [] }
        );
        await investments.updateMany(
          { _id: { $in: ids.investmentIds } },
          { $set: { status: "delay payment" } }
        );
        for (const investment of allInvestments) {
          investment.status = "delay payment";
          publishInvestmentUpdate(investment);
        }
        //No se realizan mas acciones pues el pago no se realizó
        continue;
      }
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
        userOptions: FindOneAndUpdateOptions;
        investment: InvestmentMongo;
        to_be_paid: number;
        paid_already: number;
      }>((investment) => {
        const { _id, id_lender, payments, amortize } = investment;
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
          to_be_paid,
          paid_already,
          investment,
          transactionsInsert: newTransaction,
          userFilter: {
            id: id_lender,
          },
          userUpdate: {
            $inc: {
              accountAvailable: amortize,
              accountToBePaid: -amortize,
            },
          },
          userOptions: {
            returnDocument: "after",
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
          operation.userOptions
        );
        publishTransactionInsert(operation.transactionsInsert);
        if (result.value) {
          publishUser(result.value);
        }
        //Actualizar el los intereses moratorios en las inversiones
        const updatedInvestment = await investments.updateOne(
          operation.investmentFilter,
          operation.investmentUpdate
        );
        if (updatedInvestment.modifiedCount) {
          if (allPaid) {
            operation.investment.status = "paid";
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
