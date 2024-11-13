import type { Db } from "mongodb";
import type { LoanMongo, ScheduledPaymentsMongo } from "@repo/mongo-utils";
import type { Producer } from "kafkajs";
import { endOfDay, startOfDay } from "date-fns";

export const monthFunction = async (
  db: Db,
  producer: Producer
): Promise<void> => {
  const loans = db.collection<LoanMongo>("loans");
  const scheduledPayments =
    db.collection<ScheduledPaymentsMongo>("scheduledPayments");
  const resultsScheduledPayments = await scheduledPayments
    .find({
      status: "to be paid",
      scheduled_date: {
        $lte: endOfDay(new Date()),
        $gte: startOfDay(new Date()),
      },
    })
    .toArray();
  for (const payment of resultsScheduledPayments) {
    const loan_oid = payment.loan_oid;
    const loan = await loans.findOne({ _id: loan_oid });
    if (!loan) {
      throw new Error("Loan not found.");
    }
    const delayedTotal = payment.amortize;
    const borrower_id = loan.user_id;
    const scheduled_id = payment._id;
    //Se actualiza el usuario del deudor al mover dinero de cuenta
    await producer.send({
      topic: "user-transaction",
      messages: [
        {
          key: borrower_id,
          value: JSON.stringify({
            quantity: -delayedTotal,
            user_id: borrower_id,
            loan_id: loan_oid.toHexString(),
            scheduled_id,
          }),
        },
      ],
    });
  }
  return;
};
