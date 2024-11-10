/**
 * @generated SignedSource<<885c71d8206846aa894121c034fe6c7e>>
 * @relayHash 89ac5ac237258866d2fa806bad96d4da
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 89ac5ac237258866d2fa806bad96d4da

import { ConcreteRequest } from 'relay-runtime';
export type SiderFintechUserSubscription$variables = Record<PropertyKey, never>;
export type SiderFintechUserSubscription$data = {
  readonly user_subscribe: {
    readonly accountAvailable: string;
    readonly accountToBePaid: string;
    readonly accountTotal: string;
    readonly accountWithheld: string;
    readonly id: string;
  };
};
export type SiderFintechUserSubscription = {
  response: SiderFintechUserSubscription$data;
  variables: SiderFintechUserSubscription$variables;
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
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "accountWithheld",
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
    "name": "SiderFintechUserSubscription",
    "selections": (v0/*: any*/),
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "SiderFintechUserSubscription",
    "selections": (v0/*: any*/)
  },
  "params": {
    "id": "89ac5ac237258866d2fa806bad96d4da",
    "metadata": {},
    "name": "SiderFintechUserSubscription",
    "operationKind": "subscription",
    "text": null
  }
};
})();

(node as any).hash = "5b30b5f6c54a3b450afddb14f4428b00";

export default node;
