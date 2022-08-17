import { MongoClient, ObjectId } from "mongodb";
import {
  BucketTransactionMongo,
  InvestmentMongo,
  LoanMongo,
  UserMongo,
} from "./types";
import { startOfMonth, addMonths, addSeconds } from "date-fns";

MongoClient.connect("mongodb://localhost:27017", {}).then(async (client) => {
  const expiry = addMonths(new Date(), 3);
  const db = client.db("fintech");
  const loans = db.collection<LoanMongo>("loans");
  await loans.deleteMany({});
  const users = db.collection<UserMongo>("users");
  await users.deleteMany({});
  const investments = db.collection<InvestmentMongo>("investments");
  await investments.deleteMany({});
  const transactions = db.collection<BucketTransactionMongo>("transactions");
  await transactions.deleteMany({});
  await users.insertMany([
    {
      _id: new ObjectId("607bd608ef9719001cf38fd5"),
      id: "wHHR1SUBT0dspoF4YUOw1",
      accountAvailable: 0,
      accountInterests: 0,
      accountLent: 0,
    },
    {
      _id: new ObjectId("6095f055f92be2001a15885b"),
      id: "wHHR1SUBT0dspoF4YUOw2",
      accountAvailable: 0,
      accountInterests: 0,
      accountLent: 0,
    },
    {
      _id: new ObjectId("6095f172f92be2001a15885c"),
      id: "wHHR1SUBT0dspoF4YUOw3",
      accountAvailable: 0,
      accountInterests: 0,
      accountLent: 0,
    },
  ]);

  await loans.insertMany([
    {
      _id: new ObjectId("609875a48f2814002aaefe24"),
      id_user: "wHHR1SUBT0dspoF4YUOw2",
      score: "AAA",
      raised: 0,
      expiry,
      ROI: 17,
      goal: 10000000,
      term: 9,
      status: "waiting for approval",
      scheduledPayments: null,
      pending: 0,
    },
    {
      _id: new ObjectId("609875a48f2814002aaefe25"),
      id_user: "wHHR1SUBT0dspoF4YUOw2",
      score: "AAA",
      raised: 9500000,
      expiry,
      ROI: 17,
      goal: 10000000,
      term: 6,
      status: "financing",
      scheduledPayments: null,
      pending: 0,
    },
    {
      _id: new ObjectId("609875a48f2814002aaefe26"),
      id_user: "wHHR1SUBT0dspoF4YUOw2",
      score: "AAA",
      raised: 0,
      expiry,
      ROI: 17,
      goal: 9000000,
      term: 8,
      status: "financing",
      scheduledPayments: null,
      pending: 0,
    },
    {
      _id: new ObjectId("609875a48f2814002aaefe27"),
      id_user: "wHHR1SUBT0dspoF4YUOw2",
      score: "AAA",
      raised: 10000000,
      expiry,
      ROI: 17,
      goal: 10000000,
      term: 6,
      status: "paid",
      scheduledPayments: [
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
      ],
      pending: 0,
    },
    {
      _id: new ObjectId("609875a48f2814002aaefe31"),
      id_user: "wHHR1SUBT0dspoF4YUOw2",
      score: "AAA",
      raised: 0,
      expiry,
      ROI: 17,
      goal: 8000000,
      term: 7,
      status: "financing",
      scheduledPayments: null,
      pending: 0,
    },
    {
      _id: new ObjectId("609875a48f2814002aaefe28"),
      id_user: "wHHR1SUBT0dspoF4YUOw2",
      score: "AAA",
      raised: 0,
      expiry,
      ROI: 17,
      goal: 7000000,
      term: 9,
      status: "financing",
      scheduledPayments: null,
      pending: 0,
    },
    {
      _id: new ObjectId("609875a48f2814002aaefe29"),
      id_user: "wHHR1SUBT0dspoF4YUOw2",
      score: "AAA",
      raised: 0,
      expiry,
      ROI: 17,
      goal: 6000000,
      term: 6,
      status: "financing",
      scheduledPayments: null,
      pending: 0,
    },
    {
      _id: new ObjectId("609875a48f2814002aaefe30"),
      id_user: "wHHR1SUBT0dspoF4YUOw2",
      score: "AAA",
      raised: 0,
      expiry,
      ROI: 17,
      goal: 5000000,
      term: 8,
      status: "financing",
      scheduledPayments: null,
      pending: 0,
    },
    {
      _id: new ObjectId("609875a48f2814002aaefe32"),
      id_user: "wHHR1SUBT0dspoF4YUOw2",
      score: "AAA",
      raised: 5000000,
      expiry,
      ROI: 17,
      goal: 5000000,
      term: 5,
      status: "to be paid",
      scheduledPayments: [
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
      ],
      pending: 0,
    },
  ]);

  await investments.insertMany([
    {
      id_borrower: "wHHR1SUBT0dspoF4YUOw2",
      id_lender: "wHHR1SUBT0dspoF4YUOw1",
      _id_loan: new ObjectId("609875a48f2814002aaefe25"),
      created: new Date(),
      quantity: 9500000,
      updated: new Date(),
      status: "financing",
      ROI: 17,
      moratory: 0,
      payments: 0,
      term: 6,
      interest_to_earn: 0,
      still_invested: 0,
      paid_already: 0,
      amortize: 0,
    },
  ]);

  await transactions.insertMany([
    {
      _id: `wHHR1SUBT0dspoF4YUOw1_${new Date().getTime()}`,
      id_user: "wHHR1SUBT0dspoF4YUOw1",
      count: 1,
      history: [
        {
          _id: new ObjectId("609de4f0df540d019218f248"),
          type: "invest",
          quantity: -5000000,
          created: new Date(),
        },
      ],
    },
    {
      _id: `wHHR1SUBT0dspoF4YUOw1_${addSeconds(new Date(), 1).getTime()}`,
      id_user: "wHHR1SUBT0dspoF4YUOw1",
      count: 5,
      history: [
        {
          _id: new ObjectId(),
          type: "invest",
          quantity: -1000000,
          created: new Date(),
        },
        {
          _id: new ObjectId(),
          type: "invest",
          quantity: -1000000,
          created: new Date(),
        },
        {
          _id: new ObjectId(),
          type: "invest",
          quantity: -1000000,
          created: new Date(),
        },
        {
          _id: new ObjectId(),
          type: "invest",
          quantity: -500000,
          created: new Date(),
        },
        {
          _id: new ObjectId(),
          type: "invest",
          quantity: -500000,
          created: new Date(),
        },
      ],
    },
    {
      _id: `wHHR1SUBT0dspoF4YUOw1_${addSeconds(new Date(), 2).getTime()}`,
      id_user: "wHHR1SUBT0dspoF4YUOw1",
      count: 1,
      history: [
        {
          _id: new ObjectId(),
          type: "invest",
          quantity: -500000,
          created: new Date(),
        },
      ],
    },
  ]);
  process.exit();
});
