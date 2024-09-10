import { MongoClient } from "mongodb";
import {
  KAFKA,
  KAFKA_ID,
  MONGO_DB,
} from "@lerna-monorepo/backend-utilities/config";
import { checkEveryDay, checkEveryMonth } from "./cronJobs.js";
import { dayFunction } from "./cronJobDay.js";
import { monthFunction } from "./cronJobMonth.js";
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: KAFKA_ID,
  brokers: [KAFKA],
});

const producer = kafka.producer();

MongoClient.connect(MONGO_DB, {}).then(async (client) => {
  const db = client.db("fintech");
  checkEveryDay(() => dayFunction(db, producer));
  checkEveryMonth(() => monthFunction(db, producer));
});
