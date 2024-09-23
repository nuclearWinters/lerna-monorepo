import { main } from "./app.js";
import { MongoClient } from "mongodb";
import { credentials } from "@grpc/grpc-js";
import { Kafka } from "kafkajs";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { Redis } from "ioredis";
import {
  MONGO_DB,
  KAFKA,
  KAFKA_ID,
  REDIS,
  GRPC_AUTH,
  NODE_ENV,
} from "@lerna-monorepo/backend-utilities/config";
import { AuthClient } from "@lerna-monorepo/backend-utilities/protoAuth/auth_grpc_pb";
import fs from "fs";

const isProduction = NODE_ENV === "production";

const kafka = new Kafka({
  clientId: KAFKA_ID,
  brokers: [KAFKA],
});

const producer = kafka.producer();

Promise.all([MongoClient.connect(MONGO_DB, {}), producer.connect()]).then(
  async ([client]) => {
    const db = client.db("fintech");
    const grpcClient = new AuthClient(
      GRPC_AUTH,
      credentials.createSsl(
        isProduction ? null : fs.readFileSync("../../rootCA.pem"),
        fs.readFileSync("../../certs/localhost.key"),
        fs.readFileSync("../../certs/localhost.crt")
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
