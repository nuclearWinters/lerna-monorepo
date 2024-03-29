/**
 * @generated SignedSource<<6b18733b28836a4bf5de6719588c4499>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type Languages = "DEFAULT" | "EN" | "ES" | "%future added value";
export type AppUserQuery$variables = Record<PropertyKey, never>;
export type AppUserQuery$data = {
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
  };
  readonly user: {
    readonly accountAvailable: string;
    readonly accountTotal: string;
    readonly id: string;
  };
};
export type AppUserQuery = {
  response: AppUserQuery$data;
  variables: AppUserQuery$variables;
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
    "name": "AppUserQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "AppUserQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "f9818f0933393e14439cfbd07c8b0afb",
    "id": null,
    "metadata": {},
    "name": "AppUserQuery",
    "operationKind": "query",
    "text": "query AppUserQuery {\n  user {\n    id\n    accountAvailable\n    accountTotal\n  }\n  authUser {\n    id\n    name\n    apellidoPaterno\n    apellidoMaterno\n    RFC\n    CURP\n    clabe\n    mobile\n    isLender\n    isBorrower\n    isSupport\n    language\n    email\n  }\n}\n"
  }
};
})();

(node as any).hash = "22725bc677dd548269be807a00910213";

export default node;
