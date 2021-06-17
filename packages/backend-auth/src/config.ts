import dotenv from "dotenv";

dotenv.config();

export const MONGO_DB = process.env.MONGO_DB;
export const REFRESHSECRET = process.env.REFRESHSECRET;
export const ACCESSSECRET = process.env.ACCESSSECRET;
export const REDIS = process.env.REDIS;
