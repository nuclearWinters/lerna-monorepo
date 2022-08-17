import {
  ServerUnaryCall,
  sendUnaryData,
  ServiceError,
  Metadata,
} from "@grpc/grpc-js";
import {
  CreateUserInput,
  CreateUserPayload,
  RenewAccessTokenInput,
  RenewAccessTokenPayload,
} from "./proto/auth_pb";
import { IAuthServer } from "./proto/auth_grpc_pb";
import { ctx } from "./index";
import { UserMongo } from "./types";

export const AuthServer: IAuthServer = {
  async renewAccessToken(
    call: ServerUnaryCall<RenewAccessTokenInput, RenewAccessTokenPayload>,
    callback: sendUnaryData<RenewAccessTokenPayload>
  ): Promise<void> {
    try {
      const payload = new RenewAccessTokenPayload();
      payload.setValidaccesstoken("");
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
  async createUser(
    call: ServerUnaryCall<CreateUserInput, CreateUserPayload>,
    callback: sendUnaryData<CreateUserPayload>
  ): Promise<void> {
    try {
      const nanoId = call.request.getNanoid();
      ctx.db?.collection<UserMongo>("users").insertOne({
        accountLent: 0,
        accountInterests: 0,
        accountAvailable: 0,
        id: nanoId,
      });
      const payload = new CreateUserPayload();
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
};
