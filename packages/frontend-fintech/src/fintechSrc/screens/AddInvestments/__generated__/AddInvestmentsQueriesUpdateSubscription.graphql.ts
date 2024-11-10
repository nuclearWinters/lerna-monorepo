/**
 * @generated SignedSource<<be9ddb742204b23179ff4cd951d7449d>>
 * @relayHash a06f5cec712f9c7d149194a18314cb7c
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID a06f5cec712f9c7d149194a18314cb7c

import { ConcreteRequest } from 'relay-runtime';
export type AddInvestmentsQueriesUpdateSubscription$variables = {
  gid: string;
};
export type AddInvestmentsQueriesUpdateSubscription$data = {
  readonly loans_subscribe_update: {
    readonly ROI: number;
    readonly expiry: Int;
    readonly goal: string;
    readonly id: string;
    readonly pending: string;
    readonly pendingCents: number;
    readonly raised: string;
    readonly score: string;
    readonly term: number;
    readonly user_id: string;
  };
};
export type AddInvestmentsQueriesUpdateSubscription = {
  response: AddInvestmentsQueriesUpdateSubscription$data;
  variables: AddInvestmentsQueriesUpdateSubscription$variables;
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
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AddInvestmentsQueriesUpdateSubscription",
    "selections": (v1/*: any*/),
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AddInvestmentsQueriesUpdateSubscription",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "a06f5cec712f9c7d149194a18314cb7c",
    "metadata": {},
    "name": "AddInvestmentsQueriesUpdateSubscription",
    "operationKind": "subscription",
    "text": null
  }
};
})();

(node as any).hash = "5b590b3a0736c21cd9ebda5bd4d02064";

export default node;
