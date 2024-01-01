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
    id_lender: string;
    id_borrower: string;
    quantity: number;
    id_loan: string;
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
  const id = doc.id_lender;
  //Actualizar a quien presta dinero
  const resultUser = await users.findOneAndUpdate(
    { id, accountAvailable: { $gte: doc.quantity } },
    {
      $inc: {
        accountAvailable: -doc.quantity,
        accountTotal: -doc.quantity,
      },
    },
    { returnDocument: "after" }
  );
  if (!resultUser) {
    ch.ack(msg);
    return;
  }
  publishUser(resultUser);
  const { quantity, goal, id_loan, id_borrower, term, ROI } = doc;
  const _id_loan = new ObjectId(id_loan);
  //Aumentar propiedad raised de la deuda si no se sobrepasa la propiedad goal
  const resultLoan = await loans.findOneAndUpdate(
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
  if (resultLoan) {
    publishLoanUpdate(resultLoan);
  }
  //Si NO se realizó la operación: incrementar saldo y no realizar más acciones
  if (!resultLoan) {
    //Actualizar a quien presta dinero
    const result = await users.findOneAndUpdate(
      { id },
      {
        $inc: { accountAvailable: quantity, accountTotal: quantity },
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
      id_user: id,
      type: "invest" as const,
      quantity: -quantity,
      created_at: now,
      _id_loan,
      id_borrower,
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
      _id_loan,
      id_lender: id,
    },
    update: {
      $inc: { quantity },
      $setOnInsert: {
        id_lender: id,
        id_borrower,
        _id_loan,
        created_at: now,
        updated_at: now,
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
    options: {
      upsert: true,
      returnDocument: "after",
    },
    filterUser: {
      id,
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
    id_user: resultLoan.id_user,
    type: "credit" as const,
    quantity: resultLoan.goal,
    created_at: now,
  };
  //Si raised es igual a goal: actualizar inversiones y prestamo
  if (completed) {
    //Actualizar a quien pidio dinero prestado
    const user = await users.findOneAndUpdate(
      { id: resultLoan.id_user },
      {
        $inc: {
          accountAvailable: resultLoan.goal,
          accountTotal: resultLoan.goal,
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
    const investmentsResults = await investments.find({ _id_loan }).toArray();
    if (investmentsResults.length === 0) {
      investmentsResults.push({
        _id: new ObjectId(),
        quantity: 0,
        id_lender: id,
        id_borrower,
        _id_loan,
        created_at: now,
        updated_at: now,
        status: completed ? "up to date" : "financing",
        payments: 0,
        term,
        ROI,
        moratory: 0,
        interest_to_earn: 0,
        amortize: 0,
        paid_already: 0,
        to_be_paid: 0,
      });
    }
    //Calcular intereses por cada prestamo de cada inversionista
    for (const inv of investmentsResults) {
      if (id_loan === inv._id_loan.toHexString() && id === inv.id_lender) {
        inv.quantity += quantity;
      }
      const TEM = Math.pow(1 + inv.ROI / 100, 1 / 12) - 1;
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
          id: inv.id_lender,
        },
        updateUser: () => ({
          $inc: {
            accountToBePaid: amortizes,
            accountTotal: amortizes,
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
      if (id_loan === inv._id_loan.toHexString() && id === inv.id_lender) {
        investmentsOperations[0].update.$set = {
          interest_to_earn,
          amortize,
          to_be_paid: amortizes,
          status: "up to date",
        };
        investmentsOperations[0].update.$setOnInsert = {
          id_lender: id,
          id_borrower,
          _id_loan,
          created_at: now,
          updated_at: now,
          payments: 0,
          term,
          ROI,
          moratory: 0,
          paid_already: 0,
        };
        investmentsOperations[0].updateUser = () => ({
          $inc: {
            accountToBePaid: amortizes,
            accountTotal: amortizes,
          },
        });
      } else {
        investmentsOperations.push(invOperation);
      }
    }
    //Si raised es igual a goal: Actualizar scheduledPayments y status
    const updatedLoan = await loans.findOneAndUpdate(
      {
        _id: _id_loan,
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
