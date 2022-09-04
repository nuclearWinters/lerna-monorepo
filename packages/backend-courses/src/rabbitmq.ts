import { Channel, ConsumeMessage } from "amqplib";
import { addMonths, startOfMonth } from "date-fns";
import { Db, ObjectId, WithId } from "mongodb";
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
  if (!resultUser.value) {
    ch.ack(msg);
    return;
  }
  publishUser(resultUser.value);
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
  if (resultLoan.value) {
    publishLoanUpdate(resultLoan.value);
  }
  //Si NO se realizó la operación: incrementar saldo y no realizar más acciones
  if (!resultLoan.value) {
    //Actualizar a quien presta dinero
    const result = await users.findOneAndUpdate(
      { id },
      {
        $inc: { accountAvailable: quantity, accountTotal: quantity },
      },
      { returnDocument: "after" }
    );
    if (result.value) {
      publishUser(result.value);
    }
    ch.ack(msg);
    return;
  }
  const completed = resultLoan.value.raised === resultLoan.value.goal;
  //Si se realizo la operacion crear o actualizar inversion
  const updatedInvestment = await investments.findOneAndUpdate(
    {
      _id_loan,
      id_borrower,
      id_lender: id,
    },
    {
      $inc: { quantity },
      $setOnInsert: {
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
  const transactionOperation: WithId<TransactionMongo>[] = [
    {
      _id: new ObjectId(),
      id_user: id,
      type: "invest" as const,
      quantity: -quantity,
      created: now,
      _id_loan,
      id_borrower,
    },
  ];
  if (updatedInvestment.value) {
    const upsert = !updatedInvestment.lastErrorObject?.updatedExisting;
    await users.updateOne(
      { id },
      {
        $push: {
          transactions: {
            $each: [transactionOperation[0]],
            $sort: { _id: 1 },
            $slice: -6,
          },
          ...(upsert
            ? {
                myInvestments: {
                  $each: [updatedInvestment.value],
                  $sort: { _id: 1 },
                  $slice: -6,
                },
              }
            : {}),
        },
        ...(!upsert
          ? {
              $inc: { "myInvestments.$[item].quantity": quantity },
            }
          : {}),
      },
      {
        ...(!upsert
          ? {
              arrayFilters: [
                {
                  "item._id": updatedInvestment.value._id,
                },
              ],
            }
          : {}),
      }
    );
    if (upsert) {
      publishInvestmentInsert(updatedInvestment.value);
    } else {
      publishInvestmentUpdate(updatedInvestment.value);
    }
  }
  const goalArchived = resultLoan.value.raised === resultLoan.value.goal;
  //Si raised es igual a goal: añadir fondos a quien pidio prestado
  const creditBorrowerTransaction = {
    _id: new ObjectId(),
    id_user: resultLoan.value.id_user,
    type: "credit" as const,
    quantity: resultLoan.value.goal,
    created: now,
  };
  const scheduledPayments = new Array(doc.term).fill({}).map((_, index) => {
    const TEM = doc.TEM;
    return {
      amortize: Math.floor(
        doc.goal / ((1 - Math.pow(1 / (1 + TEM), doc.term)) / TEM)
      ),
      //Pago cada mismo dia del mes?
      scheduledDate: startOfMonth(addMonths(now, index + 1)),
      status: "to be paid" as const,
    };
  });
  //Actualizar a quien pidio dinero prestado
  const { value } = await users.findOneAndUpdate(
    { id: resultLoan.value.id_user },
    {
      $inc: {
        "myLoans.$[item].raised": quantity,
        "myLoans.$[item].pending": -quantity,
        ...(goalArchived
          ? {
              accountAvailable: resultLoan.value.goal,
              accountTotal: resultLoan.value.goal,
            }
          : {}),
      },
      ...(goalArchived
        ? {
            $push: {
              transactions: {
                $each: [creditBorrowerTransaction],
                $sort: { _id: 1 },
                $slice: -6,
              },
            },
            $set: {
              "myLoans.$[item].scheduledPayments": scheduledPayments,
              "myLoans.$[item].status": "to be paid",
            },
          }
        : {}),
    },
    {
      returnDocument: "after",
      arrayFilters: [
        {
          "item._id": _id_loan,
        },
      ],
    }
  );
  //Si raised es igual a goal: actualizar inversiones y prestamo
  if (goalArchived) {
    //Obtener todas las inversiones del prestamo completado
    const investmentsResults = await investments.find({ _id_loan }).toArray();
    //Calcular intereses por cada prestamo de cada inversionista
    for (const inv of investmentsResults) {
      const TEM = Math.pow(1 + inv.ROI / 100, 1 / 12) - 1;
      const amortize = Math.floor(
        inv.quantity / ((1 - Math.pow(1 / (1 + TEM), inv.term)) / TEM)
      );
      const amortizes = amortize * inv.term;
      const interest_to_earn = amortizes - inv.quantity;
      //Añadir intereses a la cuenta de cada usuario que presto dinero
      const updatedUser = await users.findOneAndUpdate(
        {
          id: inv.id_lender,
        },
        {
          $inc: {
            accountToBePaid: amortizes,
            accountTotal: amortizes,
          },
          $push: {
            transactions: {
              $each: [transactionOperation[0]],
              $sort: { _id: 1 },
              $slice: -6,
            },
          },
          $set: {
            "myInvestments.$[item].interest_to_earn": interest_to_earn,
            "myInvestments.$[item].amortize": amortize,
            "myInvestments.$[item].to_be_paid": amortizes,
          },
        },
        {
          returnDocument: "after",
          arrayFilters: [
            {
              "item._id": inv._id,
            },
          ],
        }
      );
      if (updatedUser.value) {
        publishUser(updatedUser.value);
      }
      //Añadir intereses a cada inversion
      const updatedInvestments = await investments.updateOne(
        {
          _id: inv._id,
        },
        {
          $set: {
            interest_to_earn,
            amortize,
            to_be_paid: amortizes,
          },
        }
      );
      if (updatedInvestments.modifiedCount) {
        inv.interest_to_earn = interest_to_earn;
        inv.amortize = amortize;
        inv.to_be_paid = amortizes;
        publishInvestmentUpdate(inv);
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
    if (updatedLoan.value) {
      publishLoanUpdate(updatedLoan.value);
    }
    transactionOperation.push(creditBorrowerTransaction);
  }
  if (value) {
    publishUser(value);
  }
  //Insertar transaccion
  await transactions.insertMany(transactionOperation);
  publishTransactionInsert(transactionOperation[0]);
  ch.ack(msg);
  return;
};
