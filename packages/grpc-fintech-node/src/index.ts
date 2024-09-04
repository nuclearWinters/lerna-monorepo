import { MongoClient } from "mongodb";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import {
  AccountServer,
  MONGO_DB,
  AccountService,
} from "@lerna-monorepo/backend-utilities";

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
