import { MongoClient } from "mongodb";
import { createClient } from "redis";
import { main } from "./app";
import {
  AccountClient,
  REDIS,
  MONGO_DB,
} from "@lerna-monorepo/backend-utilities";
import { credentials } from "@grpc/grpc-js";

Promise.all([
  MongoClient.connect(MONGO_DB, {}),
  createClient({
    url: REDIS,
  }).connect(),
]).then(async ([mongoClient, redisClient]) => {
  const authdb = mongoClient.db("auth");
  const grpcClient = new AccountClient(
    `grpc-fintech-node:1984`,
    credentials.createInsecure()
  );
  const serverHTTP2 = await main(authdb, redisClient, grpcClient);
  serverHTTP2.listen(process.env.PORT || 4002);
});
