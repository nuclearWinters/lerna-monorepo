import { Producer } from "kafkajs";
import { Collection, ObjectId } from "mongodb";
import { LoanMongo } from "./types";

export const LoanTransaction = async (
  messageValue: string,
  loans: Collection<LoanMongo>,
  producer: Producer
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
  const pending = loan.pending;
  const goal = loan.goal;
  const newRaised = raised + quantity;
  const newPending = pending - quantity;
  const isLessOrEqualGoal = newRaised <= goal;
  const completed = newRaised === goal;
  if (isLessOrEqualGoal) {
    await loans.findOneAndUpdate(
      {
        _id: new ObjectId(loan_id),
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
      topic: nextTopic,
      messages: [
        {
          value: nextValue,
          key: nextKey,
        },
      ],
    });
  } else {
    //Undo payment and return money to user
    await producer.send({
      topic: "user-transaction",
      messages: [
        {
          value: JSON.stringify({
            user_id: lender_id,
            withheld: -quantity,
          }),
          key: lender_id,
        },
      ],
    });
  }
};
