import { Kafka } from "kafkajs";
import cassandra from "cassandra-driver";
import { publishUser } from "./subscriptions/subscriptionsUtils";

const client = new cassandra.Client({
  contactPoints: ["cassandra-fintech"],
  localDataCenter: "datacenter1",
  keyspace: "fintech",
});

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["kafka:9092"],
});

const consumer = kafka.consumer({ groupId: "test-group" });

const run = async () => {
  await consumer.connect();
  //One topic for every table instead?
  //User account transaction topic
  await consumer.subscribe({
    topics: ["add-funds", "add-lends"],
    fromBeginning: true,
  });
  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (topic === "add-funds") {
        const messageDecoded = message.value?.toString() || "{}";
        const values = JSON.parse(messageDecoded);
        const { quantity, id_user } = values;
        /*----- Añadir/Quitar fondos al user START -----*/
        const resultUser = await client.execute(
          `SELECT * FROM fintech.users where id = ${id_user}`
        );
        const user = resultUser.first();
        const accountAvailable = user.get("account_available");
        const accountTotal = user.get("account_total");
        const newAccountAvailable = accountAvailable + quantity;
        const resultIsMoreThanZero = newAccountAvailable >= 0;
        const newAccountTotal = accountTotal + quantity;
        if (resultIsMoreThanZero) {
          await client.execute(`
                    UPDATE fintech.users
                        SET account_available = ${newAccountAvailable}, account_total = ${newAccountTotal}
                        WHERE id = ${id_user}`);
          const type = quantity > 0 ? "credit" : "withdrawal";
          await client.execute(
            `
                    INSERT INTO fintech.transactions (id, id_user, type, quantity, id_borrower, id_loan, created)
                        VALUES (now(), ${id_user}, ?, ${quantity}, null, null, toUnixTimestamp(now()))`,
            [type]
          );
        }
        /*----- Añadir/Quitar fondos al user END -----*/
      } else if (topic === "add-lends") {
        const messageDecoded = message.value?.toString() || "{}";
        const values: {
          id_lender: string;
          quantity: number;
          id_loan: string;
        } = JSON.parse(messageDecoded);
        const { quantity, id_loan, id_lender } = values;
        const [resultLender, resultLoan, resultInvestments] = await Promise.all(
          [
            client.execute(
              `SELECT * FROM fintech.users where id = ${id_lender}`
            ),
            client.execute(`SELECT * FROM fintech.loans where id = ${id_loan}`),
            client.execute(
              `SELECT * FROM fintech.investments_by_loan where id_loan = ${id_loan}`
            ),
          ]
        );
        const loan = resultLoan.first();
        const raised = loan.get("raised");
        const pending = loan.get("pending");
        const goal = loan.get("goal");
        const id_borrower = loan.get("id_user");
        const term = loan.get("term");
        const ROI = loan.get("roi");
        /*----- Quitar fondos al lender START -----*/
        const lender = resultLender.first();
        const accountAvailable = lender.get("account_available");
        const accountTotal = lender.get("account_total");
        const accountToBePaid = lender.get("account_to_be_paid");
        const newAccountAvailable = accountAvailable - quantity;
        const resultIsMoreThanZero = newAccountAvailable >= 0;
        const newAccountTotal = accountTotal - quantity;
        const newRaised = raised + quantity;
        const isLessOrEqualGoal = newRaised <= goal;
        const completed = newRaised === goal;
        if (resultIsMoreThanZero && isLessOrEqualGoal) {
          await Promise.all([
            client.execute(`
                            UPDATE fintech.users
                                SET account_available = ${newAccountAvailable}, account_total = ${newAccountTotal}
                                WHERE id = ${id_lender}`),
            client.execute(`
                            UPDATE fintech.loans
                                SET raised = ${raised + quantity}, pending = ${
                                  pending - quantity
                                }${completed ? `, status = "to be paid"` : ""}
                                WHERE id = ${id_loan}`),
          ]);
          publishUser({
            id: id_lender,
            account_available: accountAvailable,
            account_to_be_paid: accountToBePaid,
            account_total: accountTotal,
          });
        } else {
          return;
        }
        /*----- Quitar fondos al lender END -----*/
        const investmentsOperations: {
          query: string;
          params?: cassandra.ArrayOrObject | undefined;
        }[] = [];
        const TEM = Math.pow(1 + ROI / 100, 1 / 12) - 1;
        let found = false;
        for (const inv of resultInvestments.rows) {
          /*----- Actualizar inversion ya realizada previamente START -----*/
          if (id_loan === inv.id_loan && id_lender === inv.id_lender) {
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
            /*----- Añadir fondos al borrower START -----*/
            const resultBorrower = await client.execute(
              `SELECT * FROM fintech.users where id = ${id_borrower}`
            );
            const borrower = resultBorrower.first();
            const accountAvailable = borrower.get("account_available");
            const accountTotal = borrower.get("account_total");
            //Refactor: Create unique chord pattern
            await client.execute(`
                            UPDATE fintech.users
                                SET account_available = ${
                                  accountAvailable + goal
                                }, account_total = ${accountTotal + goal}
                                WHERE id = ${id_lender}`);
            publishUser({
              id: borrower.get("id"),
              account_available: borrower.get("account_available"),
              account_to_be_paid: borrower.get("account_to_be_paid"),
              account_total: borrower.get("account_total"),
            });
            /*----- Añadir fondos al borrower END -----*/
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
              query: `INSERT INTO fintech.investments_by_lender (id, id_borrower, id_lender, id_loan, quantity, created, updated, status, status_type, roi, term, payments, moratory, amortize, interest_to_earn, paid_already, to_be_paid)
                                VALUES (now(), ${id_borrower}, ${id_lender}, ${id_loan}, ${quantity}, now(), now(), "up to date", 'on_going', ${ROI}, ${term}, 0, 0, ${amortize}, ${interest_to_earn}, 0, ${amortizes})`,
            });
            investmentsOperations.push({
              query: `INSERT INTO fintech.investments_by_status_type (id, id_borrower, id_lender, id_loan, quantity, created, updated, status, status_type, roi, term, payments, moratory, amortize, interest_to_earn, paid_already, to_be_paid)
                                VALUES (now(), ${id_borrower}, ${id_lender}, ${id_loan}, ${quantity}, now(), now(), "up to date", 'on_going', ${ROI}, ${term}, 0, 0, ${amortize}, ${interest_to_earn}, 0, ${amortizes})`,
            });
            investmentsOperations.push({
              query: `INSERT INTO fintech.investments_by_loan (id, id_borrower, id_lender, id_loan, quantity, created, updated, status, status_type, roi, term, payments, moratory, amortize, interest_to_earn, paid_already, to_be_paid)
                                VALUES (now(), ${id_borrower}, ${id_lender}, ${id_loan}, ${quantity}, now(), now(), "up to date", 'on_going', ${ROI}, ${term}, 0, 0, ${amortize}, ${interest_to_earn}, 0, ${amortizes})`,
            });
          } else {
            investmentsOperations.push({
              query: `INSERT INTO fintech.investments_by_lender (id, id_borrower, id_lender, id_loan, quantity, created, updated, status, status_type, roi, term, payments, moratory, amortize, interest_to_earn, paid_already, to_be_paid)
                                VALUES (now(), ${id_borrower}, ${id_lender}, ${id_loan}, ${quantity}, now(), now(), "financing", 'on_going', ${ROI}, ${term}, 0, 0, 0, 0, 0, 0)`,
            });
            investmentsOperations.push({
              query: `INSERT INTO fintech.investments_by_status_type (id, id_borrower, id_lender, id_loan, quantity, created, updated, status, status_type, roi, term, payments, moratory, amortize, interest_to_earn, paid_already, to_be_paid)
                                VALUES (now(), ${id_borrower}, ${id_lender}, ${id_loan}, ${quantity}, now(), now(), "financing", 'on_going', ${ROI}, ${term}, 0, 0, 0, 0, 0, 0)`,
            });
            investmentsOperations.push({
              query: `INSERT INTO fintech.investments_by_loan (id, id_borrower, id_lender, id_loan, quantity, created, updated, status, status_type, roi, term, payments, moratory, amortize, interest_to_earn, paid_already, to_be_paid)
                                VALUES (now(), ${id_borrower}, ${id_lender}, ${id_loan}, ${quantity}, now(), now(), "financing", 'on_going', ${ROI}, ${term}, 0, 0, 0, 0, 0, 0)`,
            });
          }
        }
        /*----- Insertar nueva inversion si no ha sido creada END -----*/
        await client.batch(investmentsOperations);
      }
    },
  });
};

run();
