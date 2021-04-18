import { ObjectId, Collection } from "mongodb";

export interface ModuleDB {
  _id: ObjectId;
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  comments: ObjectId;
}

export interface Context {
  usersCollection: Collection<UserDB>;
}

export interface RootUser {
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
}

export interface UserDB {
  _id: ObjectId;
  username: string;
}
