import { Db, Collection } from "mongodb";
import { UserMongo } from "./types";

export const getContext = (req: {
  app: {
    locals: {
      db: Db;
    };
  };
}): {
  users: Collection<UserMongo>;
} => {
  const db = req.app.locals.db;
  return {
    users: db.collection<UserMongo>("users"),
  };
};
