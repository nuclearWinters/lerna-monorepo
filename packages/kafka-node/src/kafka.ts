import { Consumer, Producer } from "kafkajs";
import { Client, ArrayOrObject } from "cassandra-driver";
import {
  publishInvestmentUpdate,
  publishLoanUpdate,
  publishUser,
} from "./subscriptions/subscriptionsUtils";

export const runKafkaConsumer = async (
  consumer: Consumer,
  client: Client,
  producer: Producer
) => {
  await consumer.connect();
  //One topic for every table instead?
  //User account transaction topic
  await consumer.subscribe({
    topics: ["add-lends", "user-transaction", "loan-transaction"],
    fromBeginning: true,
  });
  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (topic === "loan-transaction") {
        const messageDecoded = message.value?.toString() || "{}";
        const values = JSON.parse(messageDecoded);
        const { quantity, lender_id, loan_id, nextTopic, nextValue, nextKey } =
          values;
        const resultLoan = await client.execute(
          `SELECT * FROM fintech.loans_by_user where id = ${loan_id}`
        );
        const loan = resultLoan.first();
        const raised = loan.get("raised");
        const pending = loan.get("pending");
        const goal = loan.get("goal");
        const newRaised = raised + quantity;
        const newPending = pending - quantity;
        const isLessOrEqualGoal = newRaised <= goal;
        const completed = newRaised === goal;
        if (isLessOrEqualGoal) {
          await client.batch([
            {
              query: `UPDATE fintech.loans_by_user
                                SET raised = ${newRaised}, pending = ${newPending}${
                                  completed ? `, status = "to be paid"` : ""
                                }
                                WHERE id = ${loan_id}`,
            },
            {
              query: `UPDATE fintech.loans_by_status
                                SET raised = ${newRaised}, pending = ${newPending}${
                                  completed ? `, status = "to be paid"` : ""
                                }
                                WHERE id = ${loan_id}`,
            },
          ]);
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
      }
      if (topic === "user-transaction") {
        const messageDecoded = message.value?.toString() || "{}";
        const values = JSON.parse(messageDecoded);
        const {
          quantity,
          interest,
          withheld,
          user_id,
          loan_id,
          scheduled_id,
          isDelayed,
          nextTopic,
          nextValue,
          nextKey,
        } = values;
        const resultUser = await client.execute(
          `SELECT * FROM fintech.users where id = ${user_id}`
        );
        const user = resultUser.first();
        const accountAvailable = user.get("account_available");
        const accountTotal = user.get("account_total");
        const accountToBePaid = user.get("account_to_be_paid");
        const accountWithheld = user.get("account_withheld");
        if (withheld) {
          /*----- Quitar/Añadir fondos retenidos al usuario START -----*/
          const newAccountAvailable = accountAvailable + withheld;
          const resultIsMoreThanZero = newAccountAvailable >= 0;
          const newAccountTotal = accountTotal - withheld;
          const newAccountWithheld = accountWithheld - withheld;
          if (resultIsMoreThanZero) {
            await client.execute(`UPDATE fintech.users
                            SET account_available = ${newAccountAvailable}, account_total = ${newAccountTotal}
                            WHERE id = ${user_id}`);
            publishUser({
              id: user_id,
              account_available: newAccountAvailable,
              account_to_be_paid: accountToBePaid,
              account_total: accountTotal,
              account_withheld: newAccountWithheld,
            });
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
          /*----- Quitar/Añadir fondos retenidos al usuario END -----*/
        } else if (quantity) {
          /*----- Quitar/Añadir fondos disponibles al usuario START -----*/
          const newAccountAvailable = accountAvailable + quantity;
          const resultIsMoreThanZero = newAccountAvailable >= 0;
          const newAccountTotal = accountTotal + quantity;
          if (resultIsMoreThanZero) {
            await client.execute(`UPDATE fintech.users
                            SET account_available = ${newAccountAvailable}, account_total = ${newAccountTotal}
                            WHERE id = ${user_id}`);
            const type =
              scheduled_id && quantity < 0
                ? "payment"
                : quantity > 0
                  ? "credit"
                  : "withdrawal";
            await client.execute(
              `INSERT INTO fintech.transactions_by_user (id, user_id, type, quantity, borrower_id, loan_id, created)
                            VALUES (now(), ${user_id}, ?, ${quantity}, null, null, toUnixTimestamp(now()))`,
              [type]
            );
            publishUser({
              id: user_id,
              account_available: newAccountAvailable,
              account_to_be_paid: accountToBePaid,
              account_total: newAccountTotal,
              account_withheld: accountWithheld,
            });
            //Se realizo un pago programado
            if (loan_id && quantity < 0) {
              const resultLoan = await client.execute(
                `SELECT * FROM fintech.loans_by_status WHERE id = ${loan_id}`
              );
              const loan = resultLoan.first();
              const paymentsDone = loan.get("payments_done");
              const term = loan.get("term");
              const ROI = loan.get("roi");
              const borrower_id = loan.get("user_id");
              const newPaymentsDone = paymentsDone + 1;
              const allPaid = newPaymentsDone === term;
              const paymentsDelayed = loan.get("payments_delayed");
              const newPaymentsDelayed = isDelayed
                ? paymentsDelayed - 1
                : paymentsDelayed;
              const noDelayed = newPaymentsDelayed === 0;
              await client.execute(
                `UPDATE fintech.loans_by_status SET payments_done = ${newPaymentsDone}, payments_delayed = ${newPaymentsDelayed}${
                  allPaid ? `, status = "paid"` : ""
                } WHERE id = ${loan_id}`
              );
              await client.execute(
                `UPDATE fintech.scheduled_payments_by_status SET status = "paid" WHERE id = ${loan_id}`
              );
              publishLoanUpdate({
                id: loan.get("id"),
                user_id: borrower_id,
                score: loan.get("score"),
                roi: ROI,
                goal: loan.get("goal"),
                term,
                raised: loan.get("raised"),
                expiry: loan.get("expiry"),
                status: allPaid ? "paid" : loan.get("status"),
                pending: loan.get("pending"),
                payments_done: loan.get("payments_done"),
                payments_delayed: newPaymentsDelayed,
              });
              const resultInvestments = await client.execute(
                `SELECT * FROM fintech.investments_by_loan WHERE loan_id = ${loan_id}`
              );
              const cassandraOperations: {
                query: string;
                params?: ArrayOrObject | undefined;
              }[] = [];
              for (const investment of resultInvestments.rows) {
                const id = investment.get("id");
                const lender_id = investment.get("lender_id");
                const payments = investment.get("payments");
                const amortize = investment.get("amortize");
                const moratory = Math.floor((amortize * (ROI / 100)) / 360);
                const totalAmortize = amortize * term;
                const paid_already = amortize * (payments + 1);
                const to_be_paid = totalAmortize - paid_already;
                cassandraOperations.push({
                  query: `UPDATE fintech.investments_by_loan SET to_be_paid = ${to_be_paid}, paid_already = ${paid_already}${
                    noDelayed || allPaid
                      ? `, status = ${allPaid ? "paid" : "up to date"}`
                      : ""
                  } WHERE id = ${loan_id}`,
                });
                publishInvestmentUpdate({
                  id,
                  borrower_id: investment.get("borrower_id"),
                  lender_id,
                  loan_id: investment.get("loan_id"),
                  quantity: investment.get("quantity"),
                  created_at: investment.get("created_at"),
                  updated_at: investment.get("updated_at"),
                  status: allPaid
                    ? "paid"
                    : noDelayed
                      ? "up to date"
                      : investment.get("status"),
                  status_type: investment.get("status_type"),
                  roi: investment.get("roi"),
                  term: investment.get("term"),
                  payments: payments + 1,
                  moratory: investment.get("moratory"),
                  amortize: amortize,
                  interest_to_earn: investment.get("interest_to_earn"),
                  paid_already,
                  to_be_paid,
                });
                await producer.send({
                  topic: "user-transaction",
                  messages: [
                    {
                      value: JSON.stringify({
                        interest: amortize + moratory,
                        user_id: lender_id,
                      }),
                      key: lender_id,
                    },
                  ],
                });
              }
              await client.batch(cassandraOperations);
            }
            //NO se realizo un pago programado
          } else if (loan_id && quantity < 0) {
            const resultInvestments = await client.execute(
              `SELECT * FROM fintech.investments_by_loan WHERE loan_id = ${loan_id}`
            );
            const resultScheduledPayment = await client.execute(
              `SELECT * FROM fintech.scheduled_payments_by_loan WHERE id = ${scheduled_id} AND loan_id = ${loan_id}`
            );
            const scheduledPayment = resultScheduledPayment.first();
            const scheduledPaymentStatus = scheduledPayment.get("status");
            const scheduledPaymentAmortize = scheduledPayment.get("amortize");
            const scheduledPaymentScheduledDate =
              scheduledPayment.get("scheduled_date");
            const scheduledPaymentLenderId = scheduledPayment.get("lender_id");
            const scheduledPaymentStatusType =
              scheduledPayment.get("status_type");
            await client.execute(
              `DELETE FROM fintech.scheduled_payments_by_status WHERE id = ${scheduled_id} AND status = ?`,
              [scheduledPaymentStatus]
            );
            await Promise.all([
              client.execute(
                `INSERT INTO fintech.scheduled_payments_by_status (id, loan_id, amortize, status, scheduled_date) VALUES (${scheduled_id}, ${loan_id}, ${scheduledPaymentAmortize}, ?, ${scheduledPaymentScheduledDate})`,
                [scheduledPaymentStatus]
              ),
              client.execute(
                `UPDATE fintech.scheduled_payments_by_loan SET status = 'delayed' WHERE id = ${scheduled_id} AND loan_id = ${loan_id}`
              ),
            ]);
            for (const investment of resultInvestments.rows) {
              const id = investment.get("id");
              const borrower_id = investment.get("borrower_id");
              const lender_id = investment.get("lender_id");
              const loan_id = investment.get("loan_id");
              const quantity = investment.get("quantity");
              const created_at = investment.get("created_at");
              const updated_at = investment.get("updated_at");
              const status_type = investment.get("status_type");
              const roi = investment.get("roi");
              const term = investment.get("term");
              const payments = investment.get("payments");
              const moratory = investment.get("moratory");
              const amortize = investment.get("amortize");
              const interest_to_earn = investment.get("interest_to_earn");
              const paid_already = investment.get("paid_already");
              const to_be_paid = investment.get("to_be_paid");
              const ROI = investment.get("roi");
              const dailyMoratory = Math.floor((amortize * (ROI / 100)) / 360);
              const newMoratory = dailyMoratory + moratory;
              await client.execute(
                `DELETE FROM fintech.scheduled_payments_by_status_type WHERE id = ${scheduled_id} AND status_type = ?`,
                [scheduledPaymentStatusType]
              );
              await Promise.all([
                client.execute(
                  `INSERT INTO fintech.investments_by_status_type (id, borrower_id, lender_id, loan_id, quantity, created_at, updated_at, status, status_type, roi, term, payments, moratory, amortize, interest_to_earn, paid_already, to_be_paid)
                                    VALUES (${id}, ${borrower_id}, ${lender_id}, ${quantity}, ${created_at}, ${updated_at}, 'delayed_payment', ?, ${roi}, ${term}, ${payments}, ${newMoratory}, ${amortize}, ${interest_to_earn}, ${paid_already}, ${to_be_paid}`,
                  [status_type]
                ),
                client.execute(
                  `UPDATE fintech.investments_by_loan SET status = 'delayed payment', moratory = ${newMoratory} WHERE loan_id = ${loan_id} AND id = ${id}`
                ),
                client.execute(
                  `UPDATE fintech.investments_by_lender SET status = 'delayed payment', moratory = ${newMoratory} WHERE lender_id = ${scheduledPaymentLenderId} AND id = ${id}`
                ),
              ]);
              publishInvestmentUpdate({
                id,
                borrower_id: investment.get("borrower_id"),
                lender_id: investment.get("lender_id"),
                loan_id: investment.get("loan_id"),
                quantity: investment.get("quantity"),
                created_at: investment.get("created_at"),
                updated_at: investment.get("updated_at"),
                status: investment.get("status"),
                status_type: investment.get("status_type"),
                roi: ROI,
                term: investment.get("term"),
                payments: investment.get("payments"),
                moratory: newMoratory,
                amortize,
                interest_to_earn: investment.get("interest_to_earn"),
                paid_already: investment.get("paid_already"),
                to_be_paid: investment.get("to_be_paid"),
              });
              await producer.send({
                topic: "user-transaction",
                messages: [
                  {
                    value: JSON.stringify({
                      interest: moratory,
                      user_id: id,
                    }),
                    key: id,
                  },
                ],
              });
            }
          }
          /*----- Quitar/Añadir fondos disponibles al usuario END -----*/
        } else if (interest) {
          /*----- Quitar/Añadir ganancias futuras al usuario START -----*/
          const newAccountToBePaid = accountToBePaid + interest;
          const resultIsMoreThanZero = newAccountToBePaid >= 0;
          const newAccountTotal = accountTotal + interest;
          if (resultIsMoreThanZero) {
            await client.execute(`UPDATE fintech.users
                            SET account_to_be_paid = ${newAccountToBePaid}, account_total = ${newAccountTotal}
                            WHERE id = ${user_id}`);
            publishUser({
              id: user_id,
              account_available: accountAvailable,
              account_to_be_paid: newAccountToBePaid,
              account_total: newAccountTotal,
              account_withheld: accountWithheld,
            });
          }
          /*----- Quitar/Añadir ganancias futuras al usuario END -----*/
        }
      } else if (topic === "add-lends") {
        const messageDecoded = message.value?.toString() || "{}";
        const values: {
          lender_id: string;
          quantity: number;
          loan_id: string;
        } = JSON.parse(messageDecoded);
        const { quantity, loan_id, lender_id } = values;
        const [resultLoan, resultInvestments] = await Promise.all([
          client.execute(
            `SELECT * FROM fintech.loans_by_user where id = ${loan_id}`
          ),
          client.execute(
            `SELECT * FROM fintech.investments_by_loan where loan_id = ${loan_id}`
          ),
        ]);
        const loan = resultLoan.first();
        const raised = loan.get("raised");
        const goal = loan.get("goal");
        const borrower_id = loan.get("user_id");
        const term = loan.get("term");
        const ROI = loan.get("roi");
        const newRaised = raised + quantity;
        const completed = newRaised === goal;
        const investmentsOperations: {
          query: string;
          params?: ArrayOrObject | undefined;
        }[] = [];
        const TEM = Math.pow(1 + ROI / 100, 1 / 12) - 1;
        let found = false;
        for (const inv of resultInvestments.rows) {
          /*----- Actualizar inversion ya realizada previamente START -----*/
          if (loan_id === inv.loan_id && lender_id === inv.lender_id) {
            found = true;
            inv.quantity += quantity;
            //Si se completo el loan entonces actualizar la inversion como lista para ser pagada
            if (completed) {
              const amortize = Math.floor(
                inv.quantity / ((1 - Math.pow(1 / (1 + TEM), term)) / TEM)
              );
              const amortizes = amortize * term;
              const interest_to_earn = amortizes - inv.quantity;
              investmentsOperations.push({
                query: `UPDATE fintech.investments_by_lender SET quantity = ${inv.quantity} interest_to_earn = ${interest_to_earn}, amortize = ${amortize}, to_be_paid = ${amortizes}, status = "up to date" WHERE id = ${inv.id}`,
              });
              investmentsOperations.push({
                query: `UPDATE fintech.investments_by_status_type SET quantity = ${inv.quantity} interest_to_earn = ${interest_to_earn}, amortize = ${amortize}, to_be_paid = ${amortizes}, status = "up to date" WHERE id = ${inv.id}`,
              });
              investmentsOperations.push({
                query: `UPDATE fintech.investments_by_loan SET quantity = ${inv.quantity} interest_to_earn = ${interest_to_earn}, amortize = ${amortize}, to_be_paid = ${amortizes}, status = "up to date" WHERE id = ${inv.id}`,
              });
              //Si NO se completo el loan entonces solo sumarle la cantidad a la inversion
            } else {
              investmentsOperations.push({
                query: `UPDATE fintech.investments_by_lender SET quantity = ${inv.quantity} WHERE id = ${inv.id}`,
              });
              investmentsOperations.push({
                query: `UPDATE fintech.investments_by_status_type SET quantity = ${inv.quantity} WHERE id = ${inv.id}`,
              });
              investmentsOperations.push({
                query: `UPDATE fintech.investments_by_loan SET quantity = ${inv.quantity} WHERE id = ${inv.id}`,
              });
            }
            /*----- Actualizar inversion ya realizada previamente END -----*/
          } else if (completed) {
            await producer.send({
              topic: "user-transaction",
              messages: [
                {
                  value: JSON.stringify({
                    quantity: goal,
                    user_id: borrower_id,
                  }),
                  key: borrower_id,
                },
              ],
            });
            /*----- Actualizar las inversiones como listas para ser pagadas START -----*/
            const amortize = Math.floor(
              inv.quantity / ((1 - Math.pow(1 / (1 + TEM), inv.term)) / TEM)
            );
            const amortizes = amortize * inv.term;
            const interest_to_earn = amortizes - inv.quantity;
            investmentsOperations.push({
              query: `UPDATE fintech.investments_by_lender SET interest_to_earn = ${interest_to_earn}, amortize = ${amortize}, to_be_paid = ${amortizes}, status = "up to date" WHERE id = ${inv.id}`,
            });
            investmentsOperations.push({
              query: `UPDATE fintech.investments_by_status_type SET interest_to_earn = ${interest_to_earn}, amortize = ${amortize}, to_be_paid = ${amortizes}, status = "up to date" WHERE id = ${inv.id}`,
            });
            investmentsOperations.push({
              query: `UPDATE fintech.investments_by_loan SET interest_to_earn = ${interest_to_earn}, amortize = ${amortize}, to_be_paid = ${amortizes}, status = "up to date" WHERE id = ${inv.id}`,
            });
            /*----- Actualizar las inversiones como listas para ser pagadas END -----*/
          }
        }
        /*----- Insertar nueva inversion si no ha sido creada START -----*/
        if (!found) {
          if (completed) {
            const amortize = Math.floor(
              quantity / ((1 - Math.pow(1 / (1 + TEM), term)) / TEM)
            );
            const amortizes = amortize * term;
            const interest_to_earn = amortizes - quantity;
            investmentsOperations.push({
              query: `INSERT INTO fintech.investments_by_lender (id, borrower_id, lender_id, loan_id, quantity, created_at, updated_at, status, status_type, roi, term, payments, moratory, amortize, interest_to_earn, paid_already, to_be_paid)
                                VALUES (now(), ${borrower_id}, ${lender_id}, ${loan_id}, ${quantity}, now(), now(), "up to date", 'on_going', ${ROI}, ${term}, 0, 0, ${amortize}, ${interest_to_earn}, 0, ${amortizes})`,
            });
            investmentsOperations.push({
              query: `INSERT INTO fintech.investments_by_status_type (id, borrower_id, lender_id, loan_id, quantity, created_at updated_at, status, status_type, roi, term, payments, moratory, amortize, interest_to_earn, paid_already, to_be_paid)
                                VALUES (now(), ${borrower_id}, ${lender_id}, ${loan_id}, ${quantity}, now(), now(), "up to date", 'on_going', ${ROI}, ${term}, 0, 0, ${amortize}, ${interest_to_earn}, 0, ${amortizes})`,
            });
            investmentsOperations.push({
              query: `INSERT INTO fintech.investments_by_loan (id, borrower_id, lender_id, loan_id, quantity, created_at updated_at, status, status_type, roi, term, payments, moratory, amortize, interest_to_earn, paid_already, to_be_paid)
                                VALUES (now(), ${borrower_id}, ${lender_id}, ${loan_id}, ${quantity}, now(), now(), "up to date", 'on_going', ${ROI}, ${term}, 0, 0, ${amortize}, ${interest_to_earn}, 0, ${amortizes})`,
            });
          } else {
            investmentsOperations.push({
              query: `INSERT INTO fintech.investments_by_lender (id, borrower_id, lender_id, loan_id, quantity, created_at updated_at, status, status_type, roi, term, payments, moratory, amortize, interest_to_earn, paid_already, to_be_paid)
                                VALUES (now(), ${borrower_id}, ${lender_id}, ${loan_id}, ${quantity}, now(), now(), "financing", 'on_going', ${ROI}, ${term}, 0, 0, 0, 0, 0, 0)`,
            });
            investmentsOperations.push({
              query: `INSERT INTO fintech.investments_by_status_type (id, borrower_id, lender_id, loan_id, quantity, created_at, updated_at, status, status_type, roi, term, payments, moratory, amortize, interest_to_earn, paid_already, to_be_paid)
                                VALUES (now(), ${borrower_id}, ${lender_id}, ${loan_id}, ${quantity}, now(), now(), "financing", 'on_going', ${ROI}, ${term}, 0, 0, 0, 0, 0, 0)`,
            });
            investmentsOperations.push({
              query: `INSERT INTO fintech.investments_by_loan (id, borrower_id, lender_id, loan_id, quantity, created_at, updated_at, status, status_type, roi, term, payments, moratory, amortize, interest_to_earn, paid_already, to_be_paid)
                                VALUES (now(), ${borrower_id}, ${lender_id}, ${loan_id}, ${quantity}, now(), now(), "financing", 'on_going', ${ROI}, ${term}, 0, 0, 0, 0, 0, 0)`,
            });
          }
        }
        /*----- Insertar nueva inversion si no ha sido creada END -----*/
        await client.batch(investmentsOperations);
      }
    },
  });
};
