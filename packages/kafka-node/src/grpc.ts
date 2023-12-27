import {
  ServerUnaryCall,
  sendUnaryData,
  ServiceError,
  Metadata,
} from "@grpc/grpc-js";
import {
  CreateUserInput,
  CreateUserPayload,
  JWTMiddlewareInput,
  JWTMiddlewarePayload,
} from "./proto/auth_pb";
import { IAuthServer } from "./proto/auth_grpc_pb";
import { Client } from "cassandra-driver";

export const AuthServer: (client: Client) => IAuthServer = (client) => ({
  async jwtMiddleware(
    call: ServerUnaryCall<JWTMiddlewareInput, JWTMiddlewarePayload>,
    callback: sendUnaryData<JWTMiddlewarePayload>
  ): Promise<void> {
    try {
      const payload = new JWTMiddlewarePayload();
      payload.setValidaccesstoken("");
      payload.setId("");
      payload.setIsborrower(false);
      payload.setIslender(false);
      payload.setIssupport(false);
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
      const id = call.request.getNanoid();
      const payload = new CreateUserPayload();
      await client.execute(`
        INSERT INTO fintech.users (id, account_available, account_to_be_paid, account_total)
          VALUES (${id}, 0, 0, 0)`);
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
