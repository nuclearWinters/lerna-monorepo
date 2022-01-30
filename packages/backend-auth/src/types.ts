import { Channel } from "amqplib";
import { ObjectId, Collection } from "mongodb";
import { createClient } from "redis";

export type RedisClientType = ReturnType<typeof createClient>;

export interface Context {
  users: Collection<UserMongo>;
  rdb: RedisClientType;
  accessToken?: string;
  ch: Channel;
  refreshToken?: string;
}

export interface UserMongo {
  _id: ObjectId;
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
}

export interface DecodeJWT {
  _id: string;
  isLender: boolean;
  isBorrower: boolean;
  isSupport: boolean;
}

export const SIGN_UP = "SIGN_UP";
