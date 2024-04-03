/**
 * @generated SignedSource<<bf92688f3b4b24ee5bc5721c78d0f42d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type LoanStatus = "FINANCING" | "PAID" | "PAST_DUE" | "TO_BE_PAID" | "WAITING_FOR_APPROVAL" | "%future added value";
export type ApproveLoansSubscription$variables = {
  connections: ReadonlyArray<string>;
};
export type ApproveLoansSubscription$data = {
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
export type ApproveLoansSubscription = {
  response: ApproveLoansSubscription$data;
  variables: ApproveLoansSubscription$variables;
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
    "name": "ApproveLoansSubscription",
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
    "name": "ApproveLoansSubscription",
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
    "cacheID": "a919af1777803c1464b7a0d98bf987c0",
    "id": null,
    "metadata": {},
    "name": "ApproveLoansSubscription",
    "operationKind": "subscription",
    "text": "subscription ApproveLoansSubscription {\n  my_loans_subscribe_insert {\n    node {\n      id\n      user_id\n      score\n      ROI\n      goal\n      term\n      raised\n      expiry\n      status\n      pending\n      pendingCents\n    }\n    cursor\n  }\n}\n"
  }
};
})();

(node as any).hash = "fd49da0744c0136fa27f77c93987b926";

export default node;
