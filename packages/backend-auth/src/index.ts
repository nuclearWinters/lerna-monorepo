import { app } from "./app";
import { MongoClient, Db } from "mongodb";
import { MONGO_DB } from "./config";
import redis from "redis";
import { promisify } from "util";
//import amqp from "amqplib";
import { RedisPromises } from "./types";
//import { channelConsume } from "./utils";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { AuthServer } from "./grpc";
import { AuthService } from "./proto/auth_grpc_pb";

export const ctx: {
  rdb?: RedisPromises;
  db?: Db;
} = {
  rdb: undefined,
  db: undefined,
};

MongoClient.connect(MONGO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async (client) => {
  const redisClient = redis.createClient({
    port: 6379,
    host: "redis-auth",
  });
  const rdb = {
    get: promisify(redisClient.get).bind(redisClient),
    set: promisify(redisClient.set).bind(redisClient),
    keys: promisify(redisClient.keys).bind(redisClient),
  };
  const db = client.db("auth");
  app.locals.db = db;
  app.locals.rdb = rdb;
  ctx.rdb = rdb;
  ctx.db = db;
  //const conn = await amqp.connect("amqp://rabbitmq:15672");
  //const ch = await conn.createChannel();
  //await ch.assertQueue(RENEW_ACCESS_TOKEN);
  //channelConsume(ch);
  //app.locals.ch = ch;
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
