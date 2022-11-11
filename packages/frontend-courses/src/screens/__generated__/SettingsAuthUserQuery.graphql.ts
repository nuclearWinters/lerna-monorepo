/**
 * @generated SignedSource<<30c7697f5ed1daab5b50eda98da2302e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type Languages = "DEFAULT" | "EN" | "ES" | "%future added value";
export type SettingsAuthUserQuery$variables = {};
export type SettingsAuthUserQuery$data = {
  readonly authUser: {
    readonly CURP: string;
    readonly RFC: string;
    readonly accountId: string;
    readonly apellidoMaterno: string;
    readonly apellidoPaterno: string;
    readonly clabe: string;
    readonly email: string;
    readonly id: string;
    readonly language: Languages;
    readonly mobile: string;
    readonly name: string;
  };
};
export type SettingsAuthUserQuery = {
  response: SettingsAuthUserQuery$data;
  variables: SettingsAuthUserQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "AuthUser",
    "kind": "LinkedField",
    "name": "authUser",
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
        "name": "accountId",
        "storageKey": null
      },
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
        "name": "email",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "language",
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
    "name": "SettingsAuthUserQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "SettingsAuthUserQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "2062f30429bc946054211187bf3db40f",
    "id": null,
    "metadata": {},
    "name": "SettingsAuthUserQuery",
    "operationKind": "query",
    "text": "query SettingsAuthUserQuery {\n  authUser {\n    id\n    accountId\n    name\n    apellidoPaterno\n    apellidoMaterno\n    RFC\n    CURP\n    clabe\n    mobile\n    email\n    language\n  }\n}\n"
  }
};
})();

(node as any).hash = "3a5254a34b969bb3ea1e3ca71358e74b";

export default node;
