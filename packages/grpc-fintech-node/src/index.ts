import { MongoClient } from "mongodb";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import {
  AccountServer,
  AccountService,
  GRPC_FINTECH,
  MONGO_DB,
} from "@lerna-monorepo/backend-utilities";

MongoClient.connect(MONGO_DB, {}).then(async (mongoClient) => {
  const fintechdb = mongoClient.db("fintech");
  const server = new Server();
  server.addService(AccountService, AccountServer(fintechdb));
  server.bindAsync(GRPC_FINTECH, ServerCredentials.createInsecure(), (err) => {
    if (err) {
      return;
    }
  });
});
