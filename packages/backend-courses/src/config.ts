import dotenv from 'dotenv'

dotenv.config();

export const MONGO_DB = process.env.MONGO_DB as string;