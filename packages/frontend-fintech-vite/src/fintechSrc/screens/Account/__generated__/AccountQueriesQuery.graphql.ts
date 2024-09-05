/**
 * @generated SignedSource<<fb579da59e8d4306998045fe5fbda4e7>>
 * @relayHash aa6ec069076aa222be921f4b6568a17c
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID aa6ec069076aa222be921f4b6568a17c

import { ConcreteRequest, Query } from 'relay-runtime';
export type AccountQueriesQuery$variables = Record<PropertyKey, never>;
export type AccountQueriesQuery$data = {
  readonly user: {
    readonly accountAvailable: string;
    readonly accountToBePaid: string;
    readonly accountTotal: string;
    readonly accountWithheld: string;
  } | null | undefined;
};
export type AccountQueriesQuery = {
  response: AccountQueriesQuery$data;
  variables: AccountQueriesQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "accountAvailable",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "accountToBePaid",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "accountTotal",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "accountWithheld",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AccountQueriesQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "AccountQueriesQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "aa6ec069076aa222be921f4b6568a17c",
    "metadata": {},
    "name": "AccountQueriesQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "6cc7b20c1216248722cb5cad631cfee6";

import { PreloadableQueryRegistry } from 'relay-runtime';
PreloadableQueryRegistry.set(node.params.id, node);

export default node;
