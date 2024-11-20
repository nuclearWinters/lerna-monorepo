import fs from "node:fs";
import type { ServerHttp2Session } from "node:http2";
import { credentials } from "@grpc/grpc-js";
import { AccountClient } from "@repo/grpc-utils";
import { logErr } from "@repo/logs-utils";
import { GRPC_FINTECH, IS_PRODUCTION, MONGO_DB, REDIS } from "@repo/utils";
import { MongoClient } from "mongodb";
import { createClient } from "redis";
import { main } from "./app.ts";

const getGRPCClient = () =>
  new Promise<AccountClient>((resolve, reject) => {
    const client = new AccountClient(
      "localhost:4001",
      credentials.createSsl(
        fs.readFileSync("../../certs/minica.pem"),
        fs.readFileSync("../../certs/key.pem"),
        fs.readFileSync("../../certs/cert.pem"),
        IS_PRODUCTION
          ? undefined
          : {
              checkServerIdentity: () => undefined,
            },
      ),
    );
    client.waitForReady(Date.now() + 20_000, (err) => {
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
  redisClient.on("error", (err) => {
    logErr({
      logGroupName: "backend-auth-node",
      logStreamName: "redisClientError",
      message: String(err),
    });
  });
  const authdb = mongoClient.db("auth");
  const serverHTTP2 = await main(authdb, redisClient, grpcClient);
  serverHTTP2.setTimeout(120_000);
  serverHTTP2.addListener("clientError", (err, socket) => {
    logErr({
      logGroupName: "backend-auth-node",
      logStreamName: "serverClientError",
      message: `Reason: ${err.message}, error: ${err.stack}`,
    });
    socket.destroy(err);
  });
  serverHTTP2.addListener("stream", (stream) =>
    stream.addListener("error", (err) => {
      logErr({
        logGroupName: "backend-auth-node",
        logStreamName: "serverStreamError",
        message: `Reason: ${err.message}, error: ${err.stack}`,
      });
      stream.destroy(err);
    }),
  );
  serverHTTP2.on("unknownProtocol", () => {
    logErr({
      logGroupName: "backend-auth-node",
      logStreamName: "unknownProtocol",
      message: "unknownProtocol",
    });
  });
  serverHTTP2.addListener("sessionError", (err: Error, session: ServerHttp2Session) => {
    logErr({
      logGroupName: "backend-auth-node",
      logStreamName: "serverSessionError",
      message: `Reason: ${err.message}, error: ${err.stack}`,
    });
    session.destroy(err);
  });
  serverHTTP2.addListener("session", (session) => {
    session.setTimeout(60_000, () => session.destroy(new Error("TIMEOUT")));
  });
  serverHTTP2.listen(4002);
});

process
  .on("unhandledRejection", async (reason) => {
    await logErr({
      logGroupName: "backend-auth-node",
      logStreamName: "unhandledRejection",
      message: String(reason),
    });
    process.exit(1);
  })
  .on("uncaughtException", async (err) => {
    await logErr({
      logGroupName: "backend-auth-node",
      logStreamName: "uncaughtException",
      message: `Message: ${err.message}, Stack: ${err.stack}`,
    });
    process.exit(1);
  });
