import { main } from "./app.js";
import { MongoClient } from "mongodb";
import { credentials } from "@grpc/grpc-js";
import { Kafka } from "kafkajs";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { Redis, RedisOptions } from "ioredis";
import {
  MONGO_DB,
  KAFKA,
  KAFKA_ID,
  IOREDIS,
  GRPC_AUTH,
} from "@lerna-monorepo/backend-utilities/config";
import { AuthClient } from "@lerna-monorepo/backend-utilities/protoAuth/auth_grpc_pb";

const kafka = new Kafka({
  clientId: KAFKA_ID,
  brokers: [KAFKA],
});

const producer = kafka.producer();

Promise.all([MongoClient.connect(MONGO_DB, {}), producer.connect()]).then(
  async ([client]) => {
    const db = client.db("fintech");
    const grpcClient = new AuthClient(GRPC_AUTH, credentials.createInsecure());
    const options: RedisOptions = {
      host: IOREDIS,
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
