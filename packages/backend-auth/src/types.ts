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
