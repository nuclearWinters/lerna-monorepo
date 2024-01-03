import { app, schema } from "./app";
import { MongoClient } from "mongodb";
import { MONGO_DB } from "./config";
import {
  InvestmentMongo,
  LoanMongo,
  ScheduledPaymentsMongo,
  TransactionMongo,
  UserMongo,
} from "./types";
import { jwt } from "./utils";
import { useServer } from "graphql-ws/lib/use/ws";
import { WebSocketServer } from "ws";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { AuthServer } from "./grpc";
import { AuthService } from "./proto/auth_grpc_pb";
import { checkEveryDay, checkEveryMonth } from "./cronJobs";
import { dayFunction } from "./cronJobDay";
import { monthFunction } from "./cronJobMonth";
import { runKafkaConsumer } from "./kafka";
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["kafka:9092"],
});

const producer = kafka.producer();

MongoClient.connect(MONGO_DB, {}).then(async (client) => {
  const db = client.db("fintech");
  const authdb = client.db("auth");
  const consumer = kafka.consumer({ groupId: "test-group" });
  const loans = db.collection<LoanMongo>("loans");
  const investments = db.collection<InvestmentMongo>("investments");
  const transactions = db.collection<TransactionMongo>("transactions");
  const users = db.collection<UserMongo>("users");
  const scheduledPayments =
    db.collection<ScheduledPaymentsMongo>("scheduledPayments");
  app.locals.db = db;
  app.locals.authdb = authdb;
  app.locals.producer = producer;
  await producer.connect();
  checkEveryDay(() => dayFunction(db, producer));
  checkEveryMonth(() => monthFunction(db, producer));
  runKafkaConsumer(
    consumer,
    producer,
    loans,
    users,
    transactions,
    scheduledPayments,
    investments
  );
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
            users,
            loans,
            investments,
            transactions,
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
  const server = new Server();
  server.addService(AuthService, AuthServer(users));
  server.bindAsync(
    "backend-auth:1984",
    ServerCredentials.createInsecure(),
    (err) => {
      if (err) {
        return;
      }
      server.start();
    }
  );
});
