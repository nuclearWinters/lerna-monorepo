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
import { ctx } from "./index";
import { ACCESS_TOKEN_EXP_STRING, jwt } from "./utils";
import { REFRESHSECRET, ACCESSSECRET } from "./config";
import { addMinutes, isAfter } from "date-fns";

export const AuthServer: IAuthServer = {
  async jwtMiddleware(
    call: ServerUnaryCall<JWTMiddlewareInput, JWTMiddlewarePayload>,
    callback: sendUnaryData<JWTMiddlewarePayload>
  ): Promise<void> {
    try {
      const refreshToken = call.request.getRefreshtoken();
      if (!refreshToken) {
        throw new Error("No refresh token");
      }
      const accessToken = call.request.getAccesstoken();
      const sessionId = call.request.getSessionid();
      const isBlacklisted = await ctx?.rdb?.get(sessionId);
      if (accessToken) {
        const userAccess = jwt.verify(accessToken, ACCESSSECRET);
        if (!userAccess) {
          throw new Error("El token esta corrompido.");
        }
        if (isBlacklisted) {
          const time = new Date(Number(isBlacklisted) * 1000);
          const issuedTime = addMinutes(new Date(userAccess.exp * 1000), -3);
          const loggedAfter = isAfter(issuedTime, time);
          if (!loggedAfter) {
            throw new Error("El usuario esta bloqueado.");
          }
        }
        const payload = new JWTMiddlewarePayload();
        payload.setValidaccesstoken(accessToken);
        return callback(null, payload);
      }
      const user = jwt.verify(refreshToken, REFRESHSECRET);
      if (!user) {
        throw new Error("El token esta corrompido.");
      }
      if (isBlacklisted) {
        const time = new Date(Number(isBlacklisted) * 1000);
        const issuedTime = addMinutes(new Date(user.exp * 1000), -15);
        const loggedAfter = isAfter(issuedTime, time);
        if (!loggedAfter) {
          throw new Error("El usuario esta bloqueado.");
        }
      }
      const { isBorrower, isLender, isSupport, id } = user;
      const validAccessToken = jwt.sign(
        {
          isBorrower,
          isLender,
          isSupport,
          id,
          refreshTokenExpireTime: user.exp,
        },
        ACCESSSECRET,
        {
          expiresIn: ACCESS_TOKEN_EXP_STRING,
        }
      );
      const payload = new JWTMiddlewarePayload();
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
