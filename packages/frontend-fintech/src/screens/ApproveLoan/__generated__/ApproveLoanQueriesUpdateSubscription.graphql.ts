/**
 * @generated SignedSource<<ef0f7d1c50924162b41dfe060d9be894>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type ApproveLoanQueriesUpdateSubscription$variables = {
  gid: string;
};
export type ApproveLoanQueriesUpdateSubscription$data = {
  readonly loans_subscribe_update: {
    readonly ROI: number;
    readonly expiry: Int;
    readonly goal: string;
    readonly id: string;
    readonly pending: string;
    readonly raised: string;
    readonly score: string;
    readonly term: number;
    readonly user_id: string;
  };
};
export type ApproveLoanQueriesUpdateSubscription = {
  response: ApproveLoanQueriesUpdateSubscription$data;
  variables: ApproveLoanQueriesUpdateSubscription$variables;
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
    "name": "ApproveLoanQueriesUpdateSubscription",
    "selections": (v1/*: any*/),
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ApproveLoanQueriesUpdateSubscription",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "a81fae9077e9217e6f447b7bf7f9b08f",
    "id": null,
    "metadata": {},
    "name": "ApproveLoanQueriesUpdateSubscription",
    "operationKind": "subscription",
    "text": "subscription ApproveLoanQueriesUpdateSubscription(\n  $gid: ID!\n) {\n  loans_subscribe_update(gid: $gid) {\n    id\n    user_id\n    score\n    ROI\n    goal\n    term\n    raised\n    expiry\n    pending\n  }\n}\n"
  }
};
})();

(node as any).hash = "ced2c011fcb4910bf75ccc1040194b13";

export default node;
