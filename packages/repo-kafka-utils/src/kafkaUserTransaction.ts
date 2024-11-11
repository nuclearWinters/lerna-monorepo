import type { Producer, RecordMetadata } from "kafkajs";
import type {
  InvestmentMongo,
  LoanMongo,
  RecordsMongo,
  ScheduledPaymentsMongo,
  TransactionMongo,
  FintechUserMongo,
} from "@repo/mongo-utils";
import {
  Collection,
  type InsertOneResult,
  ObjectId,
  type UpdateResult,
} from "mongodb";
import {
  publishInvestmentUpdate,
  publishLoanUpdate,
  publishUser,
} from "./subscriptions/subscriptionsUtils.ts";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { resolveParse } from "./kafkaLoanTransaction.ts";
import type { UUID } from "crypto";

interface UserKafkaTransaction {
  operationTotalAndAvailable?: number;
  operationTotalAndToBePaid?: number;
  operationWithheldAndAvailable?: number;
  operationWithheldAndToBePaid?: number;
  user_uuid: UUID;
  loan_oid_str?: string;
  borrower_uuid?: string;
  scheduled_oid_str?: string;
  isDelayed?: boolean;
  nextTopic?: string;
  nextValue?: string;
  nextKey?: string;
  record_oid_str?: string;
}

const isValidUserTransaction = (
  loanTransaction: unknown
): loanTransaction is UserKafkaTransaction => {
  if (typeof loanTransaction !== "object") {
    return false;
  }
  if (loanTransaction === null) {
    return false;
  }
  return (
    "user_uuid" in loanTransaction &&
    typeof loanTransaction.user_uuid === "string"
  );
};

