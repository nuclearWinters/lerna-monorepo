import { MongoClient, Db } from "mongodb";
import { MONGO_DB } from "./config";
import { createClient } from "redis";
import { RedisClientType } from "./types";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { AuthServer } from "./grpc";
import { AuthService } from "./proto/auth_grpc_pb";
import { REDIS } from "./config";
import { main } from "./app";

export const ctx: {
  rdb?: RedisClientType;
  authdb?: Db;
} = {
  rdb: undefined,
  authdb: undefined,
};

MongoClient.connect(MONGO_DB, {}).then(async (client) => {
  const redisClient = createClient({
    url: REDIS,
  });
  await redisClient.connect();
  const authdb = client.db("auth");
  ctx.rdb = redisClient;
  ctx.authdb = authdb;
  const serverHTTP2 = await main(authdb, redisClient);
  serverHTTP2.listen(process.env.PORT || 4002);
  const server = new Server();
  server.addService(AuthService, AuthServer);
  server.bindAsync(
    "backend-auth-node:1983",
    ServerCredentials.createInsecure(),
    (err) => {
      if (err) {
        return;
      }
      server.start();
    }
  );
});
