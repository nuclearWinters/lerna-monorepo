import { Db } from "mongodb";
import { UserMongo, Context, UserLogins, UserSessions } from "./types";
import jsonwebtoken, { SignOptions } from "jsonwebtoken";
import { DecodeJWT } from "./types";
import { AuthClient } from "./proto/auth_grpc_pb";
import { credentials } from "@grpc/grpc-js";
import { CreateUserInput, CreateUserPayload } from "./proto/auth_pb";
import { Request, Response } from "express";
import DeviceDetector from "node-device-detector";

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

export const getContext = (req: Request, res: Response): Context => {
  const authdb = req.app.locals.authdb as Db;
  const rdb = req.app.locals.rdb;
  const ip = req.header("x-forwarded-for") || req.socket.remoteAddress;
  const accessToken = req.headers.authorization || "";
  const refreshToken = req.cookies.refreshToken || "";
  const id = req.cookies.id || "";
  const userAgent = req.headers["user-agent"];
  const detector = new DeviceDetector({
    clientIndexes: true,
    deviceIndexes: true,
    deviceAliasCode: false,
  });
  let deviceName = "";
  let deviceType = "";
  if (userAgent) {
    const result = detector.detect(userAgent);
    deviceName = `${result.os.name} ${result.os.version}`;
    deviceType = `${result.device.type} ${result.client.type} ${result.client.name}`;
  }
  return {
    authusers: authdb.collection<UserMongo>("users"),
    logins: authdb.collection<UserLogins>("logins"),
    sessions: authdb.collection<UserSessions>("sessions"),
    rdb,
    accessToken,
    refreshToken,
    res,
    id,
    ip,
    deviceName,
    deviceType,
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
