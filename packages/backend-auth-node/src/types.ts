import type { UUID } from "node:crypto";
import type { Http2ServerRequest, Http2ServerResponse } from "node:http2";
import type { AccountClient } from "@repo/grpc-utils/protoAccount/account_grpc_pb";
import type { AuthUserLogins, AuthUserMongo, AuthUserSessions } from "@repo/mongo-utils";
import type { RedisClientType } from "@repo/redis-utils";
import type { Collection } from "mongodb";

export interface Context {
  authusers: Collection<AuthUserMongo>;
  logins: Collection<AuthUserLogins>;
  sessions: Collection<AuthUserSessions>;
  rdb: RedisClientType;
  accessToken?: string;
  refreshToken?: string;
  validAccessToken?: string;
  id?: UUID;
  ip?: string;
  userAgent: string;
  req: Http2ServerRequest;
  res: Http2ServerResponse;
  grpcClient: AccountClient;
}
