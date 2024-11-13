import type { Producer, RecordMetadata } from "kafkajs";
import {
  type Collection,
  type InsertManyResult,
  type InsertOneResult,
  ObjectId,
} from "mongodb";
import type {
  LoanMongo,
  ScheduledPaymentsMongo,
  RecordsMongo,
} from "@repo/mongo-utils";
import { addMonths, startOfMonth } from "date-fns";
import { publishLoanUpdate } from "./subscriptions/subscriptionsUtils.ts";
import type { RedisPubSub } from "graphql-redis-subscriptions";

interface LoanKafkaTransaction {
  quantity_cents: number;
  lender_uuid: string;
  loan_oid_str: string;
  record_oid_str: string;
}

const isValidLoanTransaction = (
  loanTransaction: unknown
): loanTransaction is LoanKafkaTransaction => {
  if (typeof loanTransaction !== "object") {
    return false;
  }
  if (loanTransaction === null) {
    return false;
  }
  return (
    "quantity_cents" in loanTransaction &&
    typeof loanTransaction.quantity_cents === "number" &&
    "lender_uuid" in loanTransaction &&
    typeof loanTransaction.lender_uuid === "string" &&
    "loan_oid_str" in loanTransaction &&
    typeof loanTransaction.loan_oid_str === "string" &&
    "record_oid_str" in loanTransaction &&
    typeof loanTransaction.record_oid_str === "string"
  );
};

export const resolveParse = (value: string): unknown => {
  try {
    const values = JSON.parse(value);
    return values;
  } catch {
    return null;
  }
};

export const LoanTransaction = async (
  messageValue: string,
  loans: Collection<LoanMongo>,
  producer: Producer,
  scheduledPayments: Collection<ScheduledPaymentsMongo>,
  records: Collection<RecordsMongo>,
  pubsub: RedisPubSub
): Promise<null> => {
  const values = resolveParse(messageValue);
  if (!isValidLoanTransaction(values)) {
    throw new Error("Invalid loan transaction");
  }
  const { quantity_cents, lender_uuid, loan_oid_str, record_oid_str } = values;
  const record_oid = new ObjectId(record_oid_str);
  const loan_oid = new ObjectId(loan_oid_str);
  const new_lender_record_oid = new ObjectId();
  const new_borrower_record_oid = new ObjectId();
  const new_lend_record_oid = new ObjectId();
  const loanPromise = loans.findOne({ _id: loan_oid });
  const recordPromise = records.findOne({ _id: record_oid, status: "pending" });
  const [loan, record] = await Promise.all([loanPromise, recordPromise]);
  if (!record) {
    throw new Error("Record not found or already applied/rejected");
  }
  if (!loan) {
    throw new Error("Loan not found.");
  }
  const { raised, term, pending, goal, roi: ROI } = loan;
  const newRaised = raised + quantity_cents;
  const newPending = pending - quantity_cents;
  const isLessOrEqualGoal = newRaised <= goal;
  const completed = newRaised === goal;
  let paymentsPromise: Promise<InsertManyResult<ScheduledPaymentsMongo>> =
    Promise.resolve({ insertedCount: 0, insertedIds: [], acknowledged: false });
  let borrowerTransaction: Promise<RecordMetadata[]> = Promise.resolve([]);
  let new_record_borrower: Promise<InsertOneResult<RecordsMongo> | null> =
    Promise.resolve(null);
  let new_record_lender: Promise<InsertOneResult<RecordsMongo> | null> =
    Promise.resolve(null);
  let new_record_lend: Promise<InsertOneResult<RecordsMongo> | null> =
    Promise.resolve(null);
  if (isLessOrEqualGoal) {
    const loan_oid = new ObjectId(loan_oid_str);
    const now = new Date();
    const loanPromise = loans
      .findOneAndUpdate(
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
      )
      .then((loan) => {
        if (loan) {
          publishLoanUpdate(loan, pubsub);
        }
        return loan;
      });
    new_record_lender = records.insertOne({
      status: "pending",
      _id: new_lender_record_oid,
    });
    const record_oid_str = new_lender_record_oid.toHexString();
    const lenderTransaction = producer.send({
      topic: "user-transaction",
      messages: [
        {
          value: JSON.stringify({
            operationWithheldAndToBePaid: quantity_cents,
            record_oid_str,
            user_uuid: lender_uuid,
          }),
          key: lender_uuid,
        },
      ],
    });
    if (completed) {
      new_record_borrower = records.insertOne({
        status: "pending",
        _id: new_borrower_record_oid,
      });
      const record_oid_str = new_borrower_record_oid.toHexString();
      borrowerTransaction = producer.send({
        topic: "user-transaction",
        messages: [
          {
            value: JSON.stringify({
              operationTotalAndAvailable: goal,
              user_uuid: loan.user_id,
              record_oid_str,
            }),
            key: loan.user_id,
          },
        ],
      });
      const TEM = Math.pow(1 + ROI / 100, 1 / 12) - 1;
      const amortize = Math.floor(
        newRaised / ((1 - Math.pow(1 / (1 + TEM), term)) / TEM)
      );
      paymentsPromise = scheduledPayments.insertMany(
        new Array(term).fill(null).map((_term, index) => ({
          loan_oid: loan_oid,
          scheduled_date: startOfMonth(addMonths(now, index + 1)),
          amortize,
          status: "to be paid",
        }))
      );
    }
    new_record_lend = records.insertOne({
      status: "pending",
      _id: new_lend_record_oid,
    });
    const lend_record_oid_str = new_lend_record_oid.toHexString();
    const producerPromise = producer.send({
      topic: "add-lends",
      messages: [
        {
          key: lender_uuid,
          value: JSON.stringify({
            quantity_cents,
            loan_oid_str,
            lender_uuid,
            record_oid_str: lend_record_oid_str,
            is_loan_completed: completed,
          }),
        },
      ],
    });
    const updateRecord = records.updateOne(
      { _id: record_oid },
      { $set: { status: "applied" } }
    );
    // Firing all promises and waiting for them to finish so we can process the next event
    await Promise.all([
      producerPromise,
      updateRecord,
      loanPromise,
      lenderTransaction,
      paymentsPromise,
      borrowerTransaction,
      new_record_borrower,
      new_record_lender,
      new_record_lend,
    ]);
    return null;
  } else {
    const new_record_oid = new ObjectId();
    //Undo payment and return money to user
    const updateRecord = records.updateOne(
      {
        _id: record_oid,
      },
      {
        $set: {
          status: "rejected",
        },
      }
    );
    const recordOperation = records.insertOne({
      status: "pending",
      _id: new_record_oid,
    });
    const record_oid_str = new_record_oid.toHexString();
    const producerPromise = producer.send({
      topic: "user-transaction",
      messages: [
        {
          value: JSON.stringify({
            user_uuid: lender_uuid,
            operationWithheldAndAvailable: -quantity_cents,
            record_oid_str,
          }),
          key: lender_uuid,
        },
      ],
    });
    await Promise.all([updateRecord, producerPromise, recordOperation]);
    return null;
  }
};
