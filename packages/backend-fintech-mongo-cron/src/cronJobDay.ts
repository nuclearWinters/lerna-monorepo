import { Db } from "mongodb";
import { LoanMongo, ScheduledPaymentsMongo } from "./types.js";
import { differenceInDays } from "date-fns";
import { Producer } from "kafkajs";

export const dayFunction = async (
  db: Db,
  producer: Producer
): Promise<void> => {
  const loans = db.collection<LoanMongo>("loans");
  const scheduledPayments =
    db.collection<ScheduledPaymentsMongo>("scheduledPayments");
  const resultsScheduledPayments = await scheduledPayments
    .find({ status: "delayed" })
    .toArray();
  for (const delayedPayment of resultsScheduledPayments) {
    const loan_oid = delayedPayment.loan_oid;
    const loan = await loans.findOne({ _id: loan_oid });
    if (!loan) {
      throw new Error("Loan not found.");
    }
    const ROI = loan.roi;
    const user_id = loan.user_id;
    const scheduledDate = delayedPayment.scheduled_date;
    const amortize = delayedPayment.amortize;
    const scheduled_oid = delayedPayment._id;
    const now = new Date();
    //Sumar amortización con interes moratorio
    const dailyMoratory = Math.floor((amortize * (ROI / 100)) / 360);
    const moratory =
      dailyMoratory * Math.abs(differenceInDays(scheduledDate, now));
    const delayedTotal = amortize + moratory;
    //Se actualiza el usuario del deudor al mover dinero de cuenta
    producer.send({
      topic: "user-transaction",
      messages: [
        {
          key: user_id,
          value: JSON.stringify({
            quantity: -delayedTotal,
            user_id,
            scheduled_id: scheduled_oid.toHexString(),
            loan_id: loan_oid.toHexString(),
            isDelayed: true,
          }),
        },
      ],
    });
  }
  return;
};
