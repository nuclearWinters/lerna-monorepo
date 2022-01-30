import {
  ServerUnaryCall,
  sendUnaryData,
  ServiceError,
  Metadata,
} from "@grpc/grpc-js";
import {
  RenewAccessTokenInput,
  RenewAccessTokenPayload,
} from "./proto/auth_pb";
import { IAuthServer } from "./proto/auth_grpc_pb";
import { ctx } from "./index";
import { jwt } from "./utils";
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
      const blacklistedUser = await ctx.rdb?.get(user._id);
      if (blacklistedUser) {
        throw new Error("El usuario estará bloqueado por una hora.");
      }
      const validAccessToken = jwt.sign(user, ACCESSSECRET, {
        expiresIn: "15m",
      });
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
};
