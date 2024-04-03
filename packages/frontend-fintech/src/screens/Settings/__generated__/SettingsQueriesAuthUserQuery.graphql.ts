/**
 * @generated SignedSource<<729ee594ac372e2e1e08298990d04b9b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Languages = "DEFAULT" | "EN" | "ES" | "%future added value";
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
  };
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
};
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
            "storageKey": "logins(after:\"\",first:5)"
          },
          {
            "alias": null,
            "args": (v10/*: any*/),
            "filters": null,
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
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "expirationDate",
                        "storageKey": null
                      },
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
            "storageKey": "sessions(after:\"\",first:5)"
          },
          {
            "alias": null,
            "args": (v10/*: any*/),
            "filters": null,
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
    "cacheID": "431939505b1b01190276dc9d64f9b502",
    "id": null,
    "metadata": {},
    "name": "SettingsQueriesAuthUserQuery",
    "operationKind": "query",
    "text": "query SettingsQueriesAuthUserQuery {\n  authUser {\n    id\n    name\n    apellidoPaterno\n    apellidoMaterno\n    RFC\n    CURP\n    clabe\n    mobile\n    email\n    language\n    ...SettingsQueries_logins_user\n    ...SettingsQueries_sessions_user\n  }\n}\n\nfragment LoginRow_login on Login {\n  applicationName\n  time\n  address\n  id\n}\n\nfragment SessionRow_session on Session {\n  id\n  applicationName\n  type\n  deviceName\n  address\n  lastTimeAccessed\n}\n\nfragment SettingsQueries_logins_user on AuthUser {\n  logins(first: 5, after: \"\") {\n    edges {\n      node {\n        id\n        ...LoginRow_login\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n  id\n}\n\nfragment SettingsQueries_sessions_user on AuthUser {\n  sessions(first: 5, after: \"\") {\n    edges {\n      node {\n        id\n        expirationDate\n        ...SessionRow_session\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n  id\n}\n"
  }
};
})();

(node as any).hash = "5e060e56540ceb0cd7faf094e11eb128";

export default node;
