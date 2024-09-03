import { MongoClient } from "mongodb";
import { MONGO_DB } from "./config";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { AccountServer } from "./grpc";
import { AccountService } from "./proto/account_grpc_pb";

MongoClient.connect(MONGO_DB, {}).then(async (mongoClient) => {
  const fintechdb = mongoClient.db("fintech");
  const server = new Server();
  server.addService(AccountService, AccountServer(fintechdb));
  server.bindAsync(
    "grpc-fintech-node:1983",
    ServerCredentials.createInsecure(),
    (err) => {
      if (err) {
        return;
      }
    }
  );
});
