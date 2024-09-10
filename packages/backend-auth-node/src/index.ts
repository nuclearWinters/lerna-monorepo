import { MongoClient } from "mongodb";
import { createClient } from "redis";
import { main } from "./app.js";
import {
  REDIS,
  MONGO_DB,
  GRPC_FINTECH,
} from "@lerna-monorepo/backend-utilities/config";
import { credentials } from "@grpc/grpc-js";
import { AccountClient } from "@lerna-monorepo/backend-utilities/protoAccount/account_grpc_pb";

Promise.all([
  MongoClient.connect(MONGO_DB, {}),
  createClient({
    url: REDIS,
  }).connect(),
]).then(async ([mongoClient, redisClient]) => {
  const authdb = mongoClient.db("auth");
  const grpcClient = new AccountClient(
    GRPC_FINTECH,
    credentials.createInsecure()
  );
  const serverHTTP2 = await main(authdb, redisClient, grpcClient);
  serverHTTP2.listen(process.env.PORT || 4002);
});
