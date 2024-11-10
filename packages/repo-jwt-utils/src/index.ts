import jsonwebtoken, { SignOptions } from "jsonwebtoken";
import { DecodeJWT } from "./types";
import {
  REFRESH_TOKEN_EXP_NUMBER,
  ACCESS_TOKEN_EXP_NUMBER,
  REFRESHSECRET,
  ACCESSSECRET,
} from "@repo/utils/config";
import { UUID } from "@repo/utils/types";

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

export const getValidTokens = ({
  isBorrower,
  isLender,
  isSupport,
  id,
  invalidAccessToken,
  invalidRefreshToken,
}: {
  isBorrower: boolean;
  isLender: boolean;
  isSupport: boolean;
  id: UUID;
  invalidAccessToken?: boolean;
  invalidRefreshToken?: boolean;
}): { refreshToken: string; accessToken: string } => {
  const now = new Date();
  now.setMilliseconds(0);
  const refreshTokenExpireTime =
    now.getTime() / 1000 +
    (invalidRefreshToken ? -1 : REFRESH_TOKEN_EXP_NUMBER);
  const accessTokenExpireTime =
    now.getTime() / 1000 + (invalidAccessToken ? -1 : ACCESS_TOKEN_EXP_NUMBER);
  const refreshToken = jwt.sign(
    {
      id,
      isBorrower,
      isLender,
      isSupport,
      refreshTokenExpireTime,
      exp: refreshTokenExpireTime,
    },
    REFRESHSECRET
  );
  const accessToken = jwt.sign(
    {
      id,
      isBorrower,
      isLender,
      isSupport,
      refreshTokenExpireTime,
      exp: accessTokenExpireTime,
    },
    ACCESSSECRET
  );
  return {
    refreshToken,
    accessToken,
  };
};
