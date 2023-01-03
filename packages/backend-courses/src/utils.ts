import { Db } from "mongodb";
import {
  UserMongo,
  LoanMongo,
  TransactionMongo,
  InvestmentMongo,
} from "./types";
import jsonwebtoken, { SignOptions } from "jsonwebtoken";
import { DecodeJWT, Context } from "./types";
import { ACCESSSECRET } from "./config";
import {
  RenewAccessTokenInput,
  RenewAccessTokenPayload,
} from "./proto/auth_pb";
import { AuthClient } from "./proto/auth_grpc_pb";
import { credentials } from "@grpc/grpc-js";
import { Request, Response } from "express";
import { addMinutes, isAfter } from "date-fns";
import Redis from "ioredis";

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
    },
    secret: string,
    options?: SignOptions
  ): string => {
    const token = jsonwebtoken.sign(data, secret, options);
    return token;
  },
};

export const getContext = async (
  req: Request,
  res: Response
): Promise<Context> => {
  const db = req.app.locals.db as Db;
  const ch = req.app.locals.ch;
  const rdb = req.app.locals.rdb as Redis;
  const accessToken = req.headers.authorization || "";
  const refreshToken = req.cookies?.refreshToken || "";
  const sessionId = req.header("sessionId") || "";
  const { id, validAccessToken, isBorrower, isLender, isSupport } =
    await refreshTokenMiddleware(accessToken, refreshToken, rdb, sessionId);
  res?.setHeader("accessToken", validAccessToken || "");
  return {
    users: db.collection<UserMongo>("users"),
    loans: db.collection<LoanMongo>("loans"),
    investments: db.collection<InvestmentMongo>("investments"),
    transactions: db.collection<TransactionMongo>("transactions"),
    accessToken,
    refreshToken,
    ch,
    id,
    validAccessToken,
    isBorrower,
    isLender,
    isSupport,
  };
};

export const client = new AuthClient(
  `backend-auth:1983`,
  credentials.createInsecure()
);

export const renewAccessToken = (
  refreshToken: string
): Promise<RenewAccessTokenPayload> => {
  return new Promise<RenewAccessTokenPayload>((resolve, reject) => {
    const request = new RenewAccessTokenInput();
    request.setRefreshtoken(refreshToken);

    client.renewAccessToken(request, (err, user) => {
      if (err) {
        const error = new Error(err.message);
        reject(error);
      } else {
        resolve(user);
      }
    });
  });
};

interface IResolve {
  validAccessToken?: string;
  id?: string;
  isLender: boolean;
  isBorrower: boolean;
  isSupport: boolean;
}

export const refreshTokenMiddleware = async (
  accessToken: string | undefined,
  refreshToken: string | undefined,
  rdb: Redis,
  sessionId: string
): Promise<IResolve> => {
  if (!refreshToken) {
    return {
      validAccessToken: undefined,
      id: undefined,
      isLender: false,
      isBorrower: false,
      isSupport: false,
    };
  }
  try {
    if (!accessToken) {
      throw new Error("jwt expired");
    }
    const user = jwt.verify(accessToken, ACCESSSECRET.ACCESSSECRET);
    if (!user) throw new Error("El token esta corrompido.");
    const blacklistedUserTime = await rdb?.get(sessionId);
    if (blacklistedUserTime) {
      const time = new Date(Number(blacklistedUserTime), 1000);
      const issuedTime = addMinutes(new Date(user.exp * 1000), -3);
      const loggedAfter = isAfter(issuedTime, time);
      if (!loggedAfter)
        return {
          validAccessToken: undefined,
          id: undefined,
          isLender: false,
          isBorrower: false,
          isSupport: false,
        };
    }
    const { id, isLender, isBorrower, isSupport } = user;
    return {
      validAccessToken: accessToken,
      id,
      isLender,
      isBorrower,
      isSupport,
    };
  } catch (e) {
    if (e instanceof Error && e.message === "jwt expired") {
      try {
        const response = await renewAccessToken(refreshToken);
        const validAccessToken = response.getValidaccesstoken();
        const user = jwt.verify(validAccessToken, ACCESSSECRET.ACCESSSECRET);
        if (!user) {
          return {
            validAccessToken: undefined,
            id: undefined,
            isLender: false,
            isBorrower: false,
            isSupport: false,
          };
        }
        const { id, isLender, isBorrower, isSupport } = user;
        return { validAccessToken, id, isLender, isBorrower, isSupport };
      } catch (e) {
        return {
          validAccessToken: undefined,
          id: undefined,
          isLender: false,
          isBorrower: false,
          isSupport: false,
        };
      }
    } else {
      return {
        validAccessToken: undefined,
        id: undefined,
        isLender: false,
        isBorrower: false,
        isSupport: false,
      };
    }
  }
};

export const base64 = (i: string): string => {
  return Buffer.from("arrayconnection:" + i, "utf8").toString("base64");
};

export const unbase64 = (i: string): string => {
  return Buffer.from(i, "base64").toString("utf8").split(":")[1];
};

export const base64Name = (i: string, name: string): string => {
  return Buffer.from(name + ":" + i, "utf8").toString("base64");
};
