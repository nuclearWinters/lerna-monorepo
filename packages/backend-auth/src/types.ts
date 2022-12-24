import { CookieOptions } from "express";
import { ObjectId, Collection } from "mongodb";
import { createClient } from "redis";

export type RedisClientType = ReturnType<typeof createClient>;

export interface Context {
  users: Collection<UserMongo>;
  rdb: RedisClientType;
  accessToken?: string;
  refreshToken?: string;
  res: {
    cookie: (name: string, val: string, options: CookieOptions) => void;
    clearCookie: (name: string, options?: CookieOptions | undefined) => void;
    setHeader: (key: string, value: string) => void;
  };
  validAccessToken?: string;
  id?: string;
}

export interface UserMongo {
  _id?: ObjectId;
  email: string;
  password: string;
  isLender: boolean;
  isBorrower: boolean;
  isSupport: boolean;
  language: "es" | "en" | "default";
  name: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  RFC: string;
  CURP: string;
  clabe: string;
  mobile: string;
  id: string;
}

export interface DecodeJWT {
  id: string;
  isLender: boolean;
  isBorrower: boolean;
  isSupport: boolean;
  iat: number;
  exp: number;
  refreshTokenExpireTime: number;
}
