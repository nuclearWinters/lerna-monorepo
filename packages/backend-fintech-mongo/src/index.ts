import fs from "node:fs";
import type { ServerHttp2Session } from "node:http2";
import { credentials } from "@grpc/grpc-js";
import { AuthClient } from "@repo/grpc-utils";
import { logErr } from "@repo/logs-utils";
import { GRPC_AUTH, IS_PRODUCTION, KAFKA, KAFKA_ID, KAFKA_PASSWORD, KAFKA_USERNAME, MONGO_DB, REDIS } from "@repo/utils";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { Redis } from "ioredis";
import { Kafka, logLevel } from "kafkajs";
import { MongoClient } from "mongodb";
import { main } from "./app.ts";

const kafka = new Kafka({
  clientId: KAFKA_ID,
  brokers: [KAFKA],
  ssl: IS_PRODUCTION,
  sasl: IS_PRODUCTION
    ? {
        mechanism: "scram-sha-256",
        username: KAFKA_USERNAME,
        password: KAFKA_PASSWORD,
      }
    : undefined,
  logLevel: IS_PRODUCTION ? logLevel.ERROR : undefined,
});

const producer = kafka.producer();

const retryStrategy = (times: number) => {
  return Math.min(times * 50, 2_000);
};

const pubsub = new RedisPubSub({
  publisher: new Redis(REDIS, { retryStrategy }),
  subscriber: new Redis(REDIS, { retryStrategy }),
});

const getGRPCClient = () =>
  new Promise<AuthClient>((resolve, reject) => {
    const client = new AuthClient(
      GRPC_AUTH,
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
    client.waitForReady(Date.now() + 50_000, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(client);
      }
    });
  });

Promise.all([MongoClient.connect(MONGO_DB), getGRPCClient(), producer.connect()]).then(async ([mongoClient, grpcClient]) => {
  const db = mongoClient.db("fintech");
  const serverHTTP2 = await main(db, producer, grpcClient, pubsub);
  serverHTTP2.setTimeout(120_000);
  serverHTTP2.addListener("clientError", (err, socket) => {
    logErr({
      logGroupName: "backend-fintech-mongo",
      logStreamName: "serverClientError",
      message: `Reason: ${err.message}, error: ${err.stack}`,
    });
    socket.destroy(err);
  });
  serverHTTP2.addListener("stream", (stream) =>
    stream.addListener("error", (err) => {
      logErr({
        logGroupName: "backend-fintech-mongo",
        logStreamName: "serverStreamError",
        message: `Reason: ${err.message}, error: ${err.stack}`,
      });
      stream.destroy(err);
    }),
  );
  serverHTTP2.on("unknownProtocol", () => {
    logErr({
      logGroupName: "backend-fintech-mongo",
      logStreamName: "unknownProtocol",
      message: "unknownProtocol",
    });
  });
  serverHTTP2.addListener("sessionError", (err: Error, session: ServerHttp2Session) => {
    logErr({
      logGroupName: "backend-fintech-mongo",
      logStreamName: "serverSessionError",
      message: `Reason: ${err.message}, error: ${err.stack}`,
    });
    session.destroy(err);
  });
  serverHTTP2.addListener("session", (session) => {
    session.setTimeout(60_000, () => session.destroy(new Error("TIMEOUT")));
  });
  serverHTTP2.listen(4000);
});

process
  .on("unhandledRejection", async (reason) => {
    await logErr({
      logGroupName: "backend-fintech-mongo",
      logStreamName: "unhandledRejection",
      message: String(reason),
    });
    process.exit(1);
  })
  .on("uncaughtException", async (err) => {
    await logErr({
      logGroupName: "backend-fintech-mongo",
      logStreamName: "uncaughtException",
      message: `Message: ${err.message}, Stack: ${err.stack}`,
    });
    process.exit(1);
  });
