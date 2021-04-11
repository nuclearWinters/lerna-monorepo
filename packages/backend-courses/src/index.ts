import { app } from "./app";
import { MongoClient } from "mongodb";
import { MONGO_DB } from "./config";

MongoClient.connect(MONGO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((client) => {
  const db = client.db("courses");
  app.locals.db = db;
  app.listen(process.env.PORT || 4000);
});
