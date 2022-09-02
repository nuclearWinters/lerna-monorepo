import { app, schema } from "./app";
import { Db, MongoClient } from "mongodb";
import { MONGO_DB } from "./config";
import amqp from "amqplib";
import {
  ADD_LEND,
  InvestmentMongo,
  LoanMongo,
  TransactionMongo,
  UserMongo,
} from "./types";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { AuthService } from "./proto/auth_grpc_pb";
import { AuthServer } from "./grpc";
import { sendLend } from "./rabbitmq";
import { jwt } from "./utils";
import { useServer } from "graphql-ws/lib/use/ws";
import { WebSocketServer } from "ws";

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
  await ch.assertQueue(ADD_LEND);
  //Consume ADD_LEND
  ch.consume(ADD_LEND, (msg) => {
    if (msg !== null) {
      sendLend(msg, db, ch);
    }
  });
  app.locals.ch = ch;
  const serverExpress = app.listen(4000, () => {
    const wsServer = new WebSocketServer({
      server: serverExpress,
      path: "/graphql",
    });
    useServer(
      {
        schema,
        context: (ctx) => {
          const decoded = jwt.decode(
            (ctx?.connectionParams?.Authorization as string | undefined) || ""
          );
          return {
            users: db.collection<UserMongo>("users"),
            loans: db.collection<LoanMongo>("loans"),
            investments: db.collection<InvestmentMongo>("investments"),
            transactions: db.collection<TransactionMongo>("transactions"),
            id: decoded && typeof decoded !== "string" ? decoded.id : "",
            isBorrower:
              decoded && typeof decoded !== "string" ? decoded.isBorrower : "",
            isLender:
              decoded && typeof decoded !== "string" ? decoded.isLender : "",
            isSupport:
              decoded && typeof decoded !== "string" ? decoded.isSupport : "",
          };
        },
      },
      wsServer
    );
  });
  const serverGRPC = new Server();
  serverGRPC.addService(AuthService, AuthServer);
  serverGRPC.bindAsync(
    "backend-courses:1983",
    ServerCredentials.createInsecure(),
    (err) => {
      if (err) {
        throw err;
      }
      serverGRPC.start();
    }
  );
});
