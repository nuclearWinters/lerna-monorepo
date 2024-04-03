/**
 * @generated SignedSource<<f0dc71faed156a2b018086a580a988e7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type LoanStatus = "FINANCING" | "PAID" | "PAST_DUE" | "TO_BE_PAID" | "WAITING_FOR_APPROVAL" | "%future added value";
export type MyLoansQueriesSubscription$variables = {
  connections: ReadonlyArray<string>;
};
export type MyLoansQueriesSubscription$data = {
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
export type MyLoansQueriesSubscription = {
  response: MyLoansQueriesSubscription$data;
  variables: MyLoansQueriesSubscription$variables;
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
    "name": "MyLoansQueriesSubscription",
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
    "name": "MyLoansQueriesSubscription",
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
    "cacheID": "bfbfc37c9c411a2c279405917b8a8bb5",
    "id": null,
    "metadata": {},
    "name": "MyLoansQueriesSubscription",
    "operationKind": "subscription",
    "text": "subscription MyLoansQueriesSubscription {\n  my_loans_subscribe_insert {\n    node {\n      id\n      user_id\n      score\n      ROI\n      goal\n      term\n      raised\n      expiry\n      status\n      pending\n      pendingCents\n    }\n    cursor\n  }\n}\n"
  }
};
})();

(node as any).hash = "40019651cbd76df751ddb0ec2d57a7cd";

export default node;
