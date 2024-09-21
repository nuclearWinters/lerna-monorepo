import { MongoClient } from "mongodb";
import { createClient } from "redis";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import {
  MONGO_DB,
  REDIS,
  GRPC_AUTH,
} from "@lerna-monorepo/backend-utilities/config";
import { AuthService } from "@lerna-monorepo/backend-utilities/protoAuth/auth_grpc_pb";
import { AuthServer } from "@lerna-monorepo/backend-utilities/grpc";
import fs from "fs";

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
    GRPC_AUTH,
    ServerCredentials.createSsl(null, [
      {
        private_key: fs.readFileSync("../../certs/localhost.key"),
        cert_chain: fs.readFileSync("../../certs/localhost.crt"),
      },
    ]),
    (err) => {
      if (err) {
        return;
      }
    }
  );
});
