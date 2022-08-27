/**
 * @generated SignedSource<<4190435f99a34182f039a17891ed458c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type RoutesUserSubscription$variables = {};
export type RoutesUserSubscription$data = {
  readonly user_subscribe: {
    readonly accountAvailable: string;
    readonly accountToBePaid: string;
    readonly accountTotal: string;
    readonly id: string;
  };
};
export type RoutesUserSubscription = {
  response: RoutesUserSubscription$data;
  variables: RoutesUserSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "user_subscribe",
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
        "name": "accountAvailable",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "accountToBePaid",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "accountTotal",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "RoutesUserSubscription",
    "selections": (v0/*: any*/),
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "RoutesUserSubscription",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "85cbcadf8c1e71fab472eb8967abc241",
    "id": null,
    "metadata": {},
    "name": "RoutesUserSubscription",
    "operationKind": "subscription",
    "text": "subscription RoutesUserSubscription {\n  user_subscribe {\n    id\n    accountAvailable\n    accountToBePaid\n    accountTotal\n  }\n}\n"
  }
};
})();

(node as any).hash = "c4d643e32aa71c0df35835b95c6f0b55";

export default node;
