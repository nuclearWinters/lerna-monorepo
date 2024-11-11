import { MongoClient } from "mongodb";
import { createClient } from "redis";
import { main } from "./app.ts";
import { REDIS, MONGO_DB, GRPC_FINTECH, IS_PRODUCTION } from "@repo/utils";
import { credentials } from "@grpc/grpc-js";
import { AccountClient } from "@repo/grpc-utils";
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
    const now = new Date().toISOString();
    fs.writeFileSync(`redisClientError${now}.txt`, `${String(error)}`);
  });
  const authdb = mongoClient.db("auth");
  const serverHTTP2 = await main(authdb, redisClient, grpcClient);
  serverHTTP2.on("unknownProtocol", () => {
    const now = new Date().toISOString();
    fs.writeFileSync(`unknownProtocol${now}.txt`, `Time: ${now}`);
  });
  serverHTTP2.listen(443);
});

process
  .on("unhandledRejection", (reason) => {
    const now = new Date().toISOString();
    fs.writeFileSync(
      `unhandledRejectionLogs${now}.txt`,
      `Time: ${now}, Reason: ${String(reason)}`
    );
    process.exit(1);
  })
  .on("uncaughtException", (err) => {
    console.log(err);
    const now = new Date().toISOString();
    if (err.message === "read ECONNRESET") {
      fs.writeFileSync(
        `ECONNRESET${now}.txt`,
        `Time: ${now}, Reason: ${err.message}, error: ${err.stack}`
      );
      return;
    }
    if (
      err.message.includes(
        "routines:ssl3_read_bytes:sslv3 alert bad certificate"
      )
    ) {
      fs.writeFileSync(
        `BADCERT${now}.txt`,
        `Time: ${now}, Reason: ${err.message}`
      );
      return;
    }
    fs.writeFileSync(
      `uncaughtExceptionLogs${now}.txt`,
      `Time: ${now}, Name: ${err.name}, Message: ${err.message}, Stack: ${err.stack}`
    );
    process.exit(1);
  });
