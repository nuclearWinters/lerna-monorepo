import { app } from "./app";
import { MongoClient, ObjectID } from "mongodb";
import { MONGO_DB } from "./config";
import amqp from "amqplib";
import { SIGN_UP } from "./types";

MongoClient.connect(MONGO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async (client) => {
  const db = client.db("fintech");
  app.locals.db = db;
  const conn = await amqp.connect("amqp://rabbitmq:5672");
  const ch = await conn.createChannel();
  await ch.assertQueue(SIGN_UP);
  ch.consume(SIGN_UP, (msg) => {
    if (msg !== null) {
      db.collection("users").insertOne({
        _id: new ObjectID(msg.content.toString()),
        name: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        RFC: "",
        CURP: "",
        clabe: "",
        mobile: "",
        accountTotal: 0,
        accountAvailable: 0,
      });
      ch.ack(msg);
    }
  });
  app.locals.ch = ch;
  app.listen(process.env.PORT || 4000);
});
