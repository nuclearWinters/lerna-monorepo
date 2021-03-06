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
      accountAvailable: 0,
      investments: [
        {
          _id_loan: new ObjectId("609875a48f2814002aaefe25"),
          quantity: 5000000,
          term: 6,
          ROI: 17,
          payments: 0,
        },
        {
          _id_loan: new ObjectId("609875a48f2814002aaefe25"),
          quantity: 1000000,
          term: 6,
          ROI: 17,
          payments: 0,
        },
        {
          _id_loan: new ObjectId("609875a48f2814002aaefe25"),
          quantity: 1000000,
          term: 6,
          ROI: 17,
          payments: 0,
        },
        {
          _id_loan: new ObjectId("609875a48f2814002aaefe25"),
          quantity: 1000000,
          term: 6,
          ROI: 17,
          payments: 0,
        },
        {
          _id_loan: new ObjectId("609875a48f2814002aaefe25"),
          quantity: 500000,
          term: 6,
          ROI: 17,
          payments: 0,
        },
        {
          _id_loan: new ObjectId("609875a48f2814002aaefe25"),
          quantity: 500000,
          term: 6,
          ROI: 17,
          payments: 0,
        },
        {
          _id_loan: new ObjectId("609875a48f2814002aaefe25"),
          quantity: 500000,
          term: 6,
          ROI: 17,
          payments: 0,
        },
      ],
    },
    {
      _id: new ObjectId("6095f055f92be2001a15885b"),
      accountAvailable: 0,
      investments: [],
    },
    {
      _id: new ObjectId("6095f172f92be2001a15885c"),
      accountAvailable: 0,
      investments: [],
    },
  ]);

  await loans.insertMany([
    {
      _id: new ObjectId("609875a48f2814002aaefe24"),
      _id_user: new ObjectId("6095f055f92be2001a15885b"),
      score: "AAA",
      raised: 0,
      expiry,
      ROI: 17,
      goal: 10000000,
      term: 9,
      status: "waiting for approval",
      scheduledPayments: null,
      investors: [],
    },
    {
      _id: new ObjectId("609875a48f2814002aaefe25"),
      _id_user: new ObjectId("6095f055f92be2001a15885b"),
      score: "AAA",
      raised: 9500000,
      expiry,
      ROI: 17,
      goal: 10000000,
      term: 6,
      status: "financing",
      scheduledPayments: null,
      investors: [
        {
          _id_lender: new ObjectId("607bd608ef9719001cf38fd5"),
          quantity: 5000000,
        },
        {
          _id_lender: new ObjectId("607bd608ef9719001cf38fd5"),
          quantity: 1000000,
        },
        {
          _id_lender: new ObjectId("607bd608ef9719001cf38fd5"),
          quantity: 1000000,
        },
        {
          _id_lender: new ObjectId("607bd608ef9719001cf38fd5"),
          quantity: 1000000,
        },
        {
          _id_lender: new ObjectId("607bd608ef9719001cf38fd5"),
          quantity: 500000,
        },
        {
          _id_lender: new ObjectId("607bd608ef9719001cf38fd5"),
          quantity: 500000,
        },
        {
          _id_lender: new ObjectId("607bd608ef9719001cf38fd5"),
          quantity: 500000,
        },
      ],
    },
    {
      _id: new ObjectId("609875a48f2814002aaefe26"),
      _id_user: new ObjectId("6095f055f92be2001a15885b"),
      score: "AAA",
      raised: 0,
      expiry,
      ROI: 17,
      goal: 9000000,
      term: 8,
      status: "financing",
      scheduledPayments: null,
      investors: [],
    },
    {
      _id: new ObjectId("609875a48f2814002aaefe27"),
      _id_user: new ObjectId("6095f055f92be2001a15885b"),
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
      investors: [],
    },
    {
      _id: new ObjectId("609875a48f2814002aaefe31"),
      _id_user: new ObjectId("6095f055f92be2001a15885b"),
      score: "AAA",
      raised: 0,
      expiry,
      ROI: 17,
      goal: 8000000,
      term: 7,
      status: "financing",
      scheduledPayments: null,
      investors: [],
    },
    {
      _id: new ObjectId("609875a48f2814002aaefe28"),
      _id_user: new ObjectId("6095f055f92be2001a15885b"),
      score: "AAA",
      raised: 0,
      expiry,
      ROI: 17,
      goal: 7000000,
      term: 9,
      status: "financing",
      scheduledPayments: null,
      investors: [],
    },
    {
      _id: new ObjectId("609875a48f2814002aaefe29"),
      _id_user: new ObjectId("6095f055f92be2001a15885b"),
      score: "AAA",
      raised: 0,
      expiry,
      ROI: 17,
      goal: 6000000,
      term: 6,
      status: "financing",
      scheduledPayments: null,
      investors: [],
    },
    {
      _id: new ObjectId("609875a48f2814002aaefe30"),
      _id_user: new ObjectId("6095f055f92be2001a15885b"),
      score: "AAA",
      raised: 0,
      expiry,
      ROI: 17,
      goal: 5000000,
      term: 8,
      status: "financing",
      scheduledPayments: null,
      investors: [],
    },
    {
      _id: new ObjectId("609875a48f2814002aaefe32"),
      _id_user: new ObjectId("6095f055f92be2001a15885b"),
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
      investors: [],
    },
  ]);

  await investments.insertMany([
    {
      _id_borrower: new ObjectId("6095f055f92be2001a15885b"),
      _id_lender: new ObjectId("607bd608ef9719001cf38fd5"),
      _id_loan: new ObjectId("609875a48f2814002aaefe25"),
      created: new Date(),
      quantity: 9500000,
      updated: new Date(),
      status: "financing",
      ROI: 17,
      moratory: 0,
      payments: 0,
      term: 6,
    },
  ]);

  await transactions.insertMany([
    {
      _id: `607bd608ef9719001cf38fd5_${new Date().getTime()}`,
      _id_user: new ObjectId("607bd608ef9719001cf38fd5"),
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
      _id: `607bd608ef9719001cf38fd5_${addSeconds(new Date(), 1).getTime()}`,
      _id_user: new ObjectId("607bd608ef9719001cf38fd5"),
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
      _id: `607bd608ef9719001cf38fd5_${addSeconds(new Date(), 2).getTime()}`,
      _id_user: new ObjectId("607bd608ef9719001cf38fd5"),
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
