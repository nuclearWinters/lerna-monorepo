import { Db } from "mongodb";
import { UserMongo, Context } from "./types";
import { ACCESSSECRET, REFRESHSECRET } from "./config";
import jsonwebtoken, { SignOptions } from "jsonwebtoken";
import { DecodeJWT } from "./types";
import { AuthClient } from "./proto/auth_grpc_pb";
import { credentials } from "@grpc/grpc-js";
import { CreateUserInput, CreateUserPayload } from "./proto/auth_pb";
import { Request, Response } from "express";

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
    options: SignOptions
  ): string => {
    const token = jsonwebtoken.sign(data, secret, options);
    return token;
  },
};

export const refreshTokenMiddleware = async (
  accessToken: string | undefined,
  refreshToken: string | undefined
): Promise<{ validAccessToken?: string; id?: string }> => {
  if (accessToken === undefined) {
    return { validAccessToken: undefined, id: undefined };
  }
  if (refreshToken === undefined) {
    return { validAccessToken: undefined, id: undefined };
  }
  try {
    const user = jwt.verify(accessToken, ACCESSSECRET);
    if (!user) {
      return { validAccessToken: undefined, id: undefined };
    }
    return {
      validAccessToken: accessToken,
      id: user.id,
    };
  } catch (e) {
    if (e instanceof Error && e.message === "jwt expired") {
      const user = jwt.verify(refreshToken, REFRESHSECRET);
      if (!user) {
        return { validAccessToken: undefined, id: undefined };
      }
      const { id, isBorrower, isLender, isSupport } = user;
      const validAccessToken = jwt.sign(
        { id, isBorrower, isLender, isSupport },
        ACCESSSECRET,
        {
          expiresIn: ACCESS_TOKEN_EXP_STRING,
        }
      );
      return {
        validAccessToken,
        id: user.id,
      };
    }
    return { validAccessToken: undefined, id: undefined };
  }
};

export const getContext = async (
  req: Request,
  res: Response
): Promise<Context> => {
  const db = req.app.locals.db as Db;
  const rdb = req.app.locals.rdb;
  const accessToken = req.headers.authorization || "";
  const refreshToken = req.cookies.refreshToken || "";
  const { validAccessToken, id } = await refreshTokenMiddleware(
    accessToken,
    refreshToken
  );
  return {
    users: db.collection<UserMongo>("users"),
    rdb,
    accessToken,
    refreshToken,
    res,
    validAccessToken,
    id,
  };
};

export const base64Name = (i: string, name: string): string => {
  return Buffer.from(name + ":" + i, "utf8").toString("base64");
};

export const REFRESH_TOKEN_EXP_NUMBER = 15;
export const ACCESS_TOKEN_EXP_STRING = "3m";

export const client = new AuthClient(
  `backend-courses:1983`,
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
