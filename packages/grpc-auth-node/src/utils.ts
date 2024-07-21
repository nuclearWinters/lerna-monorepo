import jsonwebtoken, { SignOptions } from "jsonwebtoken";
import { DecodeJWT } from "./types";
import { AuthClient } from "./proto/auth_grpc_pb";
import { JWTMiddlewareInput } from "./proto/auth_pb";

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

export const REFRESH_TOKEN_EXP_NUMBER = 900;
export const ACCESS_TOKEN_EXP_NUMBER = 180;

export const jwtMiddleware = (refreshToken: string, accessToken: string, client: AuthClient) =>
  new Promise<{
    id: string;
    isLender: boolean;
    isBorrower: boolean;
    isSupport: boolean;
    validAccessToken: string;
  }>((resolve) => {
    const request = new JWTMiddlewareInput();
    request.setRefreshToken(refreshToken);
    request.setAccessToken(accessToken);

    client.jwtMiddleware(request, (err, user) => {
      if (err) {
        //Should I return error and unauthorized status code?
        resolve({
          id: "",
          isLender: false,
          isBorrower: false,
          isSupport: false,
          validAccessToken: "",
        });
      } else {
        const id = user.getId();
        const isLender = user.getIsLender();
        const isBorrower = user.getIsBorrower();
        const isSupport = user.getIsSupport();
        const validAccessToken = user.getValidAccessToken();
        resolve({
          id,
          isLender,
          isBorrower,
          isSupport,
          validAccessToken,
        });
      }
    });
  });