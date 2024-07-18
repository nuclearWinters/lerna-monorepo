import { Db } from "mongodb";
import {
  UserMongo,
  Context,
  UserLogins,
  UserSessions,
  RedisClientType,
} from "./types";
import jsonwebtoken, { SignOptions } from "jsonwebtoken";
import { DecodeJWT } from "./types";
import { AuthClient } from "./proto/auth_grpc_pb";
import { credentials } from "@grpc/grpc-js";
import { CreateUserInput, CreateUserPayload } from "./proto/auth_pb";
//import DeviceDetector from "node-device-detector";
import { Request } from "graphql-sse";
import { Http2ServerRequest, Http2ServerResponse } from "http2";
import { parse } from "cookie";
import { ACCESSSECRET, REFRESHSECRET } from "./config";
import { addMinutes, isAfter } from "date-fns";

export const jwt = {
  decode: (token: string): string | DecodeJWT | null => {
    const decoded = jsonwebtoken.decode(token);
    return decoded as string | DecodeJWT | null;
  },
  verify: (token: string, password: string): DecodeJWT | undefined => {
    const decoded = jsonwebtoken.verify(token, password);
    return decoded as DecodeJWT | undefined;
  },
  sign: (
    data: {
      id: string;
      isBorrower: boolean;
      isLender: boolean;
      isSupport: boolean;
      refreshTokenExpireTime: number;
      exp: number;
    },
    secret: string,
    options?: SignOptions
  ): string => {
    const token = jsonwebtoken.sign(data, secret, options);
    return token;
  },
};

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
    } catch (e) {
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
  req: Request<Http2ServerRequest, { res: Http2ServerResponse }>,
  authdb: Db,
  rdb: RedisClientType
): Promise<Record<string, unknown>> => {
  //const ip = req.headers.get("x-forwarded-for") || req.socket.remoteAddress;
  const ip = "";
  const accessToken = req.headers.get("authorization") || "";
  const cookies = parse(req.headers.get("cookie") || "");
  const refreshToken = cookies.refreshToken || "";
  const { id, validAccessToken } = await getUser(
    accessToken,
    refreshToken,
    rdb,
    authdb
  );
  if (validAccessToken) {
    req.context.res?.setHeader("accessToken", validAccessToken);
  }
  //const userAgent = req.headers["user-agent"];
  //const detector = new DeviceDetector({
  //  clientIndexes: true,
  //  deviceIndexes: true,
  //  deviceAliasCode: false,
  //});
  let deviceName = "";
  let deviceType = "";
  /*if (userAgent) {
    const result = detector.detect(userAgent);
    deviceName = `${result.os.name} ${result.os.version}`;
    deviceType = `${result.device.type} ${result.client.type} ${result.client.name}`;
  }*/
  return {
    authusers: authdb.collection<UserMongo>("users"),
    logins: authdb.collection<UserLogins>("logins"),
    sessions: authdb.collection<UserSessions>("sessions"),
    rdb,
    accessToken,
    refreshToken,
    id,
    ip,
    deviceName,
    deviceType,
    req,
  };
};

export const base64Name = (i: string, name: string): string => {
  return Buffer.from(name + ":" + i, "utf8").toString("base64");
};

export const REFRESH_TOKEN_EXP_NUMBER = 900;
export const ACCESS_TOKEN_EXP_NUMBER = 180;

export const client = new AuthClient(
  `backend-fintech:1983`,
  credentials.createInsecure()
);

export const createUser = (nanoid: string): Promise<CreateUserPayload> => {
  return new Promise<CreateUserPayload>((resolve, reject) => {
    const request = new CreateUserInput();
    request.setNanoid(nanoid);

    client.createUser(request, (err, user) => {
      if (err) reject(err);
      else resolve(user);
    });
  });
};

export const base64 = (i: string): string => {
  return Buffer.from("arrayconnection:" + i, "utf8").toString("base64");
};

export const unbase64 = (i: string): string => {
  return Buffer.from(i, "base64").toString("utf8").split(":")[1];
};
