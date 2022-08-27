import { app } from "./app";
import { Db, MongoClient } from "mongodb";
import { MONGO_DB } from "./config";
import amqp from "amqplib";
import { SIGN_UP } from "./types";
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
