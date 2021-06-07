import { CronJob } from "cron";
import { BulkWriteUpdateOneOperation, Db, ObjectId } from "mongodb";
import {
  BucketTransactionMongo,
  ILoanInvestors,
  InvestmentMongo,
  LoanMongo,
  UserMongo,
} from "./types";
import { isBefore, differenceInDays, isSameDay } from "date-fns";

export const checkEveryDay = (db: Db): CronJob =>
  new CronJob("0 0 0 * * *", () => {
    dayFunction(db);
  });

export const dayFunction = async (db: Db): Promise<void> => {
  const loans = db.collection<LoanMongo>("loans");
  const investments = db.collection<InvestmentMongo>("investments");
  const transactions = db.collection<BucketTransactionMongo>("transactions");
  const results = await loans
    .find({ scheduledPayments: { $nin: [null] } })
    .toArray();
  const users = db.collection<UserMongo>("users");
  for (const loan of results) {
    const now = new Date();
    const delayedPayments = loan.scheduledPayments?.filter((payment) => {
      return (
        isBefore(payment.scheduledDate, now) && payment.status === "delayed"
      );
    });
    for (const delayedPayment of delayedPayments || []) {
      const delayedTotal =
        delayedPayment.amortize +
        Math.ceil(
          ((delayedPayment.amortize * (loan.ROI / 100)) / 360) *
            Math.abs(differenceInDays(delayedPayment.scheduledDate, now))
        );
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
        continue;
      }
      const user_id = loan._id_user.toHexString();
      await transactions.updateOne(
        {
          _id: new RegExp(`^${user_id}`),
          count: { $lt: 5 },
        },
        {
          $push: {
            history: {
              _id: new ObjectId(),
              type: "PAYMENT" as const,
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
        { upsert: true }
      );
      const allInvestments = await investments
        .find({ _id_loan: loan._id })
        .toArray();
      const investmentWrites = allInvestments.map<
        BulkWriteUpdateOneOperation<InvestmentMongo>
      >(({ _id, quantity, ROI, term }) => {
        const TEM = Math.pow(1 + ROI / 100, 1 / 12) - 1;
        const amortize = Math.floor(
          quantity / ((1 - Math.pow(1 / (1 + TEM), term)) / TEM)
        );
        const moratory = Math.ceil(
          ((amortize * (ROI / 100)) / 360) *
            Math.abs(differenceInDays(delayedPayment.scheduledDate, now))
        );
        return {
          updateOne: {
            filter: { _id },
            update: { $inc: { payments: 1, moratory } },
          },
        };
      });
      await investments.bulkWrite(investmentWrites);
      const result_loan = await loans.findOneAndUpdate(
        { _id: loan._id },
        { $set: { "scheduledPayments.$[item].status": "paid" } },
        {
          returnOriginal: false,
          arrayFilters: [
            {
              "item.scheduledDate": delayedPayment.scheduledDate,
            },
          ],
        }
      );
      await users.updateMany(
        { "investments._id_loan": loan._id },
        { $inc: { "investments.$[item].payments": 1 } },
        {
          arrayFilters: [
            {
              "item._id_loan": loan._id,
            },
          ],
        }
      );
      if (!result_loan.value) {
        continue;
      }
      if (
        result_loan.value.scheduledPayments?.filter(
          (payment) => payment.status === "delayed"
        ).length === 0
      ) {
        await investments.updateMany(
          { _id_loan: loan._id },
          { $set: { status: "up to date" } }
        );
      }
      if (
        result_loan.value.status !== "paid" &&
        result_loan.value.scheduledPayments?.filter(
          (payment) => payment.status === "paid"
        ).length === result_loan.value.scheduledPayments?.length
      ) {
        await loans.updateOne({ _id: loan._id }, { $set: { status: "paid" } });
        await users.updateMany(
          { "investments._id_loan": loan._id },
          { $pull: { investments: { _id_loan: loan._id } } }
        );
        await investments.updateMany(
          { _id_loan: loan._id },
          { $set: { status: "paid" } }
        );
      }
      const investors = result_loan.value.investors.reduce<ILoanInvestors[]>(
        (acc, item) => {
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
        },
        []
      );
      for (const investor of investors) {
        const investor_id = investor._id_lender.toHexString();
        const { ROI, term } = result_loan.value;
        const TEM = Math.pow(1 + ROI / 100, 1 / 12) - 1;
        const amortize = Math.floor(
          investor.quantity / ((1 - Math.pow(1 / (1 + TEM), term)) / TEM)
        );
        const delayed = Math.floor(
          ((amortize * (ROI / 100)) / 360) *
            Math.abs(differenceInDays(delayedPayment.scheduledDate, now))
        );
        await transactions.updateOne(
          {
            _id: new RegExp(`^${investor_id}`),
            count: { $lt: 5 },
          },
          {
            $push: {
              history: {
                _id: new ObjectId(),
                type: "CREDIT" as const,
                quantity: amortize,
                created: now,
              },
            },
            $inc: { count: 1 },
            $setOnInsert: {
              _id: `${investor_id}_${now.getTime()}`,
              _id_user: investor._id_lender,
            },
          },
          { upsert: true }
        );
        await users.updateOne(
          {
            _id: investor._id_lender,
          },
          {
            $inc: {
              accountAvailable: amortize + delayed,
            },
          }
        );
      }
    }
  }
  return;
};

export const checkEveryMonth = (db: Db): CronJob =>
  new CronJob("0 0 0 1 * *", () => {
    monthFunction(db);
  });

export const monthFunction = async (db: Db): Promise<void> => {
  const loans = db.collection<LoanMongo>("loans");
  const investments = db.collection<InvestmentMongo>("investments");
  const transactions = db.collection<BucketTransactionMongo>("transactions");
  const results = await loans
    .find({ scheduledPayments: { $nin: [null] } })
    .toArray();
  const users = db.collection<UserMongo>("users");
  for (const loan of results) {
    const now = new Date();
    const payments = loan.scheduledPayments?.filter((payment) => {
      return (
        isSameDay(payment.scheduledDate, now) && payment.status === "to be paid"
      );
    });
    for (const payment of payments || []) {
      const delayedTotal = payment.amortize;
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
        await investments.updateMany(
          { _id_loan: loan._id },
          {
            $set: { status: "delay payment" },
          }
        );
        continue;
      }
      const user_id = loan._id_user.toHexString();
      await transactions.updateOne(
        {
          _id: new RegExp(`^${user_id}`),
          count: { $lt: 5 },
        },
        {
          $push: {
            history: {
              _id: new ObjectId(),
              type: "PAYMENT" as const,
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
        { upsert: true }
      );
      await investments.updateMany(
        { _id_loan: loan._id },
        { $inc: { payments: 1 } }
      );
      const result_loan = await loans.findOneAndUpdate(
        { _id: loan._id },
        { $set: { "scheduledPayments.$[item].status": "paid" } },
        {
          returnOriginal: false,
          arrayFilters: [
            {
              "item.scheduledDate": payment.scheduledDate,
            },
          ],
        }
      );
      await users.updateMany(
        { "investments._id_loan": loan._id },
        { $inc: { "investments.$[item].payments": 1 } },
        {
          arrayFilters: [
            {
              "item._id_loan": loan._id,
            },
          ],
        }
      );
      if (!result_loan.value) {
        continue;
      }
      if (
        result_loan.value.status !== "paid" &&
        result_loan.value.scheduledPayments?.filter(
          (payment) => payment.status === "paid"
        ).length === result_loan.value.scheduledPayments?.length
      ) {
        await loans.updateOne({ _id: loan._id }, { $set: { status: "paid" } });
        await users.updateMany(
          { "investments._id_loan": loan._id },
          { $pull: { investments: { _id_loan: loan._id } } }
        );
        await investments.updateMany(
          { _id_loan: loan._id },
          { $set: { status: "paid" } }
        );
      }
      const investors = result_loan.value.investors.reduce<ILoanInvestors[]>(
        (acc, item) => {
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
        },
        []
      );
      for (const investor of investors) {
        const investor_id = investor._id_lender.toHexString();
        const { ROI, term } = result_loan.value;
        const TEM = Math.pow(1 + ROI / 100, 1 / 12) - 1;
        const amortize = Math.floor(
          investor.quantity / ((1 - Math.pow(1 / (1 + TEM), term)) / TEM)
        );
        await transactions.updateOne(
          {
            _id: new RegExp(`^${investor_id}`),
            count: { $lt: 5 },
          },
          {
            $push: {
              history: {
                _id: new ObjectId(),
                type: "CREDIT" as const,
                quantity: amortize,
                created: now,
              },
            },
            $inc: { count: 1 },
            $setOnInsert: {
              _id: `${investor_id}_${now.getTime()}`,
              _id_user: investor._id_lender,
            },
          },
          { upsert: true }
        );
        await users.updateOne(
          {
            _id: investor._id_lender,
          },
          {
            $inc: {
              accountAvailable: amortize,
            },
          }
        );
      }
    }
  }
  return;
};
