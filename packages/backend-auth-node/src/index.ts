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
      GRPC_FINTECH,
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
  return new Promise((resolve, reject) => {
    serverHTTP2.listen(4002, () => {
      serverHTTP2.removeListener("error", reject);
      // @ts-ignore
      serverHTTP2.setTimeout(120_000, (socket) => {
        if (!socket) {
          logErr({
            logGroupName: "backend-auth-node",
            logStreamName: "socketTimedOut",
            message: "HTTP2 socket (unknown) timed out.",
          });
          return;
        }
        const identity = `${socket.remoteFamily}:${socket.remoteAddress}:${socket.remotePort}`;
        logErr({
          logGroupName: "backend-auth-node",
          logStreamName: "socketTimeout",
          message: `HTTP2 socket ${identity} timed out.`,
        });
        socket.destroy(new Error("SOCKET_TIMEOUT"));
      });
      serverHTTP2.addListener("error", (err) => {
        logErr({
          logGroupName: "backend-auth-node",
          logStreamName: "serverError",
          message: `HTTP/2 server error, ${String(err)}.`,
        });
      });
      serverHTTP2.addListener("clientError", (err, socket) => {
        if (!socket.destroyed) socket.destroy(err);
        if (err?.message === "ECONNRESET") {
          logErr({
            logGroupName: "backend-auth-node",
            logStreamName: "clientErrorEconnreset",
            message: "HTTP/2 client connection reset.",
          });
          return;
        }
        logErr({
          logGroupName: "backend-auth-node",
          logStreamName: "clientError",
          message: `HTTP/2 client error, ${String(err)}.`,
        });
      });
      // @ts-ignore
      serverHTTP2.addListener("sessionError", (err, session) => {
        if (!session.destroyed) session.destroy(err);
        if (err?.message === "ECONNRESET") {
          logErr({
            logGroupName: "backend-auth-node",
            logStreamName: "sessionError",
            message: "HTTP/2 client connection reset.",
          });
          return;
        }
        logErr({
          logGroupName: "backend-auth-node",
          logStreamName: "sessionError",
          message: `HTTP/2 sessionError error, ${String(err)}.`,
        });
      });
      serverHTTP2.addListener("session", (session) => {
        const identity = `${session.socket.remoteFamily}:${session.socket.remoteAddress}:${session.socket.remotePort}`;
        session.setTimeout(60_000, () => {
          logErr({
            logGroupName: "backend-auth-node",
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
                logGroupName: "backend-auth-node",
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
              logGroupName: "backend-auth-node",
              logStreamName: "streamError",
              message: `HTTP/2 stream connection reset, ${String(headers[":path"])}`,
            });
          } else {
            logErr({
              logGroupName: "backend-auth-node",
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
              logGroupName: "backend-auth-node",
              logStreamName: "reqTimeout",
              message: "HTTP1 in HTTP2 request (unknown) timed out.",
            });
            return;
          }
          const identity = `${socket.remoteFamily}:${socket.remoteAddress}:${socket.remotePort}`;
          logErr({
            logGroupName: "backend-auth-node",
            logStreamName: "reqTimeout",
            message: `HTTP1 in HTTP2 request ${identity} timed out.`,
          });
          socket.destroy(new Error("SOCKET_TIMEOUT"));
        });
        // @ts-ignore
        res.setTimeout(300_000, (socket) => {
          if (!socket) {
            logErr({
              logGroupName: "backend-auth-node",
              logStreamName: "resTimeout",
              message: "HTTP1 in HTTP2 response (unknown) timed out.",
            });
            return;
          }
          const identity = `${socket.remoteFamily}:${socket.remoteAddress}:${socket.remotePort}`;
          logErr({
            logGroupName: "backend-auth-node",
            logStreamName: "resTimeout",
            message: `HTTP1 in HTTP2 response ${identity} timed out.`,
          });
          socket.destroy(new Error("SOCKET_TIMEOUT"));
        });
        req.addListener("error", (err) => {
          if (err.message === "ECONNRESET") {
            logErr({
              logGroupName: "backend-auth-node",
              logStreamName: "reqError",
              message: `Response stream connection reset, ${req.url}.`,
            });
          } else {
            logErr({
              logGroupName: "backend-auth-node",
              logStreamName: "reqError",
              message: `Response stream error, ${req.url}, ${String(req.headers)}, ${String(err)}`,
            });
          }
        });
        res.addListener("error", (err) => {
          if (err?.message === "ECONNRESET") {
            logErr({
              logGroupName: "backend-auth-node",
              logStreamName: "resError",
              message: `Response stream connection reset, ${req.url}.`,
            });
          } else {
            logErr({
              logGroupName: "backend-auth-node",
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
