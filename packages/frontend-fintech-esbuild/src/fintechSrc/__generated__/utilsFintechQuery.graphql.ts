/**
 * @generated SignedSource<<706a6a35847c1635e823de771fd99c39>>
 * @relayHash 4c2f9c3a8c4d01b00ca3c5981806271f
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 4c2f9c3a8c4d01b00ca3c5981806271f

import { ConcreteRequest } from 'relay-runtime';
export type utilsFintechQuery$variables = Record<PropertyKey, never>;
export type utilsFintechQuery$data = {
  readonly user: {
    readonly accountAvailable: string;
    readonly accountTotal: string;
    readonly id: string;
  } | null | undefined;
};
export type utilsFintechQuery = {
  response: utilsFintechQuery$data;
  variables: utilsFintechQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
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
    "name": "utilsFintechQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "utilsFintechQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "id": "4c2f9c3a8c4d01b00ca3c5981806271f",
    "metadata": {},
    "name": "utilsFintechQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "26e3225a8533ba013cb72697fe693af6";

import { PreloadableQueryRegistry } from 'relay-runtime';
PreloadableQueryRegistry.set(node.params.id, node);

export default node;
