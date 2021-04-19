import { app } from "./app";
import { MongoClient } from "mongodb";
import { MONGO_DB } from "./config";
import redis from "redis";
import { promisify } from "util";

MongoClient.connect(MONGO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((client) => {
  const redisClient = redis.createClient({
    port: 6379,
    host: "redis-auth",
  });
  const rdb = {
    get: promisify(redisClient.get).bind(redisClient),
    set: promisify(redisClient.set).bind(redisClient),
    keys: promisify(redisClient.keys).bind(redisClient),
  };
  const db = client.db("auth");
  app.locals.db = db;
  app.locals.rdb = rdb;
  app.listen(process.env.PORT || 5000);
});
