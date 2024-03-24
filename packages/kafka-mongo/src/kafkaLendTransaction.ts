import { Producer } from "kafkajs";
import { InvestmentMongo, LoanMongo } from "./types";
import { Collection, ObjectId } from "mongodb";

export const AddLends = async (
  messageValue: string,
  loans: Collection<LoanMongo>,
  investments: Collection<InvestmentMongo>,
  producer: Producer
) => {
  const values: {
    lender_id: string;
    quantity: number;
    loan_id: string;
  } = JSON.parse(messageValue);
  const { quantity, loan_id, lender_id } = values;
  const loan_oid = new ObjectId(loan_id);
  const [loan, resultInvestments] = await Promise.all([
    loans.findOne({ _id: new ObjectId(loan_id) }),
    investments.find({ loan_oid: new ObjectId(loan_id) }).toArray(),
  ]);
  if (!loan) {
    throw new Error("Loan not found");
  }
  const raised = loan.raised;
  const goal = loan.goal;
  const borrower_id = loan.user_id;
  const term = loan.term;
  const ROI = loan.roi;
  const newRaised = raised + quantity;
  const completed = newRaised === goal;
  const TEM = Math.pow(1 + ROI / 100, 1 / 12) - 1;
  let found = false;
  for (const inv of resultInvestments) {
    /*----- Actualizar inversion ya realizada previamente START -----*/
    if (loan_id === inv.loan_oid.toHexString() && lender_id === inv.lender_id) {
      found = true;
      inv.quantity += quantity;
      //Si se completo el loan entonces actualizar la inversion como lista para ser pagada
      if (completed) {
        const amortize = Math.floor(
          inv.quantity / ((1 - Math.pow(1 / (1 + TEM), term)) / TEM)
        );
        const amortizes = amortize * term;
        const interest_to_earn = amortizes - inv.quantity;
        await investments.updateOne(
          {
            _id: inv._id,
          },
          {
            $set: {
              quantity: inv.quantity,
              interest_to_earn,
              amortize,
              to_be_paid: amortizes,
              status: "up to date",
            },
          }
        );
        //Si NO se completo el loan entonces solo sumarle la cantidad a la inversion
      } else {
        await investments.updateOne(
          {
            _id: inv._id,
          },
          {
            $set: {
              quantity: inv.quantity,
            },
          }
        );
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
      await investments.updateOne(
        {
          _id: inv._id,
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
      investments.insertOne({
        borrower_id,
        lender_id,
        loan_oid,
        quantity,
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
    } else {
      investments.insertOne({
        borrower_id,
        lender_id,
        loan_oid: new ObjectId(loan_id),
        quantity,
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
    }
  }
  /*----- Insertar nueva inversion si no ha sido creada END -----*/
};
