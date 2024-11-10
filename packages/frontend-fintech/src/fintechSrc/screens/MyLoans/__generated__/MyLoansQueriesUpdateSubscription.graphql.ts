/**
 * @generated SignedSource<<00d0f1e313e297eea9174afa31c1f724>>
 * @relayHash 59674507b30834ca927cfdf553a4f403
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 59674507b30834ca927cfdf553a4f403

import { ConcreteRequest } from 'relay-runtime';
export type LoanStatus = "FINANCING" | "PAID" | "PAST_DUE" | "TO_BE_PAID" | "WAITING_FOR_APPROVAL" | "%future added value";
export type MyLoansQueriesUpdateSubscription$variables = {
  gid: string;
};
export type MyLoansQueriesUpdateSubscription$data = {
  readonly loans_subscribe_update: {
    readonly ROI: number;
    readonly expiry: Int;
    readonly goal: string;
    readonly id: string;
    readonly pending: string;
    readonly raised: string;
    readonly score: string;
    readonly status: LoanStatus;
    readonly term: number;
    readonly user_id: string;
  };
};
export type MyLoansQueriesUpdateSubscription = {
  response: MyLoansQueriesUpdateSubscription$data;
  variables: MyLoansQueriesUpdateSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "gid"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "gid",
        "variableName": "gid"
      }
    ],
    "concreteType": "Loan",
    "kind": "LinkedField",
    "name": "loans_subscribe_update",
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
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "MyLoansQueriesUpdateSubscription",
    "selections": (v1/*: any*/),
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MyLoansQueriesUpdateSubscription",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "59674507b30834ca927cfdf553a4f403",
    "metadata": {},
    "name": "MyLoansQueriesUpdateSubscription",
    "operationKind": "subscription",
    "text": null
  }
};
})();

(node as any).hash = "1026448f6c138832d07b1bf625c4087d";

export default node;
