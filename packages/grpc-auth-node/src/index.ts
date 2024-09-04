import { MongoClient } from "mongodb";
import { createClient } from "redis";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { AuthService, AuthServer } from "@lerna-monorepo/backend-utilities";
import { MONGO_DB, REDIS } from "../../backend-utilities";

Promise.all([
  MongoClient.connect(MONGO_DB, {}),
  createClient({
    url: REDIS,
  }).connect(),
]).then(async ([mongoClient, redisClient]) => {
  const authdb = mongoClient.db("auth");
  const server = new Server();
  server.addService(AuthService, AuthServer(authdb, redisClient));
  server.bindAsync(
    "grpc-auth-node:1983",
    ServerCredentials.createInsecure(),
    (err) => {
      if (err) {
        return;
      }
    }
  );
});
