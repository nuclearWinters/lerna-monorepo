/**
 * @generated SignedSource<<06f2ced33b575959b0973621a90457c0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type TransactionType = "COLLECT" | "CREDIT" | "INVEST" | "WITHDRAWAL" | "%future added value";
export type MyTransactionsTransactionsSubscription$variables = {
  connections: ReadonlyArray<string>;
};
export type MyTransactionsTransactionsSubscription$data = {
  readonly transactions_subscribe_insert: {
    readonly cursor: string;
    readonly node: {
      readonly _id_loan: string | null;
      readonly created: Int;
      readonly id: string;
      readonly id_borrower: string | null;
      readonly id_user: string;
      readonly quantity: string;
      readonly type: TransactionType;
    } | null;
  };
};
export type MyTransactionsTransactionsSubscription = {
  response: MyTransactionsTransactionsSubscription$data;
  variables: MyTransactionsTransactionsSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "connections"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "concreteType": "TransactionEdge",
  "kind": "LinkedField",
  "name": "transactions_subscribe_insert",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Transaction",
      "kind": "LinkedField",
      "name": "node",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "id",
          "storageKey": null
        },
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
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "type",
          "storageKey": null
        },
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
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "MyTransactionsTransactionsSubscription",
    "selections": [
      (v1/*: any*/)
    ],
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MyTransactionsTransactionsSubscription",
    "selections": [
      (v1/*: any*/),
      {
        "alias": null,
        "args": null,
        "filters": null,
        "handle": "prependEdge",
        "key": "",
        "kind": "LinkedHandle",
        "name": "transactions_subscribe_insert",
        "handleArgs": [
          {
            "kind": "Variable",
            "name": "connections",
            "variableName": "connections"
          }
        ]
      }
    ]
  },
  "params": {
    "cacheID": "1f34c64894d811c59a9404bc69eeca01",
    "id": null,
    "metadata": {},
    "name": "MyTransactionsTransactionsSubscription",
    "operationKind": "subscription",
    "text": "subscription MyTransactionsTransactionsSubscription {\n  transactions_subscribe_insert {\n    node {\n      id\n      id_user\n      id_borrower\n      _id_loan\n      type\n      quantity\n      created\n    }\n    cursor\n  }\n}\n"
  }
};
})();

(node as any).hash = "441ea34e3c9bb224bfbdfbb5c824555b";

export default node;
