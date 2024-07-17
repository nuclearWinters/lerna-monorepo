import { ObjectId, Collection } from "mongodb";
import { createClient } from "redis";
import { Request } from "graphql-sse";
import { Http2ServerRequest, Http2ServerResponse } from "http2";

export type RedisClientType = ReturnType<typeof createClient>;

export interface Context {
  authusers: Collection<UserMongo>;
  logins: Collection<UserLogins>;
  sessions: Collection<UserSessions>;
  rdb: RedisClientType;
  accessToken?: string;
  refreshToken?: string;
  validAccessToken?: string;
  id?: string;
  ip?: string;
  deviceType: string;
  deviceName: string;
  req: Request<Http2ServerRequest, { res: Http2ServerResponse }>;
}

export interface UserLogins {
  _id?: ObjectId;
  applicationName: "Lerna Monorepo";
  time: Date;
  address: string;
  userId: string;
}

export interface UserSessions {
  _id?: ObjectId;
  applicationName: "Lerna Monorepo";
  type: string;
  deviceName: string;
  address: string;
  lastTimeAccessed: Date;
  userId: string;
  refreshToken: string;
  expirationDate: Date;
}

export interface UserMongo {
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
