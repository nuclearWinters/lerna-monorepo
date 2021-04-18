import { ObjectId, Db } from "mongodb";

export interface Context {
  req: {
    app: {
      locals: {
        db: Db;
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
  password: string;
}
