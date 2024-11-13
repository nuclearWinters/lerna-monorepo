import { MongoClient } from "mongodb";
import { createClient } from "redis";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { MONGO_DB, IS_PRODUCTION, REDIS, GRPC_AUTH } from "@repo/utils";
import { AuthService, AuthServer } from "@repo/grpc-utils";
import fs from "node:fs";
import { logErr } from "@repo/logs-utils";

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
    IS_PRODUCTION ? "0.0.0.0:443" : GRPC_AUTH,
    ServerCredentials.createSsl(
      fs.readFileSync("../../certs/minica.pem"),
      [
        {
          private_key: fs.readFileSync("../../certs/key.pem"),
          cert_chain: fs.readFileSync("../../certs/cert.pem"),
        },
      ],
      IS_PRODUCTION
    ),
    (err) => {
      if (err) {
        throw err;
      }
      return;
    }
  );
});
