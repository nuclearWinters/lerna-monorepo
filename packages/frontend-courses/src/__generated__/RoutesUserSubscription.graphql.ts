/**
 * @generated SignedSource<<c6c205a4910534b6f16394f99d0ae8b4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type RoutesUserSubscription$variables = {
  user_gid: string;
};
export type RoutesUserSubscription$data = {
  readonly user_subscribe: {
    readonly user: {
      readonly accountAvailable: string;
      readonly id: string;
    };
  };
};
export type RoutesUserSubscription = {
  response: RoutesUserSubscription$data;
  variables: RoutesUserSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "user_gid"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "user_gid",
        "variableName": "user_gid"
      }
    ],
    "concreteType": "User_Subscribe",
    "kind": "LinkedField",
    "name": "user_subscribe",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "user",
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
          }
        ],
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
    "name": "RoutesUserSubscription",
    "selections": (v1/*: any*/),
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RoutesUserSubscription",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "a2f9649122e474188da86c0d1bc632e8",
    "id": null,
    "metadata": {},
    "name": "RoutesUserSubscription",
    "operationKind": "subscription",
    "text": "subscription RoutesUserSubscription(\n  $user_gid: ID!\n) {\n  user_subscribe(user_gid: $user_gid) {\n    user {\n      id\n      accountAvailable\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "98bdef7ecc9e2025fc420f196de54918";

export default node;
