import { Channel, ConsumeMessage } from "amqplib";
import { addMonths, startOfMonth } from "date-fns";
import {
  Db,
  Filter,
  FindOneAndUpdateOptions,
  ObjectId,
  UpdateFilter,
  WithId,
} from "mongodb";
import {
  publishInvestmentInsert,
  publishInvestmentUpdate,
  publishLoanUpdate,
  publishTransactionInsert,
  publishUser,
} from "./subscriptions/subscriptionsUtils";
import {
  InvestmentMongo,
  LoanMongo,
  TransactionMongo,
  UserMongo,
} from "./types";

export const sendLend = async (msg: ConsumeMessage, db: Db, ch: Channel) => {
  const doc: {
    lender_id: string;
    borrower_id: string;
    quantity: number;
    loan_id: string;
    goal: number;
    raised: number;
    term: number;
    ROI: number;
    TEM: number;
  } = JSON.parse(msg.content.toString());
  const now = new Date();
  const users = db.collection<UserMongo>("users");
  const loans = db.collection<LoanMongo>("loans");
  const investments = db.collection<InvestmentMongo>("investments");
  const transactions = db.collection<TransactionMongo>("transactions");
  const lender_id = doc.lender_id;
  //Actualizar a quien presta dinero
  const resultUser = await users.findOneAndUpdate(
    { id: lender_id, account_available: { $gte: doc.quantity } },
    {
      $inc: {
        account_available: -doc.quantity,
        account_total: -doc.quantity,
      },
    },
    { returnDocument: "after" }
  );
  if (!resultUser) {
    ch.ack(msg);
    return;
  }
  publishUser(resultUser);
  const { quantity, goal, loan_id, borrower_id, term, ROI } = doc;
  const loan_oid = new ObjectId(loan_id);
  //Aumentar propiedad raised de la deuda si no se sobrepasa la propiedad goal
  const resultLoan = await loans.findOneAndUpdate(
    {
      _id: loan_oid,
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
  if (resultLoan) {
    publishLoanUpdate(resultLoan);
  }
  //Si NO se realizó la operación: incrementar saldo y no realizar más acciones
  if (!resultLoan) {
    //Actualizar a quien presta dinero
    const result = await users.findOneAndUpdate(
      { id: lender_id },
      {
        $inc: { account_available: quantity, account_total: quantity },
      },
      { returnDocument: "after" }
    );
    if (result) {
      publishUser(result);
    }
    ch.ack(msg);
    return;
  }
  const completed = resultLoan.raised === resultLoan.goal;
  const transactionOperation: WithId<TransactionMongo>[] = [
    {
      _id: new ObjectId(),
      user_id: lender_id,
      type: "invest" as const,
      quantity: -quantity,
      created_at: now,
      loan_oid: loan_oid,
      borrower_id,
    },
  ];
  interface InvestmentsOperations {
    filter: Filter<InvestmentMongo>;
    update: UpdateFilter<InvestmentMongo>;
    options?: FindOneAndUpdateOptions;
    invest?: WithId<InvestmentMongo>;
    filterUser?: Filter<UserMongo>;
    updateUser?: () => UpdateFilter<UserMongo>;
    optionsUser?: () => FindOneAndUpdateOptions;
  }
  const investmentsOperations: InvestmentsOperations[] = [];
  investmentsOperations.push({
    filter: {
      loan_oid,
      lender_id,
    },
    update: {
      $inc: { quantity },
      $setOnInsert: {
        lender_id,
        borrower_id,
        loan_oid,
        created_at: now,
        updated_at: now,
        status: completed ? "up to date" : "financing",
        payments: 0,
        term,
        roi: ROI,
        moratory: 0,
        interest_to_earn: 0,
        amortize: 0,
        paid_already: 0,
        to_be_paid: 0,
      },
    },
    options: {
      upsert: true,
      returnDocument: "after",
    },
    filterUser: {
      id: lender_id,
    },
    optionsUser: () => ({
      returnDocument: "after",
    }),
  });
  const scheduledPayments = completed
    ? new Array(doc.term).fill({}).map((_, index) => {
        const TEM = doc.TEM;
        return {
          amortize: Math.floor(
            doc.goal / ((1 - Math.pow(1 / (1 + TEM), doc.term)) / TEM)
          ),
          //Pago cada mismo dia del mes?
          scheduledDate: startOfMonth(addMonths(now, index + 1)),
          status: "to be paid" as const,
        };
      })
    : null;
  //Si raised es igual a goal: añadir fondos a quien pidio prestado
  const creditBorrowerTransaction = {
    _id: new ObjectId(),
    user_id: resultLoan.user_id,
    type: "credit" as const,
    quantity: resultLoan.goal,
    created_at: now,
  };
  //Si raised es igual a goal: actualizar inversiones y prestamo
  if (completed) {
    //Actualizar a quien pidio dinero prestado
    const user = await users.findOneAndUpdate(
      { id: resultLoan.user_id },
      {
        $inc: {
          account_available: resultLoan.goal,
          account_total: resultLoan.goal,
        },
      },
      {
        returnDocument: "after",
      }
    );
    if (user) {
      publishUser(user);
    }
    //Obtener todas las inversiones del prestamo completado
    const investmentsResults = await investments.find({ loan_oid }).toArray();
    if (investmentsResults.length === 0) {
      investmentsResults.push({
        _id: new ObjectId(),
        quantity: 0,
        lender_id,
        borrower_id,
        loan_oid,
        created_at: now,
        updated_at: now,
        status: completed ? "up to date" : "financing",
        payments: 0,
        term,
        roi: ROI,
        moratory: 0,
        interest_to_earn: 0,
        amortize: 0,
        paid_already: 0,
        to_be_paid: 0,
        status_type: "on_going",
      });
    }
    //Calcular intereses por cada prestamo de cada inversionista
    for (const inv of investmentsResults) {
      if (
        loan_id === inv.loan_oid.toHexString() &&
        lender_id === inv.lender_id
      ) {
        inv.quantity += quantity;
      }
      const TEM = Math.pow(1 + inv.roi / 100, 1 / 12) - 1;
      const amortize = Math.floor(
        inv.quantity / ((1 - Math.pow(1 / (1 + TEM), inv.term)) / TEM)
      );
      const amortizes = amortize * inv.term;
      const interest_to_earn = amortizes - inv.quantity;
      //Añadir intereses a la cuenta de cada usuario que presto dinero
      const invOperation: InvestmentsOperations = {
        filter: {
          _id: inv._id,
        },
        update: {
          $set: {
            interest_to_earn,
            amortize,
            to_be_paid: amortizes,
            status: "up to date" as const,
          },
        },
        invest: inv,
        filterUser: {
          id: inv.lender_id,
        },
        updateUser: () => ({
          $inc: {
            account_to_be_paid: amortizes,
            account_total: amortizes,
          },
        }),
        optionsUser: () => ({
          returnDocument: "after",
        }),
      };
      inv.interest_to_earn = interest_to_earn;
      inv.amortize = amortize;
      inv.to_be_paid = amortizes;
      inv.status = "up to date";
      if (
        loan_id === inv.loan_oid.toHexString() &&
        lender_id === inv.lender_id
      ) {
        investmentsOperations[0].update.$set = {
          interest_to_earn,
          amortize,
          to_be_paid: amortizes,
          status: "up to date",
        };
        investmentsOperations[0].update.$setOnInsert = {
          lender_id,
          borrower_id,
          loan_oid,
          created_at: now,
          updated_at: now,
          payments: 0,
          term,
          roi: ROI,
          moratory: 0,
          paid_already: 0,
        };
        investmentsOperations[0].updateUser = () => ({
          $inc: {
            account_to_be_paid: amortizes,
            account_total: amortizes,
          },
        });
      } else {
        investmentsOperations.push(invOperation);
      }
    }
    //Si raised es igual a goal: Actualizar scheduledPayments y status
    const updatedLoan = await loans.findOneAndUpdate(
      {
        _id: loan_oid,
      },
      {
        $set: {
          scheduledPayments,
          status: "to be paid",
        },
      },
      { returnDocument: "after" }
    );
    if (updatedLoan) {
      publishLoanUpdate(updatedLoan);
    }
    transactionOperation.push(creditBorrowerTransaction);
  }
  for (const investment of investmentsOperations) {
    const inv = investment.invest;
    const options = investment.options;
    if (inv) {
      //Añadir intereses a cada inversion
      const updatedInvestments = await investments.updateOne(
        investment.filter,
        investment.update
      );
      if (updatedInvestments.modifiedCount) {
        publishInvestmentUpdate(inv);
      }
      if (
        investment.filterUser &&
        investment.updateUser &&
        investment.optionsUser
      ) {
        const updatedUser = await users.findOneAndUpdate(
          investment.filterUser,
          investment.updateUser(),
          investment.optionsUser()
        );
        if (updatedUser) {
          publishUser(updatedUser);
        }
      }
    } else if (options) {
      const updatedInvestment = await investments.findOneAndUpdate(
        investment.filter,
        investment.update,
        options
      );
      if (updatedInvestment) {
        //const upsert = !updatedInvestment.lastErrorObject?.updatedExisting;
        const upsert = updatedInvestment;
        if (upsert) {
          publishInvestmentInsert(updatedInvestment);
        } else {
          publishInvestmentUpdate(updatedInvestment);
        }
        if (
          investment.filterUser &&
          investment.updateUser &&
          investment.optionsUser
        ) {
          const updatedUser = await users.findOneAndUpdate(
            investment.filterUser,
            investment.updateUser(),
            investment.optionsUser()
          );
          if (updatedUser) {
            publishUser(updatedUser);
          }
        }
      }
    }
  }
  //Insertar transaccion
  await transactions.insertMany(transactionOperation);
  publishTransactionInsert(transactionOperation[0]);
  ch.ack(msg);
  return;
};
