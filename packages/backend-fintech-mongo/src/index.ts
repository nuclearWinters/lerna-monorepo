import { main } from "./app.js";
import { MongoClient } from "mongodb";
import { credentials } from "@grpc/grpc-js";
import { Kafka, logLevel } from "kafkajs";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { Redis } from "ioredis";
import {
  MONGO_DB,
  KAFKA,
  KAFKA_ID,
  REDIS,
  GRPC_AUTH,
  IS_PRODUCTION,
  KAFKA_PASSWORD,
  KAFKA_USERNAME,
} from "@lerna-monorepo/backend-utilities/config";
import { AuthClient } from "@lerna-monorepo/backend-utilities/protoAuth/auth_grpc_pb";
import fs from "fs";

const kafka = new Kafka({
  clientId: KAFKA_ID,
  brokers: [KAFKA],
  ssl: IS_PRODUCTION ? true : false,
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

Promise.all([MongoClient.connect(MONGO_DB, {}), producer.connect()]).then(
  async ([client]) => {
    const db = client.db("fintech");
    const grpcClient = new AuthClient(
      GRPC_AUTH,
      credentials.createSsl(
        fs.readFileSync("../../certs/minica.pem"),
        fs.readFileSync("../../certs/key.pem"),
        fs.readFileSync("../../certs/cert.pem")
      )
    );
    const retryStrategy = (times: number) => {
      return Math.min(times * 50, 2000);
    };
    const pubsub = new RedisPubSub({
      publisher: new Redis(REDIS, { retryStrategy }),
      subscriber: new Redis(REDIS, { retryStrategy }),
    });
    const serverHTTP2 = await main(db, producer, grpcClient, pubsub);
    serverHTTP2.listen(443);
  }
);
