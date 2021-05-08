import { Channel } from "amqplib";
import { ObjectId, Db } from "mongodb";

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
  req: {
    headers: {
      authorization: string | undefined;
    };
    app: {
      locals: {
        db: Db;
        rdb: RedisPromises;
        ch: Channel;
      };
    };
  };
}

export interface UserMongo {
  _id: ObjectId;
  email: string;
  password: string;
}

export interface DecodeJWT {
  _id: string;
  email: string;
}

export const SIGN_UP = "SIGN_UP";
interface ISignUp {
  queue: typeof SIGN_UP;
  payload: string;
}

export type IMQ = ISignUp;
