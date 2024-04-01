/**
 * @generated SignedSource<<62f10af5cea59f7e8c46042e7c575ef7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type LoanStatus = "FINANCING" | "PAID" | "PAST_DUE" | "TO_BE_PAID" | "WAITING_FOR_APPROVAL" | "%future added value";
export type MyLoansMyLoansSubscription$variables = {
  connections: ReadonlyArray<string>;
};
export type MyLoansMyLoansSubscription$data = {
  readonly my_loans_subscribe_insert: {
    readonly cursor: string;
    readonly node: {
      readonly ROI: number;
      readonly expiry: Int;
      readonly goal: string;
      readonly id: string;
      readonly pending: string;
      readonly pendingCents: number;
      readonly raised: string;
      readonly score: string;
      readonly status: LoanStatus;
      readonly term: number;
      readonly user_id: string;
    } | null | undefined;
  };
};
export type MyLoansMyLoansSubscription = {
  response: MyLoansMyLoansSubscription$data;
  variables: MyLoansMyLoansSubscription$variables;
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
  "concreteType": "LoanEdge",
  "kind": "LinkedField",
  "name": "my_loans_subscribe_insert",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Loan",
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
          "name": "user_id",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "score",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "ROI",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "goal",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "term",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "raised",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "expiry",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "status",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "pending",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "pendingCents",
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
    "name": "MyLoansMyLoansSubscription",
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
    "name": "MyLoansMyLoansSubscription",
    "selections": [
      (v1/*: any*/),
      {
        "alias": null,
        "args": null,
        "filters": null,
        "handle": "prependEdge",
        "key": "",
        "kind": "LinkedHandle",
        "name": "my_loans_subscribe_insert",
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
    "cacheID": "6bc3d2073efef3efd4a4df619d0ec638",
    "id": null,
    "metadata": {},
    "name": "MyLoansMyLoansSubscription",
    "operationKind": "subscription",
    "text": "subscription MyLoansMyLoansSubscription {\n  my_loans_subscribe_insert {\n    node {\n      id\n      user_id\n      score\n      ROI\n      goal\n      term\n      raised\n      expiry\n      status\n      pending\n      pendingCents\n    }\n    cursor\n  }\n}\n"
  }
};
})();

(node as any).hash = "be42e0b4919853f3ba3ac622a0f67707";

export default node;
