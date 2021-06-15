import dotenv from "dotenv";

dotenv.config();

export const MONGO_DB = process.env.MONGO_DB as string;
export const REFRESHSECRET = process.env.REFRESHSECRET as string;
export const ACCESSSECRET = process.env.ACCESSSECRET as string;
export const REDIS = process.env.REDIS as string;
