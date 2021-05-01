import { Channel } from "amqplib";
import { ObjectId, Db } from "mongodb";

export interface Context {
  req: {
    app: {
      locals: {
        db: Db;
        ch: Channel;
      };
    };
    headers: { authorization: string | undefined };
  };
}
export interface RootUser {
  _id: string;
  name: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  RFC: string;
  CURP: string;
  clabe: string;
  mobile: string;
  email: string;
  password: string;
  accountTotal: number;
  accountAvailable: number;
  error: string;
}

export interface UserMongo {
  _id: ObjectId;
  username: string;
}

export interface DecodeJWT {
  _id: string;
  email: string;
  password: string;
}

export const RENEW_ACCESS_TOKEN = "RENEW_ACCESS_TOKEN";

interface IRenewAccessToken {
  queue: typeof RENEW_ACCESS_TOKEN;
  payload: string;
}

export type IMQ = IRenewAccessToken;
