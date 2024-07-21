import { MongoClient } from "mongodb";
import { MONGO_DB } from "./config";
import { createClient } from "redis";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { AuthServer } from "./grpc";
import { AuthService } from "./proto/auth_grpc_pb";
import { REDIS } from "./config";

Promise.all([
  MongoClient.connect(MONGO_DB, {}),
  createClient({
    url: REDIS,
  }).connect()
]).then(async ([mongoClient, redisClient]) => {
  const authdb = mongoClient.db("auth");
  const server = new Server();
  server.addService(AuthService, AuthServer(authdb, redisClient));
  server.bindAsync(
    "backend-auth-node:1983",
    ServerCredentials.createInsecure(),
    (err) => {
      if (err) {
        return;
      }
    }
  );
})
