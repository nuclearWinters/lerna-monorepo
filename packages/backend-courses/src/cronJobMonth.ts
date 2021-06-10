import { BulkWriteUpdateOneOperation, Db, ObjectId } from "mongodb";
import {
  BucketTransactionMongo,
  ILoanInvestors,
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
          _id: loan._id_user,
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
      //Se actualizan todos las inversiones y se suma 1 a los pagos realizados, aparte, si todos los pagos ya se realizaron su estatus se vuelve pagado
      await investments.updateMany(
        { _id_loan: loan._id },
        {
          $inc: { payments: 1 },
          ...(allPaid ? { $set: { status: "paid" } } : {}),
        }
      );
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
                    _id_borrower: loan._id_user,
                    _id_loan: loan._id,
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
                  accountAvailable: amortize,
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
