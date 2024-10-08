import { Db } from "mongodb";
import { UserMongo, UserLogins, UserSessions } from "./types";
import { Http2ServerRequest, Http2ServerResponse } from "node:http2";
import { parse } from "cookie";
import {
  ACCESSSECRET,
  REFRESHSECRET,
  ACCESS_TOKEN_EXP_NUMBER,
} from "@lerna-monorepo/backend-utilities/config";
import { jwt } from "@lerna-monorepo/backend-utilities/index";
import { RedisClientType } from "@lerna-monorepo/backend-utilities/types";
import { AccountClient } from "@lerna-monorepo/backend-utilities/protoAccount/account_grpc_pb";

export const getUser = async (
  accessToken: string,
  refreshToken: string,
  rdb: RedisClientType,
  authdb: Db
) => {
  if (!refreshToken) {
    return {
      id: "",
      isBorrower: false,
      isLender: true,
      isSupport: false,
      validAccessToken: "",
    };
  }
  const isBlacklisted = await rdb.get(refreshToken);
  if (isBlacklisted) {
    return {
      id: "",
      isBorrower: false,
      isLender: true,
      isSupport: false,
      validAccessToken: "",
    };
  }
  if (accessToken) {
    try {
      const userAccess = jwt.verify(accessToken, ACCESSSECRET);
      if (!userAccess) {
        throw new Error("El token esta corrompido.");
      }
      return {
        id: userAccess.id,
        isBorrower: userAccess.isBorrower,
        isLender: userAccess.isLender,
        isSupport: userAccess.isSupport,
        validAccessToken: accessToken,
      };
    } catch {
      return {
        id: "",
        isBorrower: false,
        isLender: true,
        isSupport: false,
        validAccessToken: "",
      };
    }
  }
  const user = jwt.verify(refreshToken, REFRESHSECRET);
  if (!user) {
    return {
      id: "",
      isBorrower: false,
      isLender: true,
      isSupport: false,
      validAccessToken: "",
    };
  }
  const { isBorrower, isLender, isSupport, id } = user;
  const now = new Date();
  now.setMilliseconds(0);
  const accessTokenExpireTime = now.getTime() / 1000 + ACCESS_TOKEN_EXP_NUMBER;
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
  const sessions = authdb.collection<UserSessions>("sessions");
  sessions.updateOne(
    {
      refreshToken,
    },
    {
      $set: {
        lastTimeAccessed: now,
      },
    }
  );
  return {
    id,
    isBorrower,
    isLender,
    isSupport,
    validAccessToken,
  };
};

export const getContextSSE = async (
  req: Http2ServerRequest,
  res: Http2ServerResponse,
  authdb: Db,
  rdb: RedisClientType,
  grpcClient: AccountClient
): Promise<Record<string, unknown>> => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const accessToken = req.headers.authorization || "";
  const cookies = parse(req.headers.cookie || "");
  const refreshToken = cookies.refreshToken || "";
  const { id, validAccessToken } = await getUser(
    accessToken,
    refreshToken,
    rdb,
    authdb
  );
  if (validAccessToken) {
    res.setHeader("accessToken", validAccessToken);
  }
  const userAgent = req.headers["user-agent"];
  return {
    authusers: authdb.collection<UserMongo>("users"),
    logins: authdb.collection<UserLogins>("logins"),
    sessions: authdb.collection<UserSessions>("sessions"),
    rdb,
    accessToken,
    refreshToken,
    id,
    ip,
    userAgent,
    req,
    grpcClient,
    res,
  };
};
