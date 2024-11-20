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
        mechanism: "plain",
        username: KAFKA_USERNAME,
        password: KAFKA_PASSWORD,
      }
    : undefined,
  logLevel: IS_PRODUCTION ? logLevel.ERROR : undefined,
  connectionTimeout: 30_000,
  authenticationTimeout: 30_000,
  requestTimeout: 30_000,
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
    client.waitForReady(Date.now() + 20_000, (err) => {
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
  return new Promise((resolve, reject) => {
    serverHTTP2.listen(4000, () => {
      serverHTTP2.removeListener("error", reject);
      // @ts-ignore
      serverHTTP2.setTimeout(120_000, (socket) => {
        if (!socket) {
          logErr({
            logGroupName: "backend-fintech-mongo",
            logStreamName: "socketTimedOut",
            message: "HTTP2 socket (unknown) timed out.",
          });
          return;
        }
        const identity = `${socket.remoteFamily}:${socket.remoteAddress}:${socket.remotePort}`;
        logErr({
          logGroupName: "backend-fintech-mongo",
          logStreamName: "socketTimeout",
          message: `HTTP2 socket ${identity} timed out.`,
        });
        socket.destroy(new Error("SOCKET_TIMEOUT"));
      });
      serverHTTP2.addListener("error", (err) => {
        logErr({
          logGroupName: "backend-fintech-mongo",
          logStreamName: "serverError",
          message: `HTTP/2 server error, ${String(err)}.`,
        });
      });
      serverHTTP2.addListener("clientError", (err, socket) => {
        if (!socket.destroyed) socket.destroy(err);
        if (err?.message === "ECONNRESET") {
          logErr({
            logGroupName: "backend-fintech-mongo",
            logStreamName: "clientErrorEconnreset",
            message: "HTTP/2 client connection reset.",
          });
          return;
        }
        logErr({
          logGroupName: "backend-fintech-mongo",
          logStreamName: "clientError",
          message: `HTTP/2 client error, ${String(err)}.`,
        });
      });
      // @ts-ignore
      serverHTTP2.addListener("sessionError", (err, session) => {
        if (!session.destroyed) session.destroy(err);
        if (err?.message === "ECONNRESET") {
          logErr({
            logGroupName: "backend-fintech-mongo",
            logStreamName: "sessionError",
            message: "HTTP/2 client connection reset.",
          });
          return;
        }
        logErr({
          logGroupName: "backend-fintech-mongo",
          logStreamName: "sessionError",
          message: `HTTP/2 sessionError error, ${String(err)}.`,
        });
      });
      serverHTTP2.addListener("session", (session) => {
        const identity = `${session.socket.remoteFamily}:${session.socket.remoteAddress}:${session.socket.remotePort}`;
        session.setTimeout(60_000, () => {
          logErr({
            logGroupName: "backend-fintech-mongo",
            logStreamName: "sessionTimeout",
            message: `HTTP/2 session ${identity} timed out.`,
          });
          session.destroy(new Error("SESSION_TIMEOUT"));
        });
        const pingInterval = setInterval(() => {
          if (session.destroyed) {
            clearInterval(pingInterval);
          } else {
            session.ping((err) => {
              if (!err) return;
              if (session.destroyed) return;
              if (err.message === "ERR_HTTP2_PING_CANCEL") return;
              logErr({
                logGroupName: "backend-fintech-mongo",
                logStreamName: "sessionTimeout",
                message: `Ping to ${identity} failed, ${err}.`,
              });
            });
          }
        }, 15_000);
      });
      serverHTTP2.addListener("stream", (stream, headers) => {
        stream.setTimeout(300_000, () => {
          stream.destroy(new Error("SOCKET_TIMEOUT"));
        });
        stream.addListener("error", (err) => {
          if (err?.message === "ECONNRESET") {
            logErr({
              logGroupName: "backend-fintech-mongo",
              logStreamName: "streamError",
              message: `HTTP/2 stream connection reset, ${String(headers[":path"])}`,
            });
          } else {
            logErr({
              logGroupName: "backend-fintech-mongo",
              logStreamName: "streamError",
              message: `HTTP/2 stream connection reset, ${String(headers)}, ${err}`,
            });
          }
        });
      });
      serverHTTP2.addListener("request", (req, res) => {
        if (req.httpVersionMajor >= 2) return;
        // @ts-ignore
        req.setTimeout(300_000, (socket) => {
          if (!socket) {
            logErr({
              logGroupName: "backend-fintech-mongo",
              logStreamName: "reqTimeout",
              message: "HTTP1 in HTTP2 request (unknown) timed out.",
            });
            return;
          }
          const identity = `${socket.remoteFamily}:${socket.remoteAddress}:${socket.remotePort}`;
          logErr({
            logGroupName: "backend-fintech-mongo",
            logStreamName: "reqTimeout",
            message: `HTTP1 in HTTP2 request ${identity} timed out.`,
          });
          socket.destroy(new Error("SOCKET_TIMEOUT"));
        });
        // @ts-ignore
        res.setTimeout(300_000, (socket) => {
          if (!socket) {
            logErr({
              logGroupName: "backend-fintech-mongo",
              logStreamName: "resTimeout",
              message: "HTTP1 in HTTP2 response (unknown) timed out.",
            });
            return;
          }
          const identity = `${socket.remoteFamily}:${socket.remoteAddress}:${socket.remotePort}`;
          logErr({
            logGroupName: "backend-fintech-mongo",
            logStreamName: "resTimeout",
            message: `HTTP1 in HTTP2 response ${identity} timed out.`,
          });
          socket.destroy(new Error("SOCKET_TIMEOUT"));
        });
        req.addListener("error", (err) => {
          if (err.message === "ECONNRESET") {
            logErr({
              logGroupName: "backend-fintech-mongo",
              logStreamName: "reqError",
              message: `Response stream connection reset, ${req.url}.`,
            });
          } else {
            logErr({
              logGroupName: "backend-fintech-mongo",
              logStreamName: "reqError",
              message: `Response stream error, ${req.url}, ${String(req.headers)}, ${String(err)}`,
            });
          }
        });
        res.addListener("error", (err) => {
          if (err?.message === "ECONNRESET") {
            logErr({
              logGroupName: "backend-fintech-mongo",
              logStreamName: "resError",
              message: `Response stream connection reset, ${req.url}.`,
            });
          } else {
            logErr({
              logGroupName: "backend-fintech-mongo",
              logStreamName: "resError",
              message: `Response stream error, ${req.url}, ${String(req.headers)}, ${String(err)}`,
            });
          }
        });
      });
      resolve(serverHTTP2);
    });
    serverHTTP2.addListener("error", reject);
  });
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
