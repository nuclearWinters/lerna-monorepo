import { RedisPubSub } from "graphql-redis-subscriptions";
import { Redis } from "ioredis";
import { REDIS } from "@lerna-monorepo/backend-utilities/config";

const retryStrategy = (times: number) => {
  return Math.min(times * 50, 2000);
};

export const pubsub = new RedisPubSub({
  publisher: new Redis(REDIS, { retryStrategy }),
  subscriber: new Redis(REDIS, { retryStrategy }),
});

export const LOAN_INSERT = "LOAN_INSERT";
export const MY_LOAN_INSERT = "MY_LOAN_INSERT";
export const TRANSACTION_INSERT = "TRANSACTION_INSERT";
export const INVESTMENT_INSERT = "INVESTMENT_INSERT";
export const USER = "USER";
export const INVESTMENT_UPDATE = "INVESTMENT_UPDATE";
export const LOAN_UPDATE = "LOAN_UPDATE";
