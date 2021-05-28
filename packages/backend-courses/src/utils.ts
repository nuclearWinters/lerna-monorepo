import { Db } from "mongodb";
import {
  UserMongo,
  LoanMongo,
  BucketTransactionMongo,
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
    data: { _id: string; email: string },
    secret: string,
    options: SignOptions
  ): string => {
    const token = jsonwebtoken.sign(data, secret, options);
    return token;
  },
};

export const getContext = (req: any): Context => {
  const db = req.app.locals.db as Db;
  const ch = req.app.locals.ch;
  const authorization = JSON.parse(req.headers.authorization || "{}");
  return {
    users: db.collection<UserMongo>("users"),
    loans: db.collection<LoanMongo>("loans"),
    investments: db.collection<InvestmentMongo>("lends"),
    transactions: db.collection<BucketTransactionMongo>("transactions"),
    accessToken: authorization.accessToken,
    refreshToken: authorization.refreshToken,
    ch,
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
      if (err) reject(err);
      else resolve(user);
    });
  });
};

interface IResolve {
  validAccessToken: string;
  _id: string;
  email: string;
}

export const refreshTokenMiddleware = async (
  accessToken: string | undefined,
  refreshToken: string | undefined
): Promise<IResolve> => {
  if (!accessToken) {
    throw new Error("Sin access token.");
  }
  if (!refreshToken) {
    throw new Error("Sin refresh token.");
  }
  try {
    const user = jwt.verify(accessToken, ACCESSSECRET);
    if (!user) throw new Error("El token esta corrompido.");
    return {
      validAccessToken: accessToken,
      _id: user._id,
      email: user.email,
    };
  } catch (e) {
    if (e.message === "jwt expired") {
      const response = await renewAccessToken(refreshToken);
      const validAccessToken = response.getValidaccesstoken();
      const user = jwt.verify(validAccessToken, ACCESSSECRET);
      if (!user) throw new Error("El token esta corrompido.");
      return { validAccessToken, _id: user._id, email: user.email };
    } else {
      throw e;
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
