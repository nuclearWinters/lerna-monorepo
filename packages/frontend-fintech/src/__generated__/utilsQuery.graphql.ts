/**
 * @generated SignedSource<<0d86f4e2333b2b7633f7637b68e9299f>>
 * @relayHash 188368d4c2601c8df1e6389ffd334a40
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 188368d4c2601c8df1e6389ffd334a40

import { ConcreteRequest, Query } from 'relay-runtime';
export type Languages = "EN" | "ES" | "%future added value";
export type utilsQuery$variables = Record<PropertyKey, never>;
export type utilsQuery$data = {
  readonly authUser: {
    readonly CURP: string;
    readonly RFC: string;
    readonly apellidoMaterno: string;
    readonly apellidoPaterno: string;
    readonly clabe: string;
    readonly email: string;
    readonly id: string;
    readonly isBorrower: boolean;
    readonly isLender: boolean;
    readonly isSupport: boolean;
    readonly language: Languages;
    readonly mobile: string;
    readonly name: string;
  } | null | undefined;
  readonly user: {
    readonly accountAvailable: string;
    readonly accountTotal: string;
    readonly id: string;
  } | null | undefined;
};
export type utilsQuery = {
  response: utilsQuery$data;
  variables: utilsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "user",
    "plural": false,
    "selections": [
      (v0/*: any*/),
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
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "AuthUser",
    "kind": "LinkedField",
    "name": "authUser",
    "plural": false,
    "selections": [
      (v0/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "apellidoPaterno",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "apellidoMaterno",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "RFC",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "CURP",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "clabe",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "mobile",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "isLender",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "isBorrower",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "isSupport",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "language",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "email",
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
    "name": "utilsQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "utilsQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "188368d4c2601c8df1e6389ffd334a40",
    "metadata": {},
    "name": "utilsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "d4cdbeffcb2002b79d3444e39408d2e5";

require('relay-runtime').PreloadableQueryRegistry.set(node.params.id, node);

export default node;
