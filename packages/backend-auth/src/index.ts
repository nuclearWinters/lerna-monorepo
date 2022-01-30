import { app } from "./app";
import { MongoClient, Db } from "mongodb";
import { MONGO_DB } from "./config";
import { createClient } from "redis";
import amqp from "amqplib";
import { RedisClientType, SIGN_UP } from "./types";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { AuthServer } from "./grpc";
import { AuthService } from "./proto/auth_grpc_pb";
import { REDIS } from "./config";

export const ctx: {
  rdb?: RedisClientType;
  db?: Db;
} = {
  rdb: undefined,
  db: undefined,
};

MongoClient.connect(MONGO_DB, {}).then(async (client) => {
  const redisClient = createClient({
    url: REDIS,
  });
  await redisClient.connect();
  const db = client.db("auth");
  app.locals.db = db;
  app.locals.rdb = redisClient;
  ctx.rdb = redisClient;
  ctx.db = db;
  const conn = await amqp.connect("amqp://rabbitmq:5672");
  const ch = await conn.createChannel();
  await ch.assertQueue(SIGN_UP);
  app.locals.ch = ch;
  app.listen(process.env.PORT || 4002);
  const server = new Server();
  server.addService(AuthService, AuthServer);
  server.bindAsync(
    "backend-auth:1983",
    ServerCredentials.createInsecure(),
    (err) => {
      if (err) {
        throw err;
      }
      server.start();
    }
  );
});
