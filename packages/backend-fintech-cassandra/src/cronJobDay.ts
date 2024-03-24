import { differenceInDays } from "date-fns";
import { Client } from "cassandra-driver";
import { Producer } from "kafkajs";

export const dayFunction = async (
  client: Client,
  producer: Producer
): Promise<void> => {
  //search by date also
  const resultsScheduledPayments = await client.execute(
    "SELECT * FROM fintech.scheduled_payments_by_status WHERE status = ?",
    ["delayed"]
  );
  for (const delayedPayment of resultsScheduledPayments.rows) {
    const loan_id = delayedPayment.get("loan_id");
    const resultLoan = await client.execute(
      `SELECT * FROM fintech.loans_by_status WHERE id = ${loan_id}`
    );
    const loan = resultLoan.first();
    const ROI = loan.get("roi");
    const user_id = loan.get("user_id");
    const scheduledDate = loan.get("scheduled_date");
    const amortize = loan.get("amortize");
    const scheduled_id = delayedPayment.get("scheduled_id");
    const now = new Date();
    //Sumar amortización con interes moratorio
    const moratory = Math.floor(
      ((amortize * (ROI / 100)) / 360) *
        Math.abs(differenceInDays(scheduledDate, now))
    );
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
            scheduled_id,
            loan_id,
            isDelayed: true,
          }),
        },
      ],
    });
  }
  return;
};
