/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type SubscribeType = "INSERT" | "UPDATE" | "%future added value";
export type TransactionType = "CREDIT" | "INVEST" | "WITHDRAWAL" | "%future added value";
export type RoutesTransactionsSubscriptionVariables = {
    user_gid: string;
};
export type RoutesTransactionsSubscriptionResponse = {
    readonly transactions_subscribe: {
        readonly transaction_edge: {
            readonly node: {
                readonly id: string;
                readonly _id_user: string;
                readonly count: number;
                readonly history: ReadonlyArray<{
                    readonly id: string;
                    readonly _id_borrower: string | null;
                    readonly _id_loan: string | null;
                    readonly type: TransactionType;
                    readonly quantity: string;
                    readonly created: number;
                }>;
            } | null;
            readonly cursor: string;
        };
        readonly type: SubscribeType;
    };
};
export type RoutesTransactionsSubscription = {
    readonly response: RoutesTransactionsSubscriptionResponse;
    readonly variables: RoutesTransactionsSubscriptionVariables;
};



/*
subscription RoutesTransactionsSubscription(
  $user_gid: ID!
) {
  transactions_subscribe(user_gid: $user_gid) {
    transaction_edge {
      node {
        id
        _id_user
        count
        history {
          id
          _id_borrower
          _id_loan
          type
          quantity
          created
        }
      }
      cursor
    }
    type
  }
}
*/

const node: ConcreteRequest = (function () {
    var v0 = [
        {
            "defaultValue": null,
            "kind": "LocalArgument",
            "name": "user_gid"
        } as any
    ], v1 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
    } as any, v2 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "type",
        "storageKey": null
    } as any, v3 = [
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
                                (v1 /*: any*/),
                                {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "_id_user",
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
                                        (v1 /*: any*/),
                                        {
                                            "alias": null,
                                            "args": null,
                                            "kind": "ScalarField",
                                            "name": "_id_borrower",
                                            "storageKey": null
                                        },
                                        {
                                            "alias": null,
                                            "args": null,
                                            "kind": "ScalarField",
                                            "name": "_id_loan",
                                            "storageKey": null
                                        },
                                        (v2 /*: any*/),
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
                (v2 /*: any*/)
            ],
            "storageKey": null
        } as any
    ];
    return {
        "fragment": {
            "argumentDefinitions": (v0 /*: any*/),
            "kind": "Fragment",
            "metadata": null,
            "name": "RoutesTransactionsSubscription",
            "selections": (v3 /*: any*/),
            "type": "Subscription",
            "abstractKey": null
        },
        "kind": "Request",
        "operation": {
            "argumentDefinitions": (v0 /*: any*/),
            "kind": "Operation",
            "name": "RoutesTransactionsSubscription",
            "selections": (v3 /*: any*/)
        },
        "params": {
            "cacheID": "0febc3f254d092d2491e90718b447b37",
            "id": null,
            "metadata": {},
            "name": "RoutesTransactionsSubscription",
            "operationKind": "subscription",
            "text": "subscription RoutesTransactionsSubscription(\n  $user_gid: ID!\n) {\n  transactions_subscribe(user_gid: $user_gid) {\n    transaction_edge {\n      node {\n        id\n        _id_user\n        count\n        history {\n          id\n          _id_borrower\n          _id_loan\n          type\n          quantity\n          created\n        }\n      }\n      cursor\n    }\n    type\n  }\n}\n"
        }
    } as any;
})();
(node as any).hash = '13cd67a52739535eb1c5dc76a657846f';
export default node;
