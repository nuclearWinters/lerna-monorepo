/**
 * @generated SignedSource<<22dfb242d76cd993fe3b62e5863d1475>>
 * @relayHash dc570781771a4c3630c2402ec2ae4ffe
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID dc570781771a4c3630c2402ec2ae4ffe

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Languages = "EN" | "ES" | "%future added value";
export type SettingsQueriesAuthUserQuery$variables = Record<PropertyKey, never>;
export type SettingsQueriesAuthUserQuery$data = {
  readonly authUser: {
    readonly CURP: string;
    readonly RFC: string;
    readonly apellidoMaterno: string;
    readonly apellidoPaterno: string;
    readonly clabe: string;
    readonly email: string;
    readonly id: string;
    readonly language: Languages;
    readonly mobile: string;
    readonly name: string;
    readonly " $fragmentSpreads": FragmentRefs<"SettingsQueries_logins_user" | "SettingsQueries_sessions_user">;
  } | null | undefined;
};
export type SettingsQueriesAuthUserQuery = {
  response: SettingsQueriesAuthUserQuery$data;
  variables: SettingsQueriesAuthUserQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "apellidoPaterno",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "apellidoMaterno",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "RFC",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "CURP",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "clabe",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mobile",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "language",
  "storageKey": null
},
v10 = [
  {
    "kind": "Literal",
    "name": "after",
    "value": ""
  },
  {
    "kind": "Literal",
    "name": "first",
    "value": 5
  },
  {
    "kind": "Literal",
    "name": "reset",
    "value": 0
  }
],
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "applicationName",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "address",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "concreteType": "PageInfo",
  "kind": "LinkedField",
  "name": "pageInfo",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "endCursor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hasNextPage",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v16 = [
  "reset"
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "SettingsQueriesAuthUserQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "AuthUser",
        "kind": "LinkedField",
        "name": "authUser",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "SettingsQueries_logins_user"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "SettingsQueries_sessions_user"
          }
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
    "name": "SettingsQueriesAuthUserQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "AuthUser",
        "kind": "LinkedField",
        "name": "authUser",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          {
            "alias": null,
            "args": (v10/*: any*/),
            "concreteType": "LoginsConnection",
            "kind": "LinkedField",
            "name": "logins",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "LoginEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Login",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v0/*: any*/),
                      (v11/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "time",
                        "storageKey": null
                      },
                      (v12/*: any*/),
                      (v13/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v14/*: any*/)
                ],
                "storageKey": null
              },
              (v15/*: any*/)
            ],
            "storageKey": "logins(after:\"\",first:5,reset:0)"
          },
          {
            "alias": null,
            "args": (v10/*: any*/),
            "filters": (v16/*: any*/),
            "handle": "connection",
            "key": "Settings_user_logins",
            "kind": "LinkedHandle",
            "name": "logins"
          },
          {
            "alias": null,
            "args": (v10/*: any*/),
            "concreteType": "SessionsConnection",
            "kind": "LinkedField",
            "name": "sessions",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "SessionEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Session",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v0/*: any*/),
                      (v11/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "type",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "deviceName",
                        "storageKey": null
                      },
                      (v12/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "lastTimeAccessed",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "expirationDate",
                        "storageKey": null
                      },
                      (v13/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v14/*: any*/)
                ],
                "storageKey": null
              },
              (v15/*: any*/)
            ],
            "storageKey": "sessions(after:\"\",first:5,reset:0)"
          },
          {
            "alias": null,
            "args": (v10/*: any*/),
            "filters": (v16/*: any*/),
            "handle": "connection",
            "key": "Settings_user_sessions",
            "kind": "LinkedHandle",
            "name": "sessions"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "dc570781771a4c3630c2402ec2ae4ffe",
    "metadata": {},
    "name": "SettingsQueriesAuthUserQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "552f52a7be5e427babfb995ba285ac25";

import { PreloadableQueryRegistry } from 'relay-runtime';
PreloadableQueryRegistry.set(node.params.id, node);

export default node;
