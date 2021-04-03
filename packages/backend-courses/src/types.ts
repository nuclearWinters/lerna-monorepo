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
  username: string;
}

export interface UserDB {
  _id: ObjectId;
  username: string;
}
