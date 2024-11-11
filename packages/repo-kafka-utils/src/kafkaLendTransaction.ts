import type { Producer, RecordMetadata } from "kafkajs";
import type {
  InvestmentMongo,
  LoanMongo,
  RecordsMongo,
} from "@repo/mongo-utils";
import {
  Collection,
  type InsertOneResult,
  ObjectId,
  type UpdateResult,
} from "mongodb";
import { resolveParse } from "./kafkaLoanTransaction.ts";
import type { UUID } from "node:crypto";

interface LendKafkaTransaction {
  lender_uuid: UUID;
  quantity_cents: number;
  loan_oid_str: string;
  is_loan_completed: boolean;
  record_oid_str: string;
}

const isValidLendTransaction = (
  loanTransaction: unknown
): loanTransaction is LendKafkaTransaction => {
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
    typeof loanTransaction.record_oid_str === "string" &&
    "is_loan_completed" in loanTransaction &&
    typeof loanTransaction.is_loan_completed === "boolean"
  );
};

export const AddLends = async (
  messageValue: string,
  loans: Collection<LoanMongo>,
  investments: Collection<InvestmentMongo>,
  producer: Producer,
  records: Collection<RecordsMongo>
): Promise<null> => {
  const values = resolveParse(messageValue);
  if (!isValidLendTransaction(values)) {
    throw new Error("Invalid lend transaction");
  }
  const {
    quantity_cents,
    lender_uuid,
    loan_oid_str,
    record_oid_str,
    is_loan_completed,
  } = values;
  const record_oid = new ObjectId(record_oid_str);
  const loan_oid = new ObjectId(loan_oid_str);
  const recordPromise = records.findOne({
    _id: record_oid,
    status: "pending",
  });
  const loanPromise = loans.findOne({ _id: loan_oid });
  const investmentsPromise = is_loan_completed
    ? investments.find({ loan_oid }).toArray()
    : Promise.resolve([]);
  const investmentPromise = !is_loan_completed
    ? investments.findOne({
        loan_oid,
        lender_id: lender_uuid,
      })
    : Promise.resolve(null);
  const [record, loan, allLoanInvestments, investment] = await Promise.all([
    recordPromise,
    loanPromise,
    investmentsPromise,
    investmentPromise,
  ]);
  if (!record) {
    throw new Error("Record not found or already applied/rejected");
  }
  if (!loan) {
    throw new Error("Loan not found");
  }
  const { user_id: borrower_id, term, roi: ROI } = loan;
  const TEM = Math.pow(1 + ROI / 100, 1 / 12) - 1;
  if (is_loan_completed) {
    let updateInvestment: Promise<UpdateResult<InvestmentMongo> | null> =
      Promise.resolve(null);
    let undoInterestsPromise: Promise<RecordMetadata[]> = Promise.resolve([]);
    let newInterestsPromise: Promise<RecordMetadata[]> = Promise.resolve([]);
    let completedInvestmentsPromise: Promise<UpdateResult<InvestmentMongo> | null> =
      Promise.resolve(null);
    let updateLenderNewInvestmentPromise: Promise<RecordMetadata[]> =
      Promise.resolve([]);
    let updateLenderUpdatedInvestmentPromise: Promise<RecordMetadata[]> =
      Promise.resolve([]);
    let createCompletedInvestmentPromise: Promise<InsertOneResult<InvestmentMongo> | null> =
      Promise.resolve(null);
    let lenderHasPreviousInvestment = false;
    let old_lender_record: Promise<InsertOneResult<RecordsMongo> | null> =
      Promise.resolve(null);
    let new_lender_record: Promise<InsertOneResult<RecordsMongo> | null> =
      Promise.resolve(null);
    const lender_promises: Promise<InsertOneResult<RecordsMongo> | null>[] = [];
    for (const investment of allLoanInvestments) {
      const isLenderInvestment = lender_uuid === investment.lender_id;
      if (isLenderInvestment) {
        lenderHasPreviousInvestment = true;
        const old_lender_record_oid = new ObjectId();
        const new_lender_record_oid = new ObjectId();
        const new_quantity = investment.quantity + quantity_cents;
        const amortize = Math.floor(
          new_quantity / ((1 - Math.pow(1 / (1 + TEM), term)) / TEM)
        );
        const amortizes = amortize * term;
        const interest_to_earn = amortizes - new_quantity;
        old_lender_record = records.insertOne({
          status: "pending",
          _id: old_lender_record_oid,
        });
        const old_lender_record_oid_str = old_lender_record_oid.toHexString();
        undoInterestsPromise = producer.send({
          topic: "user-transaction",
          messages: [
            {
              value: JSON.stringify({
                operationTotalAndToBePaid: -investment.interest_to_earn,
                user_uuid: lender_uuid,
                record_oid_str: old_lender_record_oid_str,
              }),
              key: lender_uuid,
            },
          ],
        });
        new_lender_record = records.insertOne({
          status: "pending",
          _id: new_lender_record_oid,
        });
        const new_lend_record_oid_str = new_lender_record_oid.toHexString();
        newInterestsPromise = producer.send({
          topic: "user-transaction",
          messages: [
            {
              value: JSON.stringify({
                operationTotalAndToBePaid: interest_to_earn,
                user_uuid: lender_uuid,
                record_oid_str: new_lend_record_oid_str,
              }),
              key: lender_uuid,
            },
          ],
        });
        completedInvestmentsPromise = investments.updateOne(
          {
            _id: investment._id,
          },
          {
            $set: {
              quantity: investment.quantity,
              interest_to_earn,
              amortize,
              to_be_paid: amortizes,
              status: "up to date",
            },
          }
        );
      } else {
        const new_lender_record_oid = new ObjectId();
        const amortize = Math.floor(
          investment.quantity /
            ((1 - Math.pow(1 / (1 + TEM), investment.term)) / TEM)
        );
        const amortizes = amortize * investment.term;
        const interest_to_earn = amortizes - investment.quantity;
        const lender_record = records.insertOne({
          status: "pending",
          _id: new_lender_record_oid,
        });
        lender_promises.push(lender_record);
        const lender_record_oid_str = new_lender_record_oid.toHexString();
        updateLenderUpdatedInvestmentPromise = producer.send({
          topic: "user-transaction",
          messages: [
            {
              value: JSON.stringify({
                operationTotalAndToBePaid: interest_to_earn,
                user_uuid: investment.lender_id,
                record_oid_str: lender_record_oid_str,
              }),
              key: investment.lender_id,
            },
          ],
        });
        updateInvestment = investments.updateOne(
          {
            _id: investment._id,
          },
          {
            $set: {
              interest_to_earn,
              amortize,
              to_be_paid: amortizes,
              status: "up to date",
            },
          }
        );
      }
    }
    if (!lenderHasPreviousInvestment) {
      const new_lender_record_oid = new ObjectId();
      const amortize = Math.floor(
        quantity_cents / ((1 - Math.pow(1 / (1 + TEM), term)) / TEM)
      );
      const amortizes = amortize * term;
      const interest_to_earn = amortizes - quantity_cents;
      new_lender_record = records.insertOne({
        status: "pending",
        _id: new_lender_record_oid,
      });
      const lender_record_oid_str = new_lender_record_oid.toHexString();
      updateLenderNewInvestmentPromise = producer.send({
        topic: "user-transaction",
        messages: [
          {
            value: JSON.stringify({
              operationTotalAndToBePaid: interest_to_earn,
              user_uuid: lender_uuid,
              record_oid_str: lender_record_oid_str,
            }),
            key: lender_uuid,
          },
        ],
      });
      createCompletedInvestmentPromise = investments.insertOne({
        borrower_id,
        lender_id: lender_uuid,
        loan_oid,
        quantity: quantity_cents,
        created_at: new Date(),
        updated_at: new Date(),
        status: "up to date",
        status_type: "on_going",
        roi: ROI,
        term,
        payments: 0,
        moratory: 0,
        amortize,
        interest_to_earn,
        paid_already: 0,
        to_be_paid: amortizes,
      });
    }
    const updateRecord = records.updateOne(
      {
        _id: record_oid,
      },
      {
        $set: {
          status: "applied",
        },
      }
    );
    await Promise.all([
      undoInterestsPromise,
      newInterestsPromise,
      completedInvestmentsPromise,
      updateLenderUpdatedInvestmentPromise,
      updateLenderNewInvestmentPromise,
      createCompletedInvestmentPromise,
      updateRecord,
      updateInvestment,
      new_lender_record,
      old_lender_record,
      ...lender_promises,
    ]);
    return null;
  } else {
    if (!investment) {
      const updateRecord = records.updateOne(
        {
          _id: record_oid,
        },
        {
          $set: {
            status: "applied",
          },
        }
      );
      const updateInvestment = investments.insertOne({
        borrower_id,
        lender_id: lender_uuid,
        loan_oid: loan_oid,
        quantity: quantity_cents,
        created_at: new Date(),
        updated_at: new Date(),
        status: "financing",
        status_type: "on_going",
        roi: ROI,
        term,
        payments: 0,
        moratory: 0,
        amortize: 0,
        interest_to_earn: 0,
        paid_already: 0,
        to_be_paid: 0,
      });
      await Promise.all([updateRecord, updateInvestment]);
      return null;
    } else {
      const new_quantity = investment.quantity + quantity_cents;
      const updateRecord = records.updateOne(
        {
          _id: record_oid,
        },
        {
          $set: {
            status: "applied",
          },
        }
      );
      const updateInvestment = investments.updateOne(
        {
          _id: investment._id,
        },
        {
          $set: {
            quantity: new_quantity,
          },
        }
      );
      await Promise.all([updateRecord, updateInvestment]);
      return null;
    }
  }
};
