import { Db, Collection } from "mongodb";
import { UserMongo } from "./types";
import jsonwebtoken, { SignOptions } from "jsonwebtoken";
import { DecodeJWT, IMQ } from "./types";
import { ACCESSSECRET } from "./config";
import { Channel } from "amqplib";
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

export const getContext = (ctx: {
  req: {
    app: {
      locals: {
        db: Db;
        ch: Channel;
      };
    };
    headers: {
      authorization: string | undefined;
    };
  };
}): {
  users: Collection<UserMongo>;
  accessToken: string | undefined;
  publishToQueue: (message: IMQ) => void;
} => {
  const db = ctx.req.app.locals.db;
  const ch = ctx.req.app.locals.ch;
  return {
    users: db.collection<UserMongo>("users"),
    accessToken: ctx.req.headers.authorization,
    publishToQueue: (message) => {
      ch.sendToQueue(
        message.queue,
        Buffer.from(JSON.stringify(message.payload))
      );
    },
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
