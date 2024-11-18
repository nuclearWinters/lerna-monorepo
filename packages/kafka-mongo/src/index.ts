import { runKafkaConsumer } from "@repo/kafka-utils";
import { IS_PRODUCTION, KAFKA, KAFKA_ID, KAFKA_PASSWORD, KAFKA_USERNAME, MONGO_DB, REDIS } from "@repo/utils";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { Redis } from "ioredis";
import { Kafka, logLevel } from "kafkajs";
import { MongoClient } from "mongodb";

const retryStrategy = (times: number) => {
  return Math.min(times * 50, 2_000);
};

export const pubsub = new RedisPubSub({
  publisher: new Redis(REDIS, { retryStrategy }),
  subscriber: new Redis(REDIS, { retryStrategy }),
});

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

MongoClient.connect(MONGO_DB).then(async (client) => {
  const db = client.db("fintech");
  const consumer = kafka.consumer({ groupId: "test-group" });
  await producer.connect();
  runKafkaConsumer(consumer, producer, db, pubsub);
});
