import { ObjectId } from "mongodb";
import { createClient } from "redis";

export type RedisClientType = ReturnType<typeof createClient>;

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

export interface DecodeJWT {
  id: string;
  isLender: boolean;
  isBorrower: boolean;
  isSupport: boolean;
  iat: number;
  exp: number;
  refreshTokenExpireTime: number;
}

export interface UserMongo {
  account_available: number;
  account_to_be_paid: number;
  account_total: number;
  account_withheld: number;
  id: string;
}