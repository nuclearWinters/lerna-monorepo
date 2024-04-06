/**
 * @generated SignedSource<<34774d83d5909ffd869169377cf79408>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
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
    "cacheID": "a06f5cec712f9c7d149194a18314cb7c",
    "id": null,
    "metadata": {},
    "name": "AddInvestmentsQueriesUpdateSubscription",
    "operationKind": "subscription",
    "text": "subscription AddInvestmentsQueriesUpdateSubscription(\n  $gid: ID!\n) {\n  loans_subscribe_update(gid: $gid) {\n    id\n    user_id\n    score\n    ROI\n    goal\n    term\n    raised\n    expiry\n    pending\n    pendingCents\n  }\n}\n"
  }
};
})();

(node as any).hash = "5b590b3a0736c21cd9ebda5bd4d02064";

export default node;
