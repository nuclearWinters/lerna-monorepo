import type { UUID } from "node:crypto";
import type { FintechUserMongo, InvestmentMongo, LoanMongo, ScheduledPaymentsMongo, TransactionMongo } from "@repo/mongo-utils";
import { addMonths, startOfMonth } from "date-fns";
import { MongoClient, ObjectId } from "mongodb";

MongoClient.connect("mongodb://localhost:27017?directConnection=true").then(async (client) => {
  const expiry = addMonths(new Date(), 3);
  const db = client.db("fintech");
  const loans = db.collection<LoanMongo>("loans");
  await loans.deleteMany({});
  const users = db.collection<FintechUserMongo>("users");
  await users.deleteMany({});
  const investments = db.collection<InvestmentMongo>("investments");
  await investments.deleteMany({});
  const transactions = db.collection<TransactionMongo>("transactions");
  const scheduledPayments = db.collection<ScheduledPaymentsMongo>("scheduledPayments");
  await transactions.deleteMany({});
  const _id_transaction_1 = new ObjectId();
  const _id_transaction_2 = new ObjectId();
  const _id_transaction_3 = new ObjectId();
  const _id_transaction_4 = new ObjectId();
  const _id_transaction_5 = new ObjectId();
  const _id_transaction_6 = new ObjectId();
  const _id_transaction_7 = new ObjectId();
  const now = new Date();
  const _id_investment_1 = new ObjectId();
  const user_id_one: UUID = "dab40bfd-b4a4-4874-8978-85f518a9aafb";
  const user_id_two: UUID = "9e60e466-70f2-4820-a8f3-604086b62ce2";
  const user_id_three: UUID = "83ae2e46-949a-4a3f-9a9a-9cd09b59fe47";
  await users.insertMany([
    {
      _id: new ObjectId(),
      id: user_id_one,
      account_available: 0,
      account_to_be_paid: 0,
      account_total: 0,
      account_withheld: 0,
    },
    {
      _id: new ObjectId(),
      id: user_id_two,
      account_available: 0,
      account_to_be_paid: 0,
      account_total: 0,
      account_withheld: 0,
    },
    {
      _id: new ObjectId(),
      id: user_id_three,
      account_available: 0,
      account_to_be_paid: 0,
      account_total: 0,
      account_withheld: 0,
    },
  ]);

  const loan_oid_one = new ObjectId();
  const loan_oid_two = new ObjectId();
  const loan_oid_three = new ObjectId();

  await loans.insertMany([
    {
      _id: new ObjectId(),
      user_id: user_id_two,
      score: "AAA",
      raised: 0,
      expiry,
      roi: 17,
      goal: 100_000_00,
      term: 9,
      status: "waiting for approval",
      pending: 100_000_00,
      payments_delayed: 0,
      payments_done: 0,
    },
    {
      _id: loan_oid_one,
      user_id: user_id_two,
      score: "AAA",
      raised: 95_000_00,
      expiry,
      roi: 17,
      goal: 100_000_00,
      term: 6,
      status: "financing",
      pending: 5_000_00,
      payments_delayed: 0,
      payments_done: 0,
    },
    {
      _id: new ObjectId(),
      user_id: user_id_two,
      score: "AAA",
      raised: 0,
      expiry,
      roi: 17,
      goal: 90_000_00,
      term: 8,
      status: "financing",
      pending: 90_000_00,
      payments_delayed: 0,
      payments_done: 0,
    },
    {
      _id: loan_oid_two,
      user_id: user_id_two,
      score: "AAA",
      raised: 100_000_00,
      expiry,
      roi: 17,
      goal: 100_000_00,
      term: 6,
      status: "paid",
      payments_delayed: 0,
      payments_done: 0,
      pending: 0,
    },
    {
      _id: new ObjectId(),
      user_id: user_id_two,
      score: "AAA",
      raised: 0,
      expiry,
      roi: 17,
      goal: 80_000_00,
      term: 7,
      status: "financing",
      pending: 80_000_00,
      payments_delayed: 0,
      payments_done: 0,
    },
    {
      _id: new ObjectId(),
      user_id: user_id_two,
      score: "AAA",
      raised: 0,
      expiry,
      roi: 17,
      goal: 70_000_00,
      term: 9,
      status: "financing",
      pending: 70_000_00,
      payments_delayed: 0,
      payments_done: 0,
    },
    {
      _id: new ObjectId(),
      user_id: user_id_two,
      score: "AAA",
      raised: 0,
      expiry,
      roi: 17,
      goal: 60_000_00,
      term: 6,
      status: "financing",
      pending: 60_000_00,
      payments_delayed: 0,
      payments_done: 0,
    },
    {
      _id: new ObjectId(),
      user_id: user_id_two,
      score: "AAA",
      raised: 0,
      expiry,
      roi: 17,
      goal: 50_000_00,
      term: 8,
      status: "financing",
      pending: 50_000_00,
      payments_delayed: 0,
      payments_done: 0,
    },
    {
      _id: loan_oid_three,
      user_id: user_id_two,
      score: "AAA",
      raised: 50_000_00,
      expiry,
      roi: 17,
      goal: 50_000_00,
      term: 5,
      status: "to be paid",
      pending: 0,
      payments_delayed: 0,
      payments_done: 0,
    },
  ]);

  await scheduledPayments.insertMany([
    {
      _id: new ObjectId(),
      loan_oid: loan_oid_three,
      scheduled_date: startOfMonth(addMonths(new Date(), 1)),
      amortize: 1039853,
      status: "to be paid",
    },
    {
      _id: new ObjectId(),
      loan_oid: loan_oid_three,
      scheduled_date: startOfMonth(addMonths(new Date(), 2)),
      amortize: 1039853,
      status: "to be paid",
    },
    {
      _id: new ObjectId(),
      loan_oid: loan_oid_three,
      scheduled_date: startOfMonth(addMonths(new Date(), 3)),
      amortize: 1039853,
      status: "to be paid",
    },
    {
      _id: new ObjectId(),
      loan_oid: loan_oid_three,
      scheduled_date: startOfMonth(addMonths(new Date(), 4)),
      amortize: 1039853,
      status: "to be paid",
    },
    {
      _id: new ObjectId(),
      loan_oid: loan_oid_three,
      scheduled_date: startOfMonth(addMonths(new Date(), 5)),
      amortize: 1039853,
      status: "to be paid",
    },
    {
      _id: new ObjectId(),
      loan_oid: loan_oid_two,
      scheduled_date: startOfMonth(addMonths(new Date(), -6)),
      amortize: 1744326,
      status: "paid",
    },
    {
      _id: new ObjectId(),
      loan_oid: loan_oid_two,
      scheduled_date: startOfMonth(addMonths(new Date(), -5)),
      amortize: 1744326,
      status: "paid",
    },
    {
      _id: new ObjectId(),
      loan_oid: loan_oid_two,
      scheduled_date: startOfMonth(addMonths(new Date(), -4)),
      amortize: 1744326,
      status: "paid",
    },
    {
      _id: new ObjectId(),
      loan_oid: loan_oid_two,
      scheduled_date: startOfMonth(addMonths(new Date(), -3)),
      amortize: 1744326,
      status: "paid",
    },
    {
      _id: new ObjectId(),
      loan_oid: loan_oid_two,
      scheduled_date: startOfMonth(addMonths(new Date(), -2)),
      amortize: 1744326,
      status: "paid",
    },
    {
      _id: new ObjectId(),
      loan_oid: loan_oid_two,
      scheduled_date: startOfMonth(addMonths(new Date(), -1)),
      amortize: 1744326,
      status: "paid",
    },
  ]);

  await investments.insertMany([
    {
      _id: _id_investment_1,
      borrower_id: user_id_two,
      lender_id: user_id_one,
      loan_oid: loan_oid_one,
      created_at: new Date(),
      quantity: 95_000_00,
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
      user_id: user_id_one,
      type: "invest",
      quantity: -50_000_00,
      created_at: now,
      borrower_id: "",
      loan_oid: new ObjectId(),
    },
    {
      _id: _id_transaction_2,
      user_id: user_id_one,
      type: "invest",
      quantity: -10_000_00,
      created_at: now,
      borrower_id: "",
      loan_oid: new ObjectId(),
    },
    {
      _id: _id_transaction_3,
      user_id: user_id_one,
      type: "invest",
      quantity: -10_000_00,
      created_at: now,
      borrower_id: "",
      loan_oid: new ObjectId(),
    },
    {
      _id: _id_transaction_4,
      user_id: user_id_one,
      type: "invest",
      quantity: -10_000_00,
      created_at: now,
      borrower_id: "",
      loan_oid: new ObjectId(),
    },
    {
      _id: _id_transaction_5,
      user_id: user_id_one,
      type: "invest",
      quantity: -5_000_00,
      created_at: now,
      borrower_id: "",
      loan_oid: new ObjectId(),
    },
    {
      _id: _id_transaction_6,
      user_id: user_id_one,
      type: "invest",
      quantity: -5_000_00,
      created_at: now,
      borrower_id: "",
      loan_oid: new ObjectId(),
    },
    {
      _id: _id_transaction_7,
      user_id: user_id_one,
      type: "invest",
      quantity: -5_000_00,
      created_at: now,
      borrower_id: "",
      loan_oid: new ObjectId(),
    },
  ]);
  process.exit();
});
