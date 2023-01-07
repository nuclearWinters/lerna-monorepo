import jsonwebtoken, { SignOptions } from "jsonwebtoken";
import { AuthClient } from "./proto/auth_grpc_pb";
import { JWTMiddlewareInput, JWTMiddlewarePayload } from "./proto/auth_pb";
import { credentials } from "@grpc/grpc-js";

export interface DecodeJWT {
  id: string;
  isLender: boolean;
  isBorrower: boolean;
  isSupport: boolean;
  iat: number;
  exp: number;
  refreshTokenExpireTime: number;
}

export interface IContextResult {
  accessToken: string;
  cookies: string;
  refreshToken: string;
  accessTokenHeader?: string;
  sessionId?: string;
}

export const setCookieContext = (
  ctx: unknown,
  cookies: string
): IContextResult => {
  const ctxTyped = ctx as IContextResult;
  ctxTyped.cookies = cookies;
  return ctxTyped;
};

export const setTokenContext = (
  ctx: unknown,
  accessTokenHeader: string
): IContextResult => {
  const ctxTyped = ctx as IContextResult;
  ctxTyped.accessTokenHeader = accessTokenHeader;
  return ctxTyped;
};

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
    },
    secret: string,
    options: SignOptions
  ): string => {
    const token = jsonwebtoken.sign(data, secret, options);
    return token;
  },
};

export const client = new AuthClient(
  `backend-auth:1983`,
  credentials.createInsecure()
);

export const jwtMiddleware = (
  refreshToken: string,
  accessToken: string
): Promise<JWTMiddlewarePayload> => {
  return new Promise<JWTMiddlewarePayload>((resolve, reject) => {
    const request = new JWTMiddlewareInput();
    request.setRefreshtoken(refreshToken);
    request.setAccesstoken(accessToken);

    client.jwtMiddleware(request, (err, user) => {
      if (err) {
        const error = new Error(err.message);
        reject(error);
      } else {
        resolve(user);
      }
    });
  });
};
