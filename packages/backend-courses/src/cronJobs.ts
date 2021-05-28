import { CronJob } from "cron";
import { Db, ObjectID } from "mongodb";
import { BucketTransactionMongo, LoanMongo, UserMongo } from "./types";
import { isBefore, differenceInDays, isSameDay } from "date-fns";

export const checkEveryDay = (db: Db): CronJob =>
  new CronJob("0 0 0 * * *", () => {
    dayFunction(db);
  });

export const dayFunction = async (db: Db): Promise<void> => {
  const loans = db.collection<LoanMongo>("loans");
  const transactions = db.collection<BucketTransactionMongo>("transactions");
  const results = await loans
    .find({ scheduledPayments: { $nin: [null] } })
    .toArray();
  const users = db.collection<UserMongo>("users");
  results.forEach(async (loan) => {
    const now = new Date();
    const delayedPayments = loan.scheduledPayments?.filter((payment) => {
      return (
        isBefore(payment.scheduledDate, now) && payment.status === "delayed"
      );
    });
    delayedPayments?.forEach(async (delayedPayment) => {
      const delayedTotal = Math.round(
        delayedPayment.amortize +
          ((delayedPayment.amortize * (loan.ROI / 100)) / 360) *
            Math.abs(differenceInDays(delayedPayment.scheduledDate, now))
      );
      const result = await users.updateOne(
        {
          _id: loan._id_user,
          accountAvailable: { $gt: delayedTotal },
        },
        {
          $inc: {
            accountAvailable: -delayedTotal,
            accountTotal: -delayedTotal,
          },
        }
      );
      if (result.modifiedCount === 0) {
        return;
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
              _id: new ObjectID(),
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
      await loans.updateOne(
        { _id: loan._id },
        { $set: { "scheduledPayments.$[item].status": "paid" } },
        {
          arrayFilters: [
            {
              "item.scheduledDate": delayedPayment.scheduledDate,
            },
          ],
        }
      );
    });
  });
  return;
};

export const checkEveryMonth = (db: Db): CronJob =>
  new CronJob("0 0 0 1 * *", () => {
    monthFunction(db);
  });

export const monthFunction = async (db: Db): Promise<void> => {
  const loans = db.collection<LoanMongo>("loans");
  const transactions = db.collection<BucketTransactionMongo>("transactions");
  const results = await loans
    .find({ scheduledPayments: { $nin: [null] } })
    .toArray();
  const users = db.collection<UserMongo>("users");
  results.forEach(async (loan) => {
    const now = new Date();
    const payments = loan.scheduledPayments?.filter((payment) => {
      return (
        isSameDay(payment.scheduledDate, now) && payment.status === "to be paid"
      );
    });
    payments?.forEach(async (payment) => {
      const delayedTotal = payment.amortize;
      const result = await users.updateOne(
        {
          _id: loan._id_user,
          accountAvailable: { $gt: delayedTotal },
        },
        {
          $inc: {
            accountAvailable: -delayedTotal,
            accountTotal: -delayedTotal,
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
        return;
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
              _id: new ObjectID(),
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
      await loans.updateOne(
        { _id: loan._id },
        { $set: { "scheduledPayments.$[item].status": "paid" } },
        {
          arrayFilters: [
            {
              "item.scheduledDate": payment.scheduledDate,
            },
          ],
        }
      );
    });
  });
};
