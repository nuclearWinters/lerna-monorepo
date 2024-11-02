import { MongoClient } from "mongodb";
import {
  KAFKA,
  KAFKA_ID,
  KAFKA_PASSWORD,
  KAFKA_USERNAME,
  MONGO_DB,
  IS_PRODUCTION,
} from "@repo/utils/config";
import { checkEveryDay, checkEveryMonth } from "./cronJobs";
import { dayFunction } from "./cronJobDay";
import { monthFunction } from "./cronJobMonth";
import { Kafka, logLevel } from "kafkajs";

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

Promise.all([MongoClient.connect(MONGO_DB), producer.connect()]).then(
  async ([client]) => {
    const db = client.db("fintech");
    checkEveryDay(() => dayFunction(db, producer));
    checkEveryMonth(() => monthFunction(db, producer));
  }
);
