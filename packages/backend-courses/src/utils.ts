import { Db, Collection } from "mongodb";
import { UserMongo } from "./types";
import jsonwebtoken, { SignOptions } from "jsonwebtoken";
import { DecodeJWT } from "./types";
import { ACCESSSECRET } from "./config";
import axios from "axios";

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

export const getContext = (ctx: {
  req: {
    app: {
      locals: {
        db: Db;
      };
    };
    headers: {
      authorization: string | undefined;
    };
  };
}): {
  users: Collection<UserMongo>;
  accessToken: string | undefined;
} => {
  const db = ctx.req.app.locals.db;
  return {
    users: db.collection<UserMongo>("users"),
    accessToken: ctx.req.headers.authorization,
  };
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
      const response = await axios.post(
        "http://localhost/auth/expiredAcessToken",
        { refreshToken }
      );
      const { validAccessToken, user } = response.data;
      return { validAccessToken, _id: user._id, email: user.email };
    }
    throw e;
  }
};
