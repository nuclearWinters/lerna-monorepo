import { MongoClient, ObjectId } from "mongodb";
import {
  TransactionMongo,
  InvestmentMongo,
  LoanMongo,
  UserMongo,
} from "./types";
import { addMonths } from "date-fns";

MongoClient.connect("mongodb://localhost:27017?directConnection=true", {}).then(
  async (client) => {
    const expiry = addMonths(new Date(), 3);
    const db = client.db("fintech");
    const loans = db.collection<LoanMongo>("loans");
    await loans.deleteMany({});
    const users = db.collection<UserMongo>("users");
    await users.deleteMany({});
    const investments = db.collection<InvestmentMongo>("investments");
    await investments.deleteMany({});
    const transactions = db.collection<TransactionMongo>("transactions");
    await transactions.deleteMany({});
    const _id_transaction_1 = new ObjectId("607bd608ef9719001cf38120");
    const _id_transaction_2 = new ObjectId("607bd608ef9719001cf38121");
    const _id_transaction_3 = new ObjectId("607bd608ef9719001cf38122");
    const _id_transaction_4 = new ObjectId("607bd608ef9719001cf38123");
    const _id_transaction_5 = new ObjectId("607bd608ef9719001cf38124");
    const _id_transaction_6 = new ObjectId("607bd608ef9719001cf38125");
    const _id_transaction_7 = new ObjectId("607bd608ef9719001cf38126");
    const now = new Date();
    const _id_investment_1 = new ObjectId("607bd608ef9716001cf38126");
    await users.insertMany([
      {
        _id: new ObjectId("607bd608ef9719001cf38fd5"),
        id: "wHHR1SUBT0dspoF4YUOw1",
        account_available: 0,
        account_to_be_paid: 0,
        account_total: 0,
        account_withheld: 0,
      },
      {
        _id: new ObjectId("6095f055f92be2001a15885b"),
        id: "wHHR1SUBT0dspoF4YUOw2",
        account_available: 0,
        account_to_be_paid: 0,
        account_total: 0,
        account_withheld: 0,
      },
      {
        _id: new ObjectId("6095f172f92be2001a15885c"),
        id: "wHHR1SUBT0dspoF4YUOw3",
        account_available: 0,
        account_to_be_paid: 0,
        account_total: 0,
        account_withheld: 0,
      },
    ]);

    await loans.insertMany([
      {
        _id: new ObjectId("609875a48f2814002aaefe24"),
        user_id: "wHHR1SUBT0dspoF4YUOw2",
        score: "AAA",
        raised: 0,
        expiry,
        roi: 17,
        goal: 10000000,
        term: 9,
        status: "waiting for approval",
        pending: 10000000,
        payments_delayed: 0,
        payments_done: 0,
      },
      {
        _id: new ObjectId("609875a48f2814002aaefe25"),
        user_id: "wHHR1SUBT0dspoF4YUOw2",
        score: "AAA",
        raised: 9500000,
        expiry,
        roi: 17,
        goal: 10000000,
        term: 6,
        status: "financing",
        pending: 500000,
        payments_delayed: 0,
        payments_done: 0,
      },
      {
        _id: new ObjectId("609875a48f2814002aaefe26"),
        user_id: "wHHR1SUBT0dspoF4YUOw2",
        score: "AAA",
        raised: 0,
        expiry,
        roi: 17,
        goal: 9000000,
        term: 8,
        status: "financing",
        pending: 9000000,
        payments_delayed: 0,
        payments_done: 0,
      },
      {
        _id: new ObjectId("609875a48f2814002aaefe27"),
        user_id: "wHHR1SUBT0dspoF4YUOw2",
        score: "AAA",
        raised: 10000000,
        expiry,
        roi: 17,
        goal: 10000000,
        term: 6,
        status: "paid",
        payments_delayed: 0,
        payments_done: 0,
        /*scheduledPayments: [
          {
            scheduledDate: startOfMonth(addMonths(new Date(), -6)),
            amortize: 1744326,
            status: "paid",
          },
          {
            scheduledDate: startOfMonth(addMonths(new Date(), -5)),
            amortize: 1744326,
            status: "paid",
          },
          {
            scheduledDate: startOfMonth(addMonths(new Date(), -4)),
            amortize: 1744326,
            status: "paid",
          },
          {
            scheduledDate: startOfMonth(addMonths(new Date(), -3)),
            amortize: 1744326,
            status: "paid",
          },
          {
            scheduledDate: startOfMonth(addMonths(new Date(), -2)),
            amortize: 1744326,
            status: "paid",
          },
          {
            scheduledDate: startOfMonth(addMonths(new Date(), -1)),
            amortize: 1744326,
            status: "paid",
          },
        ],*/
        pending: 0,
      },
      {
        _id: new ObjectId("609875a48f2814002aaefe28"),
        user_id: "wHHR1SUBT0dspoF4YUOw2",
        score: "AAA",
        raised: 0,
        expiry,
        roi: 17,
        goal: 8000000,
        term: 7,
        status: "financing",
        pending: 8000000,
        payments_delayed: 0,
        payments_done: 0,
      },
      {
        _id: new ObjectId("609875a48f2814002aaefe29"),
        user_id: "wHHR1SUBT0dspoF4YUOw2",
        score: "AAA",
        raised: 0,
        expiry,
        roi: 17,
        goal: 7000000,
        term: 9,
        status: "financing",
        pending: 7000000,
        payments_delayed: 0,
        payments_done: 0,
      },
      {
        _id: new ObjectId("609875a48f2814002aaefe30"),
        user_id: "wHHR1SUBT0dspoF4YUOw2",
        score: "AAA",
        raised: 0,
        expiry,
        roi: 17,
        goal: 6000000,
        term: 6,
        status: "financing",
        pending: 6000000,
        payments_delayed: 0,
        payments_done: 0,
      },
      {
        _id: new ObjectId("609875a48f2814002aaefe31"),
        user_id: "wHHR1SUBT0dspoF4YUOw2",
        score: "AAA",
        raised: 0,
        expiry,
        roi: 17,
        goal: 5000000,
        term: 8,
        status: "financing",
        pending: 5000000,
        payments_delayed: 0,
        payments_done: 0,
      },
      {
        _id: new ObjectId("609875a48f2814002aaefe32"),
        user_id: "wHHR1SUBT0dspoF4YUOw2",
        score: "AAA",
        raised: 5000000,
        expiry,
        roi: 17,
        goal: 5000000,
        term: 5,
        status: "to be paid",
        /*scheduledPayments: [
          {
            scheduledDate: startOfMonth(addMonths(new Date(), 1)),
            amortize: 1039853,
            status: "to be paid",
          },
          {
            scheduledDate: startOfMonth(addMonths(new Date(), 2)),
            amortize: 1039853,
            status: "to be paid",
          },
          {
            scheduledDate: startOfMonth(addMonths(new Date(), 3)),
            amortize: 1039853,
            status: "to be paid",
          },
          {
            scheduledDate: startOfMonth(addMonths(new Date(), 4)),
            amortize: 1039853,
            status: "to be paid",
          },
          {
            scheduledDate: startOfMonth(addMonths(new Date(), 5)),
            amortize: 1039853,
            status: "to be paid",
          },
        ],*/
        pending: 0,
        payments_delayed: 0,
        payments_done: 0,
      },
    ]);

    await investments.insertMany([
      {
        _id: _id_investment_1,
        borrower_id: "wHHR1SUBT0dspoF4YUOw2",
        lender_id: "wHHR1SUBT0dspoF4YUOw1",
        loan_oid: new ObjectId("609875a48f2814002aaefe25"),
        created_at: new Date(),
        quantity: 9500000,
        updated_at: new Date(),
        status: "financing",
        roi: 17,
        moratory: 0,
        payments: 0,
        term: 6,
        interest_to_earn: 0,
        to_be_paid: 0,
        paid_already: 0,
        amortize: 0,
        status_type: "on_going",
      },
    ]);

    await transactions.insertMany([
      {
        _id: _id_transaction_1,
        user_id: "wHHR1SUBT0dspoF4YUOw1",
        type: "invest",
        quantity: -5000000,
        created_at: now,
        borrower_id: "",
        loan_oid: new ObjectId(),
      },
      {
        _id: _id_transaction_2,
        user_id: "wHHR1SUBT0dspoF4YUOw1",
        type: "invest",
        quantity: -1000000,
        created_at: now,
        borrower_id: "",
        loan_oid: new ObjectId(),
      },
      {
        _id: _id_transaction_3,
        user_id: "wHHR1SUBT0dspoF4YUOw1",
        type: "invest",
        quantity: -1000000,
        created_at: now,
        borrower_id: "",
        loan_oid: new ObjectId(),
      },
      {
        _id: _id_transaction_4,
        user_id: "wHHR1SUBT0dspoF4YUOw1",
        type: "invest",
        quantity: -1000000,
        created_at: now,
        borrower_id: "",
        loan_oid: new ObjectId(),
      },
      {
        _id: _id_transaction_5,
        user_id: "wHHR1SUBT0dspoF4YUOw1",
        type: "invest",
        quantity: -500000,
        created_at: now,
        borrower_id: "",
        loan_oid: new ObjectId(),
      },
      {
        _id: _id_transaction_6,
        user_id: "wHHR1SUBT0dspoF4YUOw1",
        type: "invest",
        quantity: -500000,
        created_at: now,
        borrower_id: "",
        loan_oid: new ObjectId(),
      },
      {
        _id: _id_transaction_7,
        user_id: "wHHR1SUBT0dspoF4YUOw1",
        type: "invest",
        quantity: -500000,
        created_at: now,
        borrower_id: "",
        loan_oid: new ObjectId(),
      },
    ]);
    process.exit();
  }
);
