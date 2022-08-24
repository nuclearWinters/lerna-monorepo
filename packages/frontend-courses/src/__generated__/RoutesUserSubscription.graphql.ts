/**
 * @generated SignedSource<<bd061cc7fafb4090f2b226e03c04500b>>
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
    readonly accountInterests: string;
    readonly accountLent: string;
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
        "name": "accountLent",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "accountInterests",
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
    "cacheID": "64afa8638de18bb70f5a3d79a12113f0",
    "id": null,
    "metadata": {},
    "name": "RoutesUserSubscription",
    "operationKind": "subscription",
    "text": "subscription RoutesUserSubscription {\n  user_subscribe {\n    id\n    accountAvailable\n    accountLent\n    accountInterests\n    accountTotal\n  }\n}\n"
  }
};
})();

(node as any).hash = "30003678222e3207ce0f81de102ff7c5";

export default node;
