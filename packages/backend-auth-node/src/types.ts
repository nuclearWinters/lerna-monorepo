import { ObjectId, Collection } from "mongodb";
import { Http2ServerRequest, Http2ServerResponse } from "node:http2";
import { RedisClientType, UUID } from "@lerna-monorepo/backend-utilities/types";
import { AccountClient } from "@lerna-monorepo/backend-utilities/protoAccount/account_grpc_pb";

export interface Context {
  authusers: Collection<UserMongo>;
  logins: Collection<UserLogins>;
  sessions: Collection<UserSessions>;
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

export interface UserLogins {
  _id?: ObjectId;
  applicationName: "Lerna Monorepo";
  time: Date;
  address: string;
  userId: UUID;
}

export interface UserSessions {
  _id?: ObjectId;
  applicationName: "Lerna Monorepo";
  deviceOS: string;
  deviceBrowser: string;
  address: string;
  lastTimeAccessed: Date;
  userId: UUID;
  refreshToken: string;
  expirationDate: Date;
}

export interface UserMongo {
  email: string;
  password: string;
  isLender: boolean;
  isBorrower: boolean;
  isSupport: boolean;
  language: "es" | "en" | "default";
  name: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  RFC: string;
  CURP: string;
  clabe: string;
  mobile: string;
  id: UUID;
}
