import fs from "node:fs";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { AuthServer, AuthService } from "@repo/grpc-utils";
import { logErr } from "@repo/logs-utils";
import { GRPC_AUTH, IS_PRODUCTION, MONGO_DB, REDIS } from "@repo/utils";
import { MongoClient } from "mongodb";
import { createClient } from "redis";

Promise.all([
  MongoClient.connect(MONGO_DB),
  createClient({
    url: REDIS,
  }).connect(),
]).then(async ([mongoClient, redisClient]) => {
  redisClient.on("error", (err) => {
    logErr({
      logGroupName: "grpc-auth-node",
      logStreamName: "redisClientError",
      message: String(err),
    });
  });
  const authdb = mongoClient.db("auth");
  const server = new Server();
  server.addService(AuthService, AuthServer(authdb, redisClient));
  server.bindAsync(
    IS_PRODUCTION ? "localhost:4003" : GRPC_AUTH,
    ServerCredentials.createSsl(
      fs.readFileSync("../../certs/minica.pem"),
      [
        {
          private_key: fs.readFileSync("../../certs/key.pem"),
          cert_chain: fs.readFileSync("../../certs/cert.pem"),
        },
      ],
      IS_PRODUCTION,
    ),
    (err) => {
      if (err) {
        throw err;
      }
      return;
    },
  );
});
