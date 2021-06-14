import { app, schema } from "./app";
import {
  TRANSACTION,
  LOAN,
  INVESTMENT,
  pubsub,
  USER,
} from "./subscriptions/subscriptions";
import { MongoClient, ObjectId, ChangeEventCR } from "mongodb";
import { MONGO_DB } from "./config";
import amqp from "amqplib";
import {
  LoanMongo,
  SIGN_UP,
  InvestmentMongo,
  BucketTransactionMongo,
  UserMongo,
} from "./types";
import { useServer } from "graphql-ws/lib/use/ws";
import ws from "ws";
import { base64 } from "./utils";

MongoClient.connect(MONGO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async (client) => {
  const db = client.db("fintech");
  app.locals.db = db;
  const conn = await amqp.connect("amqp://rabbitmq:5672");
  const ch = await conn.createChannel();
  await ch.assertQueue(SIGN_UP);
  const options = { fullDocument: "updateLookup" as const };
  const usersStream = db.collection<UserMongo>("users").watch([], options);
  usersStream.on("change", (event) => {
    if (["update"].includes(event.operationType)) {
      const fullDocument = (event as ChangeEventCR<UserMongo>).fullDocument;
      if (fullDocument) {
        pubsub.publish(USER, {
          user_subscribe: {
            user: fullDocument,
          },
        });
      }
    }
  });
  const loansStream = db.collection<LoanMongo>("loans").watch([], options);
  loansStream.on("change", (event) => {
    if (["insert", "update"].includes(event.operationType)) {
      const fullDocument = (event as ChangeEventCR<LoanMongo>).fullDocument;
      if (fullDocument) {
        pubsub.publish(LOAN, {
          loans_subscribe: {
            loan_edge: {
              node: fullDocument,
              cursor: base64(fullDocument._id.toHexString()),
            },
            type: event.operationType,
          },
        });
      }
    }
  });
  const investmentsStream = db
    .collection<InvestmentMongo>("investments")
    .watch([], options);
  investmentsStream.on("change", (event) => {
    if (["insert", "update"].includes(event.operationType)) {
      const fullDocument = (event as ChangeEventCR<InvestmentMongo>)
        .fullDocument;
      if (fullDocument) {
        pubsub.publish(INVESTMENT, {
          investments_subscribe: {
            investment_edge: {
              node: fullDocument,
              cursor: base64(fullDocument._id.toHexString()),
            },
            type: event.operationType,
          },
        });
      }
    }
  });
  const transactionsStream = db
    .collection<BucketTransactionMongo>("transactions")
    .watch([], options);
  transactionsStream.on("change", (event) => {
    if (["insert", "update"].includes(event.operationType)) {
      const fullDocument = (event as ChangeEventCR<BucketTransactionMongo>)
        .fullDocument;
      if (fullDocument) {
        pubsub.publish(TRANSACTION, {
          transactions_subscribe: {
            transaction_edge: {
              node: fullDocument,
              cursor: base64(fullDocument._id),
            },
            type: event.operationType,
          },
        });
      }
    }
  });
  ch.consume(SIGN_UP, (msg) => {
    if (msg !== null) {
      db.collection<UserMongo>("users").insertOne({
        _id: new ObjectId(msg.content.toString()),
        investments: [],
        accountAvailable: 0,
      });
      ch.ack(msg);
    }
  });
  app.locals.ch = ch;
  const server = app.listen(4000, () => {
    const wsServer = new ws.Server({
      server,
      path: "/api/graphql",
    });
    useServer({ schema }, wsServer);
  });
});
