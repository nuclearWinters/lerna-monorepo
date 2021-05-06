import { Channel } from "amqplib";
import { ObjectId, Db } from "mongodb";

export interface Context {
  refreshToken?: string;
  req: {
    app: {
      locals: {
        db: Db;
        ch: Channel;
      };
    };
    headers: { authorization: string | undefined; Cookie?: string };
    body: {
      refreshToken?: string;
    };
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
  accountTotal: number;
  accountAvailable: number;
  error: string;
}

export interface UserMongo {
  _id: ObjectId;
  name: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  RFC: string;
  CURP: string;
  clabe: string;
  mobile: string;
  accountTotal: number;
  accountAvailable: number;
  auth_id: ObjectId;
}

export interface LoanUser {
  _id: string;
  user_id: string;
  score: number;
  rate: number;
  total: number;
  term: number;
  need: number;
  ends: number;
}

export interface LoanMongo {
  _id: ObjectId;
  user_id: ObjectId;
  score: number;
  rate: number;
  total: number;
  term: number;
  need: number;
  ends: number;
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
