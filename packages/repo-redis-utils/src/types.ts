import type { createClient } from "redis";

export type RedisClientType = ReturnType<typeof createClient>;
