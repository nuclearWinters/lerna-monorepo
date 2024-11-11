import { RedisPubSub } from "graphql-redis-subscriptions";
import type { Producer } from "kafkajs";
import type { Collection } from "mongodb";
import type {
  FintechUserMongo,
  LoanMongo,
  InvestmentMongo,
  ScheduledPaymentsMongo,
  RecordsMongo,
  TransactionMongo,
} from "@repo/mongo-utils";
import type { UUID } from "node:crypto";

export interface Context {
  users: Collection<FintechUserMongo>;
  loans: Collection<LoanMongo>;
  investments: Collection<InvestmentMongo>;
  transactions: Collection<TransactionMongo>;
  scheduledPayments: Collection<ScheduledPaymentsMongo>;
  records: Collection<RecordsMongo>;
  accessToken: string | undefined;
  refreshToken: string | undefined;
  id?: UUID;
  validAccessToken?: string;
  isBorrower: boolean;
  isSupport: boolean;
  isLender: boolean;
  logins?: unknown;
  authusers?: unknown;
  sessions?: unknown;
  producer: Producer;
  pubsub: RedisPubSub;
}
