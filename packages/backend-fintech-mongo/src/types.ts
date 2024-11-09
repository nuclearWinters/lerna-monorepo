import { UUID } from "@repo/utils/types";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { Producer } from "kafkajs";
import { Collection } from "mongodb";
import {
  FintechUserMongo,
  LoanMongo,
  InvestmentMongo,
  ScheduledPaymentsMongo,
  RecordsMongo,
  TransactionMongo,
} from "@repo/mongo-utils/types";

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
