import { MongoClient } from "mongodb";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { MONGO_DB, NODE_ENV } from "@lerna-monorepo/backend-utilities/config";
import { AccountService } from "@lerna-monorepo/backend-utilities/protoAccount/account_grpc_pb";
import { AccountServer } from "@lerna-monorepo/backend-utilities/grpc";
import fs from "fs";

MongoClient.connect(MONGO_DB, {}).then(async (mongoClient) => {
  const fintechdb = mongoClient.db("fintech");
  const server = new Server();
  server.addService(AccountService, AccountServer(fintechdb));
  server.bindAsync(
    "locahost:443",
    ServerCredentials.createSsl(
      fs.readFileSync("../../rootCA.pem"),
      [
        {
          private_key: fs.readFileSync("../../certs/localhost.key"),
          cert_chain: fs.readFileSync("../../certs/localhost.crt"),
        },
      ],
      NODE_ENV === "production"
    ),
    (err) => {
      if (err) {
        return;
      }
    }
  );
});
