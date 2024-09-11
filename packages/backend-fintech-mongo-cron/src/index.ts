import { MongoClient } from "mongodb";
import {
  KAFKA,
  KAFKA_ID,
  KAFKA_PASSWORD,
  KAFKA_USERNAME,
  MONGO_DB,
  NODE_ENV,
} from "@lerna-monorepo/backend-utilities/config";
import { checkEveryDay, checkEveryMonth } from "./cronJobs.js";
import { dayFunction } from "./cronJobDay.js";
import { monthFunction } from "./cronJobMonth.js";
import { Kafka, logLevel } from "kafkajs";

const isProduction = NODE_ENV === "production";

const kafka = new Kafka({
  clientId: KAFKA_ID,
  brokers: [KAFKA],
  ssl: isProduction ? true : false,
  sasl: isProduction
    ? {
        mechanism: "scram-sha-256",
        username: KAFKA_USERNAME,
        password: KAFKA_PASSWORD,
      }
    : undefined,
  logLevel: isProduction ? logLevel.ERROR : undefined,
});

const producer = kafka.producer();

Promise.all([
  MongoClient.connect(MONGO_DB, {}),
  producer.connect(),
]).then(async ([client]) => {
  const db = client.db("fintech");
  checkEveryDay(() => dayFunction(db, producer));
  checkEveryMonth(() => monthFunction(db, producer));
});
