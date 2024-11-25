import { runKafkaConsumer } from "@repo/kafka-utils";
import { IS_PRODUCTION, KAFKA, KAFKA_ID, KAFKA_PASSWORD, KAFKA_USERNAME, MONGO_DB, REDIS } from "@repo/utils";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { Redis } from "ioredis";
import { Kafka, logLevel } from "kafkajs";
import { MongoClient } from "mongodb";
import { logErr } from "@repo/logs-utils"

const retryStrategy = (times: number) => {
  return Math.min(times * 50, 2_000);
};

const publisher = new Redis(REDIS, { retryStrategy });
publisher.on("error", (err) => {
  logErr({
    logGroupName: "kafka-mongo",
    logStreamName: "redisPublisherError",
    message: `Message: ${err.message}, Stack: ${err.stack}`,
  });
});

const subscriber = new Redis(REDIS, { retryStrategy });
subscriber.on("error", (err) => {
  logErr({
    logGroupName: "kafka-mongo",
    logStreamName: "redisSubscriberError",
    message: `Message: ${err.message}, Stack: ${err.stack}`,
  });
});

export const pubsub = new RedisPubSub({
  publisher,
  subscriber,
});

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

MongoClient.connect(MONGO_DB).then(async (client) => {
  const db = client.db("fintech");
  const consumer = kafka.consumer({ groupId: "test-group" });
  await producer.connect();
  runKafkaConsumer(consumer, producer, db, pubsub);
});
