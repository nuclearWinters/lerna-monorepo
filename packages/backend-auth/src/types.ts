import { ObjectId, Collection } from "mongodb";

export interface Context {
  users: Collection<UserMongo>;
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
