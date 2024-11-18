import fs from "node:fs";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { AccountService, AccountServer } from "@repo/grpc-utils";
import { GRPC_FINTECH, IS_PRODUCTION, MONGO_DB } from "@repo/utils";
import { MongoClient } from "mongodb";

MongoClient.connect(MONGO_DB).then(async (mongoClient) => {
  const fintechdb = mongoClient.db("fintech");
  const server = new Server();
  server.addService(AccountService, AccountServer(fintechdb));
  server.bindAsync(
    IS_PRODUCTION ? "0.0.0.0:4001" : GRPC_FINTECH,
    ServerCredentials.createSsl(
      fs.readFileSync("../../certs/minica.pem"),
      [
        {
          private_key: fs.readFileSync("../../certs/key.pem"),
          cert_chain: fs.readFileSync("../../certs/cert.pem"),
        },
      ],
      IS_PRODUCTION,
    ),
    (err) => {
      if (err) {
        throw err;
      }
      return;
    },
  );
});
