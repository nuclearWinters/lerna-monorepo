import { ObjectId } from "mongodb";
import { createClient } from "redis";

export type RedisClientType = ReturnType<typeof createClient>;

export type UUID = `${string}-${string}-${string}-${string}-${string}`;

export interface UserLogins {
  _id?: ObjectId;
  applicationName: "Lerna Monorepo";
  time: Date;
  address: string;
  userId: UUID;
}

export interface UserSessions {
  _id?: ObjectId;
  applicationName: "Lerna Monorepo";
  deviceOS: string;
  deviceBrowser: string;
  address: string;
  lastTimeAccessed: Date;
  userId: UUID;
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
  id: UUID;
}

export interface DecodeJWT {
  id: UUID;
  isLender: boolean;
  isBorrower: boolean;
  isSupport: boolean;
  iat: number;
  exp: number;
  refreshTokenExpireTime: number;
}
