import { TransactionMongo, UserMongo } from "../types";
import { base64 } from "../utils";
import { pubsub, USER, TRANSACTION_INSERT } from "./subscriptions";

export const publishUser = (user: UserMongo) => {
  pubsub.publish(USER, {
    user_subscribe: user,
  });
};

export const publishTransactionInsert = (transaction: TransactionMongo) => {
  pubsub.publish(TRANSACTION_INSERT, {
    transactions_subscribe_insert: {
      node: transaction,
      cursor: base64(transaction._id?.toHexString() || ""),
    },
  });
};