export const UserTransaction = async (
  messageValue: string,
  users: Collection<FintechUserMongo>,
  producer: Producer,
  loans: Collection<LoanMongo>,
  transactions: Collection<TransactionMongo>,
  scheduledPayments: Collection<ScheduledPaymentsMongo>,
  investments: Collection<InvestmentMongo>,
  pubsub: RedisPubSub,
  records: Collection<RecordsMongo>
): Promise<null> => {
  const values = resolveParse(messageValue);
  if (!isValidUserTransaction(values)) {
    throw new Error("Invalid loan transaction");
  }
  const {
    operationTotalAndAvailable,
    operationTotalAndToBePaid,
    operationWithheldAndAvailable,
    operationWithheldAndToBePaid,
    user_uuid,
    loan_oid_str,
    scheduled_oid_str,
    isDelayed,
    nextTopic,
    nextValue,
    nextKey,
    record_oid_str,
  } = values;
  const record_oid = new ObjectId(record_oid_str);
  const loan_oid = new ObjectId(loan_oid_str);
  const scheduled_oid = new ObjectId(scheduled_oid_str);
  const userPromise = users.findOne({ id: user_uuid });
  const recordPromise = records.findOne({ _id: record_oid, status: "pending" });
  const [user, record] = await Promise.all([userPromise, recordPromise]);
  if (!user) {
    throw new Error("User not found.");
  }
  if (!record) {
    throw new Error("Record not found or already applied/rejected");
  }
  const loanPromise = loan_oid_str
    ? loans.findOne({ _id: loan_oid })
    : Promise.resolve(null);
  const investmentsPromise = loan_oid_str
    ? investments.find({ loan_oid }).toArray()
    : Promise.resolve([]);
  const scheduledPaymentPromise = scheduled_oid_str
    ? scheduledPayments.findOne({
        _id: scheduled_oid,
      })
    : Promise.resolve(null);
  const [loan, investmentsResult, scheduledPayment] = await Promise.all([
    loanPromise,
    investmentsPromise,
    scheduledPaymentPromise,
  ]);
  const accountAvailable = user.account_available;
  const accountTotal = user.account_total;
  const accountToBePaid = user.account_to_be_paid;
  const accountWithheld = user.account_withheld;
  let userOperation: Promise<UpdateResult<FintechUserMongo> | null> =
    Promise.resolve(null);
  let transactionOperation: Promise<InsertOneResult<TransactionMongo> | null> =
    Promise.resolve(null);
  let investmentOperation: Promise<UpdateResult<InvestmentMongo> | null> =
    Promise.resolve(null);
  let scheduledPaymentOperation: Promise<UpdateResult<ScheduledPaymentsMongo> | null> =
    Promise.resolve(null);
  let loanOperation: Promise<UpdateResult<LoanMongo> | null> =
    Promise.resolve(null);
  let producerInterest: Promise<RecordMetadata[]> = Promise.resolve([]);
  let producerMoratory: Promise<RecordMetadata[]> = Promise.resolve([]);
  if (operationWithheldAndAvailable) {
    /*----- Quitar/Añadir fondos retenidos al usuario de fondos disponibles START -----*/
    const newAccountAvailable =
      accountAvailable - operationWithheldAndAvailable;
    const resultIsMoreThanZero = newAccountAvailable >= 0;
    const newAccountWithheld = accountWithheld + operationWithheldAndAvailable;
    if (resultIsMoreThanZero) {
      userOperation = users.updateOne(
        {
          id: user_uuid,
        },
        {
          $set: {
            account_available: newAccountAvailable,
            account_withheld: newAccountWithheld,
          },
        }
      );
      publishUser(
        {
          id: user_uuid,
          account_available: newAccountAvailable,
          account_to_be_paid: accountToBePaid,
          account_total: accountTotal,
          account_withheld: newAccountWithheld,
        },
        pubsub
      );
    }
    /*----- Quitar/Añadir fondos retenidos al usuario de fondos disponibles END -----*/
  } else if (operationWithheldAndToBePaid) {
    /*----- Quitar/Añadir fondos retenidos al usuario de fondos totales START -----*/
    const newAccountWithheld = accountWithheld - operationWithheldAndToBePaid;
    const resultIsMoreThanZero = newAccountWithheld >= 0;
    const newAccountToBePaid = accountToBePaid + operationWithheldAndToBePaid;
    if (resultIsMoreThanZero) {
      userOperation = users.updateOne(
        {
          id: user_uuid,
        },
        {
          $set: {
            account_to_be_paid: newAccountToBePaid,
            account_withheld: newAccountWithheld,
          },
        }
      );
      publishUser(
        {
          id: user_uuid,
          account_available: accountAvailable,
          account_to_be_paid: accountToBePaid,
          account_total: accountTotal,
          account_withheld: newAccountWithheld,
        },
        pubsub
      );
    }
    /*----- Quitar/Añadir fondos retenidos al usuario de fondos totales END -----*/
  } else if (operationTotalAndAvailable) {
    /*----- Quitar/Añadir fondos disponibles al usuario START -----*/
    const newAccountAvailable = accountAvailable + operationTotalAndAvailable;
    const resultIsMoreThanZero = newAccountAvailable >= 0;
    const newAccountTotal = accountTotal + operationTotalAndAvailable;
    if (resultIsMoreThanZero) {
      userOperation = users.updateOne(
        {
          id: user_uuid,
        },
        {
          $set: {
            account_available: newAccountAvailable,
            account_total: newAccountTotal,
          },
        }
      );
      const type =
        scheduled_oid_str && operationTotalAndAvailable < 0
          ? "payment"
          : operationTotalAndAvailable > 0
            ? "credit"
            : "withdrawal";
      transactionOperation = transactions.insertOne({
        user_id: user_uuid,
        type,
        quantity: operationTotalAndAvailable,
        created_at: new Date(),
      });
      publishUser(
        {
          id: user_uuid,
          account_available: newAccountAvailable,
          account_to_be_paid: accountToBePaid,
          account_total: newAccountTotal,
          account_withheld: accountWithheld,
        },
        pubsub
      );
      //Se realizo un pago programado
      if (loan_oid_str && operationTotalAndAvailable < 0) {
        if (!loan) {
          throw new Error("Loan not found.");
        }
        const paymentsDone = loan.payments_done;
        const term = loan.term;
        const newPaymentsDone = paymentsDone + 1;
        const allPaid = newPaymentsDone === term;
        const paymentsDelayed = loan.payments_delayed;
        const newPaymentsDelayed = isDelayed
          ? paymentsDelayed - 1
          : paymentsDelayed;
        const noDelayed = newPaymentsDelayed === 0;
        loanOperation = loans.updateOne(
          {
            _id: loan_oid,
          },
          {
            $set: {
              payments_done: newPaymentsDone,
              payments_delayed: newPaymentsDelayed,
              ...(allPaid ? { status: "paid" } : {}),
            },
          }
        );
        scheduledPaymentOperation = scheduledPayments.updateOne(
          {
            _id: scheduled_oid,
          },
          {
            $set: {
              status: "paid",
            },
          }
        );
        publishLoanUpdate(
          {
            ...loan,
            status: allPaid ? "paid" : loan.status,
            payments_delayed: newPaymentsDelayed,
          },
          pubsub
        );
        for (const investment of investmentsResult) {
          const id = investment._id;
          const lender_id = investment.lender_id;
          const payments = investment.payments;
          const amortize = investment.amortize;
          const moratory = investment.moratory;
          const status_type = investment.status_type;
          const totalAmortize = amortize * term;
          const paid_already = amortize * (payments + 1);
          const to_be_paid = totalAmortize - paid_already;
          const borrower_uuid = investment.borrower_id;
          const newPayments = payments + 1;
          investmentOperation = investments.updateOne(
            {
              _id: id,
            },
            {
              $set: {
                to_be_paid,
                paid_already,
                payments: newPayments,
                ...(noDelayed || allPaid
                  ? {
                      status: allPaid ? "paid" : "up to date",
                      status_type: allPaid ? "over" : status_type,
                    }
                  : {}),
              },
            }
          );
          publishInvestmentUpdate(
            {
              ...investment,
              status: allPaid
                ? "paid"
                : noDelayed
                  ? "up to date"
                  : investment.status,
              status_type: allPaid ? "over" : status_type,
              payments: newPayments,
              amortize,
              paid_already,
              to_be_paid,
            },
            pubsub
          );
          producerInterest = producer.send({
            topic: "user-transaction",
            messages: [
              {
                value: JSON.stringify({
                  interest: amortize + moratory,
                  user_uuid: lender_id,
                  loan_oid_str,
                  borrower_uuid,
                }),
                key: lender_id,
              },
            ],
          });
        }
      }
      //NO se realizo un pago programado
    } else if (
      loan_oid_str &&
      scheduled_oid_str &&
      operationTotalAndAvailable < 0
    ) {
      if (!scheduledPayment) {
        throw new Error("No scheduled payment found.");
      }
      scheduledPaymentOperation = scheduledPayments.updateOne(
        {
          _id: scheduledPayment._id,
        },
        {
          $set: {
            status: "delayed",
          },
        }
      );
      for (const investment of investmentsResult) {
        const id = investment._id;
        const moratory = investment.moratory;
        const amortize = investment.amortize;
        const ROI = investment.roi;
        const loan_oid = investment.loan_oid;
        const borrower_id = investment.borrower_id;
        const dailyMoratory = Math.floor((amortize * (ROI / 100)) / 360);
        const newMoratory = dailyMoratory + moratory;
        investmentOperation = investments.updateOne(
          { _id: id },
          {
            $set: {
              status: "delay payment",
              moratory: newMoratory,
            },
          }
        );
        publishInvestmentUpdate(
          {
            ...investment,
            moratory: newMoratory,
            status: "delay payment",
          },
          pubsub
        );
        producerMoratory = producer.send({
          topic: "user-transaction",
          messages: [
            {
              value: JSON.stringify({
                interest: -dailyMoratory,
                user_uuid: id,
                loan_oid_str: loan_oid.toHexString(),
                borrower_uuid: borrower_id,
              }),
              key: id.toHexString(),
            },
          ],
        });
      }
    }
    /*----- Quitar/Añadir fondos disponibles al usuario END -----*/
  } else if (operationTotalAndToBePaid) {
    /*----- Quitar/Añadir ganancias futuras al usuario START -----*/
    const newAccountToBePaid = accountToBePaid + operationTotalAndToBePaid;
    const resultIsMoreThanZero = newAccountToBePaid >= 0;
    const newAccountTotal = accountTotal + operationTotalAndToBePaid;
    if (resultIsMoreThanZero) {
      userOperation = users.updateOne(
        {
          id: user_uuid,
        },
        {
          $set: {
            account_total: newAccountTotal,
            account_to_be_paid: newAccountToBePaid,
          },
        }
      );
      publishUser(
        {
          id: user_uuid,
          account_available: accountAvailable,
          account_to_be_paid: newAccountToBePaid,
          account_total: accountTotal,
          account_withheld: accountWithheld,
        },
        pubsub
      );
    }
    /*----- Quitar/Añadir ganancias futuras al usuario END -----*/
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
  const nextEvent =
    nextTopic && nextValue && nextKey
      ? producer.send({
          topic: nextTopic,
          messages: [
            {
              value: nextValue,
              key: nextKey,
            },
          ],
        })
      : Promise.resolve([]);
  await Promise.all([
    userOperation,
    transactionOperation,
    investmentOperation,
    scheduledPaymentOperation,
    loanOperation,
    producerInterest,
    producerMoratory,
    updateRecord,
    nextEvent,
  ]);
  return null;
};
