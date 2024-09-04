import { MongoClient } from "mongodb";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import {
  AccountServer,
  AccountService,
} from "@lerna-monorepo/backend-utilities";
import { GRPC_FINTECH, MONGO_DB } from "../../backend-utilities/src/config";

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
