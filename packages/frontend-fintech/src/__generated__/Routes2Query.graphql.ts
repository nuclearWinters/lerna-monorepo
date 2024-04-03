/**
 * @generated SignedSource<<3717565c56b6cab8de15b331a978d1e8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type Languages = "DEFAULT" | "EN" | "ES" | "%future added value";
export type Routes2Query$variables = Record<PropertyKey, never>;
export type Routes2Query$data = {
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
export type Routes2Query = {
  response: Routes2Query$data;
  variables: Routes2Query$variables;
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
    "name": "Routes2Query",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "Routes2Query",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "14b16e8f58e0135e2028c03ba38ff0e2",
    "id": null,
    "metadata": {},
    "name": "Routes2Query",
    "operationKind": "query",
    "text": "query Routes2Query {\n  user {\n    id\n    accountAvailable\n    accountTotal\n  }\n  authUser {\n    id\n    name\n    apellidoPaterno\n    apellidoMaterno\n    RFC\n    CURP\n    clabe\n    mobile\n    isLender\n    isBorrower\n    isSupport\n    language\n    email\n  }\n}\n"
  }
};
})();

(node as any).hash = "b93cf8ed01a4bbfeba4a6f1efd0cafc0";

export default node;
