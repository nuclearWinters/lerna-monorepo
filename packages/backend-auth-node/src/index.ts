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
    client.waitForReady(Date.now() + 50_000, (err) => {
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
  serverHTTP2.setTimeout(120_000);
  serverHTTP2.addListener("clientError", (err, socket) => {
    const now = new Date().toISOString();
    fs.writeFileSync(
      `clientError${now}.txt`,
      `Time: ${now}, Reason: ${err.message}, error: ${err.stack}`
    );
    socket.destroy(err);
  });
  serverHTTP2.addListener("stream", (stream) =>
    stream.addListener("error", (err) => {
      const now = new Date().toISOString();
      fs.writeFileSync(
        `streamError${now}.txt`,
        `Time: ${now}, Reason: ${err.message}, error: ${err.stack}`
      );
      stream.destroy(err);
    })
  );
  serverHTTP2.on("unknownProtocol", () => {
    const now = new Date().toISOString();
    fs.writeFileSync(`unknownProtocol${now}.txt`, `Time: ${now}`);
  });
  serverHTTP2.addListener("sessionError", (err) => {
    const now = new Date().toISOString();
    fs.writeFileSync(
      `sessionError${now}.txt`,
      `Time: ${now}, Reason: ${err.message}, error: ${err.stack}`
    );
  });
  serverHTTP2.addListener("session", (session) => {
    session.setTimeout(60_000, () => session.destroy(new Error("TIMEOUT")));
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
    fs.writeFileSync(
      `uncaughtExceptionLogs${now}.txt`,
      `Time: ${now}, Name: ${err.name}, Message: ${err.message}, Stack: ${err.stack}`
    );
    process.exit(1);
  });
