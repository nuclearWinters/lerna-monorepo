/**
 * @generated SignedSource<<68be21fef8c22f55c0f6fd7be400d736>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type SiderUserSubscription$variables = {};
export type SiderUserSubscription$data = {
  readonly user_subscribe: {
    readonly accountAvailable: string;
    readonly accountToBePaid: string;
    readonly accountTotal: string;
    readonly id: string;
  };
};
export type SiderUserSubscription = {
  response: SiderUserSubscription$data;
  variables: SiderUserSubscription$variables;
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
    "name": "SiderUserSubscription",
    "selections": (v0/*: any*/),
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "SiderUserSubscription",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "36feabd5eb31b52eb1997e88d5b1ef95",
    "id": null,
    "metadata": {},
    "name": "SiderUserSubscription",
    "operationKind": "subscription",
    "text": "subscription SiderUserSubscription {\n  user_subscribe {\n    id\n    accountAvailable\n    accountToBePaid\n    accountTotal\n  }\n}\n"
  }
};
})();

(node as any).hash = "85a803b2ed8e1843d49671ef29fc2aaa";

export default node;
