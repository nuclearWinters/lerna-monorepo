import { app } from "./app";
import { MongoClient } from "mongodb";
import { MONGO_DB } from "./config";
//import amqp from "amqplib";
//import { RENEW_ACCESS_TOKEN } from "./types";

MongoClient.connect(MONGO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async (client) => {
  const db = client.db("fintech");
  app.locals.db = db;
  //const conn = await amqp.connect("amqp://rabbitmq:15672");
  //const ch = await conn.createChannel();
  //await ch.assertQueue(RENEW_ACCESS_TOKEN);
  //app.locals.ch = ch;
  app.listen(process.env.PORT || 4000);
});
