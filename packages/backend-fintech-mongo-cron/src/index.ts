import { IS_PRODUCTION, KAFKA, KAFKA_ID, KAFKA_PASSWORD, KAFKA_USERNAME, MONGO_DB } from "@repo/utils";
import { Kafka, logLevel } from "kafkajs";
import { MongoClient } from "mongodb";
import { dayFunction } from "./cronJobDay.ts";
import { monthFunction } from "./cronJobMonth.ts";
import { checkEveryDay, checkEveryMonth } from "./cronJobs.ts";

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

Promise.all([MongoClient.connect(MONGO_DB), producer.connect()]).then(async ([client]) => {
  const db = client.db("fintech");
  checkEveryDay(() => dayFunction(db, producer));
  checkEveryMonth(() => monthFunction(db, producer));
});
