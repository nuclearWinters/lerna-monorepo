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
}

export interface LoanMongo {
  _id: ObjectId;
  _id_user: ObjectId;
  score: string;
  ROI: number;
  goal: number;
  term: number;
  raised: number;
  expiry: Date;
}

export interface LendMongo {
  _id: ObjectId;
  _id_borrower: ObjectId;
  _id_lender: ObjectId;
  quantity: number;
  date: Date;
}

export interface DecodeJWT {
  _id: string;
  email: string;
  password: string;
}

export const SIGN_UP = "SIGN_UP";

interface ISignUp {
  queue: typeof SIGN_UP;
  payload: string;
}

export type IMQ = ISignUp;
