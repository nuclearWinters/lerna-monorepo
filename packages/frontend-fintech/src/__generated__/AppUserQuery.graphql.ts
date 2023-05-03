/**
 * @generated SignedSource<<2d76ffe6051960843d0d2d3096156424>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type Languages = "DEFAULT" | "EN" | "ES" | "%future added value";
export type AppUserQuery$variables = {};
export type AppUserQuery$data = {
  readonly authUser: {
    readonly apellidoMaterno: string;
    readonly apellidoPaterno: string;
    readonly id: string;
    readonly isBorrower: boolean;
    readonly isSupport: boolean;
    readonly language: Languages;
    readonly name: string;
  };
  readonly user: {
    readonly accountAvailable: string;
    readonly accountId: string;
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
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "accountId",
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
        "name": "language",
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
    "cacheID": "d6db04581ebd6dca6f89be9068c95db5",
    "id": null,
    "metadata": {},
    "name": "AppUserQuery",
    "operationKind": "query",
    "text": "query AppUserQuery {\n  user {\n    id\n    accountAvailable\n    accountTotal\n    accountId\n  }\n  authUser {\n    id\n    name\n    apellidoPaterno\n    apellidoMaterno\n    language\n    isBorrower\n    isSupport\n  }\n}\n"
  }
};
})();

(node as any).hash = "1fb195b0609e053f1035276d17e57837";

export default node;