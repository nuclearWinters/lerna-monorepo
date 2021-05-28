import { Channel } from "amqplib";
import { ObjectId, Collection } from "mongodb";

export interface RedisPromises {
  get: (arg1: string) => Promise<string | null>;
  set: (
    arg1: string,
    arg2: string,
    arg3?: "EX",
    arg4?: number
  ) => Promise<unknown>;
  keys: (arg1: string) => Promise<string[]>;
}
export interface Context {
  users: Collection<UserMongo>;
  rdb: RedisPromises;
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
}

export interface DecodeJWT {
  _id: string;
  email: string;
  isLender: boolean;
  isBorrower: boolean;
  isSupport: boolean;
}

export const SIGN_UP = "SIGN_UP";
interface ISignUp {
  queue: typeof SIGN_UP;
  payload: string;
}

export type IMQ = ISignUp;
