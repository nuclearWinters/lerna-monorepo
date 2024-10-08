import { Producer } from "kafkajs";
import { Collection, ObjectId } from "mongodb";
import { LoanMongo, ScheduledPaymentsMongo } from "./types";
import { addMonths, startOfMonth } from "date-fns";

export const LoanTransaction = async (
  messageValue: string,
  loans: Collection<LoanMongo>,
  producer: Producer,
  scheduledPayments: Collection<ScheduledPaymentsMongo>
) => {
  const values = JSON.parse(messageValue);
  const {
    quantity,
    lender_id,
    loan_id,
    nextTopic,
    nextValue,
    nextKey,
  }: {
    quantity: number;
    lender_id: string;
    loan_id: string;
    nextTopic: string;
    nextValue: string;
    nextKey: string;
  } = values;
  const loan = await loans.findOne({ _id: new ObjectId(loan_id) });
  if (!loan) {
    throw new Error("Loan not found.");
  }
  const raised = loan.raised;
  const term = loan.term;
  const pending = loan.pending;
  const goal = loan.goal;
  const ROI = loan.roi;
  const newRaised = raised + quantity;
  const newPending = pending - quantity;
  const isLessOrEqualGoal = newRaised <= goal;
  const completed = newRaised === goal;
  if (isLessOrEqualGoal) {
    const loan_oid = new ObjectId(loan_id);
    const now = new Date();
    await loans.findOneAndUpdate(
      {
        _id: loan_oid,
      },
      {
        $set: {
          raised: newRaised,
          pending: newPending,
          ...(completed ? { status: "to be paid" } : {}),
        },
      }
    );
    await producer.send({
      topic: "user-transaction",
      messages: [
        {
          value: JSON.stringify({
            withheldFromToBePaid: quantity,
            user_id: lender_id,
          }),
          key: lender_id,
        },
      ],
    });
    if (completed) {
      await producer.send({
        topic: "user-transaction",
        messages: [
          {
            value: JSON.stringify({
              quantity: goal,
              user_id: loan.user_id,
            }),
            key: loan.user_id,
          },
        ],
      });
      const TEM = Math.pow(1 + ROI / 100, 1 / 12) - 1;
      const amortize = Math.floor(
        newRaised / ((1 - Math.pow(1 / (1 + TEM), term)) / TEM)
      );
      await scheduledPayments.insertMany(
        new Array(term).fill(null).map((_term, index) => ({
          loan_oid: loan_oid,
          scheduled_date: startOfMonth(addMonths(now, index + 1)),
          amortize,
          status: "to be paid",
        }))
      );
    }
    if (nextTopic && nextValue && nextKey) {
      await producer.send({
        topic: nextTopic,
        messages: [
          {
            value: JSON.stringify({ ...JSON.parse(nextValue), completed }),
            key: nextKey,
          },
        ],
      });
    }
  } else {
    //Undo payment and return money to user
    await producer.send({
      topic: "user-transaction",
      messages: [
        {
          value: JSON.stringify({
            user_id: lender_id,
            withheldFromAvailable: -quantity,
          }),
          key: lender_id,
        },
      ],
    });
  }
};
