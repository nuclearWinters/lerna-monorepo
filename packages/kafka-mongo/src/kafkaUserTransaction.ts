import { Producer } from "kafkajs";
import {
  InvestmentMongo,
  LoanMongo,
  ScheduledPaymentsMongo,
  TransactionMongo,
  UserMongo,
} from "./types";
import { Collection, ObjectId } from "mongodb";
import {
  publishInvestmentUpdate,
  publishLoanUpdate,
  publishUser,
} from "./subscriptions/subscriptionsUtils";
import { RedisPubSub } from "graphql-redis-subscriptions";

export const UserTransaction = async (
  messageValue: string,
  users: Collection<UserMongo>,
  producer: Producer,
  loans: Collection<LoanMongo>,
  transactions: Collection<TransactionMongo>,
  scheduledPayments: Collection<ScheduledPaymentsMongo>,
  investments: Collection<InvestmentMongo>,
  pubsub: RedisPubSub
) => {
  const values = JSON.parse(messageValue);
  const {
    quantity,
    interestFromTotal,
    withheldFromAvailable,
    withheldFromToBePaid,
    user_id,
    loan_id,
    scheduled_id,
    isDelayed,
    nextTopic,
    nextValue,
    nextKey,
  }: {
    quantity: number;
    interestFromTotal: number;
    withheldFromAvailable: number;
    withheldFromToBePaid: number;
    user_id: string;
    loan_id: string;
    borrower_id: string;
    scheduled_id: string;
    isDelayed: boolean;
    nextTopic: string;
    nextValue: string;
    nextKey: string;
  } = values;
  const user = await users.findOne({ id: user_id });
  if (!user) {
    throw new Error("User not found.");
  }
  const accountAvailable = user.account_available;
  const accountTotal = user.account_total;
  const accountToBePaid = user.account_to_be_paid;
  const accountWithheld = user.account_withheld;
  if (withheldFromAvailable) {
    /*----- Quitar/Añadir fondos retenidos al usuario de fondos disponibles START -----*/
    const newAccountAvailable = accountAvailable - withheldFromAvailable;
    const resultIsMoreThanZero = newAccountAvailable >= 0;
    const newAccountWithheld = accountWithheld + withheldFromAvailable;
    if (resultIsMoreThanZero) {
      await users.updateOne(
        {
          id: user_id,
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
          id: user_id,
          account_available: newAccountAvailable,
          account_to_be_paid: accountToBePaid,
          account_total: accountTotal,
          account_withheld: newAccountWithheld,
        },
        pubsub
      );
      if (nextTopic && nextValue && nextKey) {
        await producer.send({
          topic: nextTopic,
          messages: [
            {
              value: nextValue,
              key: nextKey,
            },
          ],
        });
      }
    }
    /*----- Quitar/Añadir fondos retenidos al usuario de fondos disponibles END -----*/
  } else if (withheldFromToBePaid) {
    /*----- Quitar/Añadir fondos retenidos al usuario de fondos totales START -----*/
    const newAccountWithheld = accountWithheld - withheldFromToBePaid;
    const resultIsMoreThanZero = newAccountWithheld >= 0;
    const newAccountToBePaid = accountToBePaid + withheldFromToBePaid;
    if (resultIsMoreThanZero) {
      await users.updateOne(
        {
          id: user_id,
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
          id: user_id,
          account_available: accountAvailable,
          account_to_be_paid: accountToBePaid,
          account_total: accountTotal,
          account_withheld: newAccountWithheld,
        },
        pubsub
      );
    }
    /*----- Quitar/Añadir fondos retenidos al usuario de fondos totales END -----*/
  } else if (quantity) {
    /*----- Quitar/Añadir fondos disponibles al usuario START -----*/
    const newAccountAvailable = accountAvailable + quantity;
    const resultIsMoreThanZero = newAccountAvailable >= 0;
    const newAccountTotal = accountTotal + quantity;
    if (resultIsMoreThanZero) {
      await users.findOneAndUpdate(
        {
          id: user_id,
        },
        {
          $set: {
            account_available: newAccountAvailable,
            account_total: newAccountTotal,
          },
        }
      );
      const type =
        scheduled_id && quantity < 0
          ? "payment"
          : quantity > 0
            ? "credit"
            : "withdrawal";
      await transactions.insertOne({
        user_id,
        type,
        quantity,
        created_at: new Date(),
      });
      publishUser(
        {
          id: user_id,
          account_available: newAccountAvailable,
          account_to_be_paid: accountToBePaid,
          account_total: newAccountTotal,
          account_withheld: accountWithheld,
        },
        pubsub
      );
      //Se realizo un pago programado
      if (loan_id && quantity < 0) {
        const loan = await loans.findOne({
          _id: new ObjectId(loan_id),
        });
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
        await loans.updateOne(
          {
            _id: new ObjectId(loan_id),
          },
          {
            $set: {
              payments_done: newPaymentsDone,
              payments_delayed: newPaymentsDelayed,
              ...(allPaid ? { status: "paid" } : {}),
            },
          }
        );
        await scheduledPayments.updateOne(
          {
            _id: new ObjectId(scheduled_id),
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
        const resultInvestments = await investments
          .find({ loan_oid: new ObjectId(loan_id) })
          .toArray();
        for (const investment of resultInvestments) {
          const id = investment._id;
          const lender_id = investment.lender_id;
          const payments = investment.payments;
          const amortize = investment.amortize;
          const moratory = investment.moratory;
          const status_type = investment.status_type;
          const totalAmortize = amortize * term;
          const paid_already = amortize * (payments + 1);
          const to_be_paid = totalAmortize - paid_already;
          const borrower_id = investment.borrower_id;
          const newPayments = payments + 1;
          await investments.updateOne(
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
          await producer.send({
            topic: "user-transaction",
            messages: [
              {
                value: JSON.stringify({
                  interest: amortize + moratory,
                  user_id: lender_id,
                  loan_id,
                  borrower_id,
                }),
                key: lender_id,
              },
            ],
          });
        }
      }
      //NO se realizo un pago programado
    } else if (loan_id && quantity < 0) {
      const resultInvestments = await investments
        .find({ loan_oid: new ObjectId(loan_id) })
        .toArray();
      const scheduledPayment = await scheduledPayments.findOne({
        _id: new ObjectId(scheduled_id),
      });
      if (!scheduledPayment) {
        throw new Error("No scheduled payment found.");
      }
      await scheduledPayments.updateOne(
        {
          _id: scheduledPayment._id,
        },
        {
          $set: {
            status: "delayed",
          },
        }
      );
      for (const investment of resultInvestments) {
        const id = investment._id;
        const moratory = investment.moratory;
        const amortize = investment.amortize;
        const ROI = investment.roi;
        const loan_oid = investment.loan_oid;
        const borrower_id = investment.borrower_id;
        const dailyMoratory = Math.floor((amortize * (ROI / 100)) / 360);
        const newMoratory = dailyMoratory + moratory;
        await investments.updateOne(
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
        await producer.send({
          topic: "user-transaction",
          messages: [
            {
              value: JSON.stringify({
                interest: -dailyMoratory,
                user_id: id,
                loan_id: loan_oid.toHexString(),
                borrower_id,
              }),
              key: id.toHexString(),
            },
          ],
        });
      }
    }
    /*----- Quitar/Añadir fondos disponibles al usuario END -----*/
  } else if (interestFromTotal) {
    /*----- Quitar/Añadir ganancias futuras al usuario START -----*/
    const newAccountToBePaid = accountToBePaid + interestFromTotal;
    const resultIsMoreThanZero = newAccountToBePaid >= 0;
    const newAccountTotal = accountTotal + interestFromTotal;
    if (resultIsMoreThanZero) {
      await users.updateOne(
        {
          id: user_id,
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
          id: user_id,
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
};
