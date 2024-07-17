import { main } from "./app";
import { MongoClient } from "mongodb";
import { MONGO_DB } from "./config";
import { UserMongo } from "./types";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { AuthServer } from "./grpc";
import { AuthService } from "./proto/auth_grpc_pb";
import { checkEveryDay, checkEveryMonth } from "./cronJobs";
import { dayFunction } from "./cronJobDay";
import { monthFunction } from "./cronJobMonth";
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["kafka:9092"],
});

const producer = kafka.producer();

MongoClient.connect(MONGO_DB, {}).then(async (client) => {
  const db = client.db("fintech");
  const users = db.collection<UserMongo>("users");
  await producer.connect();
  checkEveryDay(() => dayFunction(db, producer));
  checkEveryMonth(() => monthFunction(db, producer));
  const serverHTTP2 = await main(db, producer);
  serverHTTP2.listen(4000);
  const server = new Server();
  server.addService(AuthService, AuthServer(users));
  server.bindAsync(
    "backend-auth-node:1984",
    ServerCredentials.createInsecure(),
    (err) => {
      if (err) {
        return;
      }
      server.start();
    }
  );
});
