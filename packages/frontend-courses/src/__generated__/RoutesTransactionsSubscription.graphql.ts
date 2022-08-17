/**
 * @generated SignedSource<<ec9635fc960e9beaf7cf7b118b151f54>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type SubscribeType = "INSERT" | "UPDATE" | "%future added value";
export type TransactionType = "COLLECT" | "CREDIT" | "INVEST" | "WITHDRAWAL" | "%future added value";
export type RoutesTransactionsSubscription$variables = {
  user_gid: string;
};
export type RoutesTransactionsSubscription$data = {
  readonly transactions_subscribe: {
    readonly transaction_edge: {
      readonly cursor: string;
      readonly node: {
        readonly count: number;
        readonly history: ReadonlyArray<{
          readonly _id_loan: string | null;
          readonly created: Int;
          readonly id: string;
          readonly id_borrower: string | null;
          readonly quantity: string;
          readonly type: TransactionType;
        }>;
        readonly id: string;
        readonly id_user: string;
      } | null;
    };
    readonly type: SubscribeType;
  };
};
export type RoutesTransactionsSubscription = {
  response: RoutesTransactionsSubscription$data;
  variables: RoutesTransactionsSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "user_gid"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "user_gid",
        "variableName": "user_gid"
      }
    ],
    "concreteType": "Transaction_Subscribe",
    "kind": "LinkedField",
    "name": "transactions_subscribe",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "BucketTransactionEdge",
        "kind": "LinkedField",
        "name": "transaction_edge",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "BucketTransaction",
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id_user",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "count",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Transaction",
                "kind": "LinkedField",
                "name": "history",
                "plural": true,
                "selections": [
                  (v1/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "id_borrower",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "_id_loan",
                    "storageKey": null
                  },
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "quantity",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "created",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "cursor",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      (v2/*: any*/)
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RoutesTransactionsSubscription",
    "selections": (v3/*: any*/),
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RoutesTransactionsSubscription",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "69af2f134817c7b00f3f33df9a25132d",
    "id": null,
    "metadata": {},
    "name": "RoutesTransactionsSubscription",
    "operationKind": "subscription",
    "text": "subscription RoutesTransactionsSubscription(\n  $user_gid: ID!\n) {\n  transactions_subscribe(user_gid: $user_gid) {\n    transaction_edge {\n      node {\n        id\n        id_user\n        count\n        history {\n          id\n          id_borrower\n          _id_loan\n          type\n          quantity\n          created\n        }\n      }\n      cursor\n    }\n    type\n  }\n}\n"
  }
};
})();

(node as any).hash = "4ca60a820a3590b5bf86ab46de30df9a";

export default node;
