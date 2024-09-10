import { MongoClient } from "mongodb";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import {
  GRPC_FINTECH,
  MONGO_DB,
} from "@lerna-monorepo/backend-utilities/config";
import { AccountService } from "@lerna-monorepo/backend-utilities/protoAccount/account_grpc_pb";
import { AccountServer } from "@lerna-monorepo/backend-utilities/grpc";

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
