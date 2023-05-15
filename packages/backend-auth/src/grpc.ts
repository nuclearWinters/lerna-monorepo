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
import { ACCESS_TOKEN_EXP_NUMBER, jwt } from "./utils";
import { REFRESHSECRET, ACCESSSECRET } from "./config";
import { addMinutes, isAfter } from "date-fns";
import { UserSessions } from "./types";

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
      const isBlacklisted = await ctx?.rdb?.get(refreshToken);
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
        payload.setId(userAccess.id);
        payload.setIsborrower(userAccess.isBorrower);
        payload.setIslender(userAccess.isLender);
        payload.setIssupport(userAccess.isSupport);
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
      const now = new Date();
      now.setMilliseconds(0);
      const accessTokenExpireTime =
        now.getTime() / 1000 + ACCESS_TOKEN_EXP_NUMBER;
      const validAccessToken = jwt.sign(
        {
          isBorrower,
          isLender,
          isSupport,
          id,
          refreshTokenExpireTime: user.exp,
          exp: accessTokenExpireTime,
        },
        ACCESSSECRET
      );
      const payload = new JWTMiddlewarePayload();
      payload.setValidaccesstoken(validAccessToken);
      payload.setId(id);
      payload.setIsborrower(isBorrower);
      payload.setIslender(isLender);
      payload.setIssupport(isSupport);
      const sessions = ctx?.authdb?.collection<UserSessions>("sessions");
      sessions?.updateOne(
        {
          refreshToken,
        },
        {
          $set: {
            lastTimeAccessed: now,
          },
        }
      );
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
