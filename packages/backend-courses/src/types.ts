import { ObjectId, Db } from "mongodb";

export interface Context {
  req: {
    app: {
      locals: {
        db: Db;
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
