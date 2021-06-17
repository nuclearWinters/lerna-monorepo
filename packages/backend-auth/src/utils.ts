import { Db } from "mongodb";
import { UserMongo, Context, SIGN_UP } from "./types";
import { ACCESSSECRET, REFRESHSECRET } from "./config";
import jsonwebtoken, { SignOptions } from "jsonwebtoken";
import { DecodeJWT } from "./types";
import { Channel } from "amqplib";

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
      _id: string;
      isBorrower: boolean;
      isLender: boolean;
      isSupport: boolean;
    },
    secret: string,
    options: SignOptions
  ): string => {
    const token = jsonwebtoken.sign(data, secret, options);
    return token;
  },
};

export const refreshTokenMiddleware = async (
  accessToken: string | undefined,
  refreshToken: string | undefined
): Promise<{ validAccessToken: string; _id: string }> => {
  if (accessToken === undefined) {
    throw new Error("Sin access token.");
  }
  if (refreshToken === undefined) {
    throw new Error("Sin refresh token.");
  }
  try {
    const user = jwt.verify(accessToken, ACCESSSECRET || "ACCESSSECRET");
    if (!user) throw new Error("El token esta corrompido.");
    return {
      validAccessToken: accessToken,
      _id: user._id,
    };
  } catch (e) {
    if (e.message === "jwt expired") {
      const user = jwt.verify(refreshToken, REFRESHSECRET || "REFRESHSECRET");
      if (!user) throw new Error("El token esta corrompido.");
      const validAccessToken = jwt.sign(user, ACCESSSECRET || "ACCESSSECRET", {
        expiresIn: "15m",
      });
      return {
        validAccessToken,
        _id: user._id,
      };
    }
    throw e;
  }
};

export const getContext = (req: any): Context => {
  const db = req.app.locals.db as Db;
  const ch = req.app.locals.ch;
  const rdb = req.app.locals.rdb;
  const authorization = JSON.parse(req.headers.authorization || "{}");
  return {
    users: db.collection<UserMongo>("users"),
    rdb,
    accessToken: authorization.accessToken,
    refreshToken: authorization.refreshToken,
    ch,
  };
};

export const channelSendToQueue = (ch: Channel, message: string): void => {
  ch.sendToQueue(SIGN_UP, Buffer.from(message));
};

export const base64Name = (i: string, name: string): string => {
  return Buffer.from(name + ":" + i, "utf8").toString("base64");
};
