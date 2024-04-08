/**
 * @generated SignedSource<<a67c057b643eb6a6bd9e1476b934ff9c>>
 * @relayHash 36feabd5eb31b52eb1997e88d5b1ef95
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 36feabd5eb31b52eb1997e88d5b1ef95

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type SiderUserSubscription$variables = Record<PropertyKey, never>;
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
    "id": "36feabd5eb31b52eb1997e88d5b1ef95",
    "metadata": {},
    "name": "SiderUserSubscription",
    "operationKind": "subscription",
    "text": null
  }
};
})();

(node as any).hash = "85a803b2ed8e1843d49671ef29fc2aaa";

export default node;
