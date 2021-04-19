import { Db, Collection } from "mongodb";
import { UserMongo, RedisPromises } from "./types";
import { ACCESSSECRET, REFRESHSECRET } from "./config";
import jsonwebtoken, { SignOptions } from "jsonwebtoken";
import { DecodeJWT } from "./types";

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

export const refreshTokenMiddleware = async (
  accessToken: string | undefined,
  refreshToken: string | undefined
): Promise<{ validAccessToken: string; _id: string; email: string }> => {
  if (accessToken === undefined) {
    throw new Error("Sin access token.");
  }
  if (refreshToken === undefined) {
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
      const user = jwt.verify(refreshToken, REFRESHSECRET);
      if (!user) throw new Error("El token esta corrompido.");
      const validAccessToken = jwt.sign(
        { _id: user._id, email: user.email },
        ACCESSSECRET,
        {
          expiresIn: "15s",
        }
      );
      return {
        validAccessToken,
        _id: user._id,
        email: user.email,
      };
    }
    throw e;
  }
};

export const getContext = (req: {
  headers: {
    authorization: string | undefined;
  };
  app: {
    locals: {
      db: Db;
      rdb: RedisPromises;
    };
  };
}): {
  users: Collection<UserMongo>;
  rdb: RedisPromises;
  accessToken: string | undefined;
} => {
  const { db, rdb } = req.app.locals;
  return {
    users: db.collection<UserMongo>("users"),
    rdb,
    accessToken: req.headers.authorization,
  };
};
