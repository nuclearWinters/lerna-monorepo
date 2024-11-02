import { MongoClient } from "mongodb";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { MONGO_DB, IS_PRODUCTION, GRPC_FINTECH } from "@repo/utils/config";
import { AccountService } from "@repo/grpc-utils/protoAccount/account_grpc_pb";
import { AccountServer } from "@repo/grpc-utils/index";
import fs from "node:fs";

MongoClient.connect(MONGO_DB).then(async (mongoClient) => {
  const fintechdb = mongoClient.db("fintech");
  const server = new Server();
  server.addService(AccountService, AccountServer(fintechdb));
  server.bindAsync(
    IS_PRODUCTION ? "0.0.0.0:443" : GRPC_FINTECH,
    ServerCredentials.createSsl(
      fs.readFileSync("../../certs/minica.pem"),
      [
        {
          private_key: fs.readFileSync("../../certs/key.pem"),
          cert_chain: fs.readFileSync("../../certs/cert.pem"),
        },
      ],
      IS_PRODUCTION
    ),
    (err) => {
      if (err) {
        throw err;
      }
      return;
    }
  );
});
