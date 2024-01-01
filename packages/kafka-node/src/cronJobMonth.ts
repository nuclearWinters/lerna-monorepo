import { Client } from "cassandra-driver";
import { Producer } from "kafkajs";

export const monthFunction = async (
  client: Client,
  producer: Producer
): Promise<void> => {
  //search by date also
  const resultsScheduledPayments = await client.execute(
    "SELECT * FROM fintech.scheduled_payments_by_status WHERE status = ? AND ",
    ["to be paid"]
  );
  for (const payment of resultsScheduledPayments.rows) {
    const loan_id = payment.get("loan_id");
    const delayedTotal = payment.get("amortize");
    const borrower_id = payment.get("borrower_id");
    const scheduled_id = payment.get("scheduled_id");
    //Se actualiza el usuario del deudor al mover dinero de cuenta
    await producer.send({
      topic: "user-transaction",
      messages: [
        {
          key: borrower_id,
          value: JSON.stringify({
            quantity: -delayedTotal,
            user_id: borrower_id,
            loan_id,
            scheduled_id,
          }),
        },
      ],
    });
  }
  return;
};
