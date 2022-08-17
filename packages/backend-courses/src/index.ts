import { app } from "./app";
import //TRANSACTION,
//LOAN,
//INVESTMENT,
//pubsub,
//USER,
"./subscriptions/subscriptions";
import { Db, MongoClient } from "mongodb";
import { MONGO_DB } from "./config";
import amqp from "amqplib";
import {
  //LoanMongo,
  SIGN_UP,
  //InvestmentMongo,
  //BucketTransactionMongo,
  //UserMongo,
  //INITIAL_TRANSACTION_RECEIVE_FUND,
} from "./types";
//import { base64 } from "./utils";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { AuthService } from "./proto/auth_grpc_pb";
import { AuthServer } from "./grpc";

export const ctx: {
  db?: Db;
} = {
  db: undefined,
};

MongoClient.connect(MONGO_DB, {}).then(async (client) => {
  const db = client.db("fintech");
  app.locals.db = db;
  ctx.db = db;
  const conn = await amqp.connect("amqp://rabbitmq:5672");
  const ch = await conn.createChannel();
  await ch.assertQueue(SIGN_UP);
  //const options = { fullDocument: "updateLookup" };
  /*const usersStream = db.collection<UserMongo>("users").watch([], options);
  usersStream.on("change", (event) => {
    if (["update"].includes(event.operationType)) {
      const fullDocument = event.fullDocument;
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
      const fullDocument = event.fullDocument;
      if (fullDocument) {
        pubsub.publish(LOAN, {
          loans_subscribe: {
            loan_edge: {
              node: fullDocument,
              cursor: base64(fullDocument._id?.toHexString() || ""),
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
      const fullDocument = event.fullDocument;
      if (fullDocument) {
        pubsub.publish(INVESTMENT, {
          investments_subscribe: {
            investment_edge: {
              node: fullDocument,
              cursor: base64(fullDocument._id?.toHexString() || ""),
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
      const fullDocument = event.fullDocument;
      if (fullDocument) {
        pubsub.publish(TRANSACTION, {
          transactions_subscribe: {
            transaction_edge: {
              node: fullDocument,
              cursor: base64(fullDocument._id || ""),
            },
            type: event.operationType,
          },
        });
      }
    }
  });*/
  //ch.sendToQueue(INITIAL_TRANSACTION_RECEIVE_FUND, Buffer.from(message));
  //Add funds and retire funds transactions
  //Lend/Borrow transactions
  //
  //Add transactions in rabbit mq?
  app.locals.ch = ch;
  app.listen(4000);
  const server = new Server();
  server.addService(AuthService, AuthServer);
  server.bindAsync(
    "backend-courses:1983",
    ServerCredentials.createInsecure(),
    (err) => {
      if (err) {
        throw err;
      }
      server.start();
    }
  );
});
