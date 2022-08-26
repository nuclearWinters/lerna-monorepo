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
import { ACCESS_TOKEN_EXP_STRING, jwt } from "./utils";
import { REFRESHSECRET, ACCESSSECRET } from "./config";

export const AuthServer: IAuthServer = {
  async renewAccessToken(
    call: ServerUnaryCall<RenewAccessTokenInput, RenewAccessTokenPayload>,
    callback: sendUnaryData<RenewAccessTokenPayload>
  ): Promise<void> {
    try {
      const refreshToken = call.request.getRefreshtoken();
      if (!refreshToken) {
        throw new Error("No refresh token");
      }
      const user = jwt.verify(refreshToken, REFRESHSECRET);
      if (!user) {
        throw new Error("El token esta corrompido.");
      }
      const blacklistedUser = await ctx.rdb?.get(user.id);
      if (blacklistedUser) {
        throw new Error("El usuario estará bloqueado por una hora.");
      }
      const { isBorrower, isLender, isSupport, id } = user;
      const validAccessToken = jwt.sign(
        { isBorrower, isLender, isSupport, id },
        ACCESSSECRET,
        {
          expiresIn: ACCESS_TOKEN_EXP_STRING,
        }
      );
      const payload = new RenewAccessTokenPayload();
      payload.setValidaccesstoken(validAccessToken);
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
