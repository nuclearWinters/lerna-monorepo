import {
  ServerUnaryCall,
  sendUnaryData,
  ServiceError,
  Metadata,
} from "@grpc/grpc-js";
import {
  JWTMiddlewareInput,
  JWTMiddlewarePayload,
} from "./proto/auth_pb";
import { IAuthServer } from "./proto/auth_grpc_pb";
import { ACCESS_TOKEN_EXP_NUMBER, jwt } from "./utils";
import { REFRESHSECRET, ACCESSSECRET } from "./config";
import { RedisClientType, UserSessions } from "./types";
import { Db } from "mongodb";

export const AuthServer = (authdb: Db, rdb: RedisClientType): IAuthServer => ({
  async jwtMiddleware(
    call: ServerUnaryCall<JWTMiddlewareInput, JWTMiddlewarePayload>,
    callback: sendUnaryData<JWTMiddlewarePayload>
  ): Promise<void> {
    try {
      const refreshToken = call.request.getRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token");
      }
      const accessToken = call.request.getAccessToken();
      const isBlacklisted = await rdb.get(refreshToken);
      if (isBlacklisted) {
        throw new Error("El usuario esta bloqueado.");
      }
      if (accessToken) {
        try {
          const userAccess = jwt.verify(accessToken, ACCESSSECRET);
          if (!userAccess) {
            throw new Error("El token esta corrompido.");
          }
          const payload = new JWTMiddlewarePayload();
          payload.setValidAccessToken(accessToken);
          payload.setId(userAccess.id);
          payload.setIsBorrower(userAccess.isBorrower);
          payload.setIsLender(userAccess.isLender);
          payload.setIsSupport(userAccess.isSupport);
          return callback(null, payload);
        } catch (e) {
          if (e instanceof Error && e.name !== "TokenExpiredError") {
            throw e;
          }
        }
      }
      const user = jwt.verify(refreshToken, REFRESHSECRET);
      if (!user) {
        throw new Error("El token esta corrompido.");
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
      payload.setValidAccessToken(validAccessToken);
      payload.setId(id);
      payload.setIsBorrower(isBorrower);
      payload.setIsLender(isLender);
      payload.setIsSupport(isSupport);
      const sessions = authdb.collection<UserSessions>("sessions");
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
});
