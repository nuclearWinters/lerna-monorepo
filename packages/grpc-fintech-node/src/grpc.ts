import {
  ServerUnaryCall,
  sendUnaryData,
  ServiceError,
  Metadata,
} from "@grpc/grpc-js";
import { Db } from "mongodb";
import { IAccountServer } from "./proto/account_grpc_pb";
import { CreateUserInput, CreateUserPayload } from "./proto/account_pb";

export const AccountServer = (db: Db): IAccountServer => ({
  async createUser(
    call: ServerUnaryCall<CreateUserInput, CreateUserPayload>,
    callback: sendUnaryData<CreateUserPayload>
  ): Promise<void> {
    try {
      const id = call.request.getId();
      const payload = new CreateUserPayload();
      await db.collection("users").insertOne({
        id,
        account_available: 0,
        account_to_be_paid: 0,
        account_total: 0,
        account_withheld: 0,
      });
      payload.setDone("");
      callback(null, payload);
    } catch (e) {
      const error: ServiceError = {
        name: "Error Auth Service",
        message: e instanceof Error ? e.message : "",
        code: 1,
        details: "",
        metadata: new Metadata(),
      };
      callback(error, null);
    }
  },
});
