import { MongoClient } from "mongodb";
import { createClient } from "redis";
import { main } from "./app";
import {
  REDIS,
  MONGO_DB,
  GRPC_FINTECH,
  IS_PRODUCTION,
} from "@lerna-monorepo/backend-utilities/config";
import { credentials } from "@grpc/grpc-js";
import { AccountClient } from "@lerna-monorepo/backend-utilities/protoAccount/account_grpc_pb";
import fs from "node:fs";

const getGRPCClient = () =>
  new Promise<AccountClient>((resolve, reject) => {
    const client = new AccountClient(
      GRPC_FINTECH,
      credentials.createSsl(
        fs.readFileSync("../../certs/minica.pem"),
        fs.readFileSync("../../certs/key.pem"),
        fs.readFileSync("../../certs/cert.pem"),
        IS_PRODUCTION
          ? undefined
          : {
              checkServerIdentity: () => undefined,
            }
      )
    );
    client.waitForReady(Date.now() + 5000, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(client);
      }
    });
  });

Promise.all([
  MongoClient.connect(MONGO_DB),
  createClient({
    url: REDIS,
  }).connect(),
  getGRPCClient(),
]).then(async ([mongoClient, redisClient, grpcClient]) => {
  redisClient.on("error", (error) => {
    fs.writeFileSync("redisClientError.txt", `${String(error)}`);
  });
  const authdb = mongoClient.db("auth");
  const serverHTTP2 = await main(authdb, redisClient, grpcClient);
  serverHTTP2.on("unknownProtocol", () => {
    fs.writeFileSync("unknownProtocol.txt", `unknownProtocol`);
  });
  serverHTTP2.listen(443);
});

process
  .on("unhandledRejection", (reason) => {
    fs.writeFileSync("unhandledRejectionLogs.txt", `${String(reason)}`);
    process.exit(1);
  })
  .on("uncaughtException", (err) => {
    if (err.message === "read ECONNRESET") return;
    fs.writeFileSync(
      "uncaughtExceptionLogs.txt",
      `Name: ${err.name}, Message: ${err.message}, Stack: ${err.stack}`
    );
    process.exit(1);
  });
