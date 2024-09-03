import { main } from "./app";
import { MongoClient } from "mongodb";
import { MONGO_DB, REDIS } from "./config";
import { credentials } from "@grpc/grpc-js";
import { Kafka } from "kafkajs";
import { AuthClient } from "@lerna-monorepo/grpc-auth-node";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { Redis, RedisOptions } from "ioredis";

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["kafka:9092"],
});

const producer = kafka.producer();

Promise.all([MongoClient.connect(MONGO_DB, {}), producer.connect()]).then(
  async ([client]) => {
    const db = client.db("fintech");
    const grpcClient = new AuthClient(
      `grpc-auth-node:1983`,
      credentials.createInsecure()
    );
    const options: RedisOptions = {
      host: REDIS,
      port: 6379,
      retryStrategy: (times) => {
        return Math.min(times * 50, 2000);
      },
    };
    const pubsub = new RedisPubSub({
      publisher: new Redis(options),
      subscriber: new Redis(options),
    });
    const serverHTTP2 = await main(db, producer, grpcClient, pubsub);
    serverHTTP2.listen(4000);
  }
);
