/**
 * @generated SignedSource<<16d9e6b6ac94070209f0e7917c9c7943>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Languages = "DEFAULT" | "EN" | "ES" | "%future added value";
export type MyLoansQuery$variables = {};
export type MyLoansQuery$data = {
  readonly authUser: {
    readonly accountId: string;
    readonly isBorrower: boolean;
    readonly isLender: boolean;
    readonly isSupport: boolean;
    readonly language: Languages;
  };
  readonly user: {
    readonly " $fragmentSpreads": FragmentRefs<"MyLoans_user">;
  };
};
export type MyLoansQuery = {
  response: MyLoansQuery$data;
  variables: MyLoansQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isLender",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isSupport",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isBorrower",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "language",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "accountId",
  "storageKey": null
},
v5 = [
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
    "name": "firstFetch",
    "value": true
  }
],
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "MyLoansQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "MyLoans_user"
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
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/)
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
    "name": "MyLoansQuery",
    "selections": [
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
            "args": (v5/*: any*/),
            "concreteType": "LoanConnection",
            "kind": "LinkedField",
            "name": "myLoans",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "LoanEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Loan",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v6/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "id_user",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "score",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "ROI",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "goal",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "term",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "raised",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "expiry",
                        "storageKey": null
                      },
                      (v7/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "ScheduledPayments",
                        "kind": "LinkedField",
                        "name": "scheduledPayments",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "amortize",
                            "storageKey": null
                          },
                          (v7/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "scheduledDate",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "pending",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "pendingCents",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "__typename",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "cursor",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
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
              }
            ],
            "storageKey": "myLoans(after:\"\",first:5,firstFetch:true)"
          },
          {
            "alias": null,
            "args": (v5/*: any*/),
            "filters": [
              "firstFetch"
            ],
            "handle": "connection",
            "key": "MyLoans_user_myLoans",
            "kind": "LinkedHandle",
            "name": "myLoans"
          },
          (v6/*: any*/)
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
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v6/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "4f26703f938c22069addd49ca5bd0d41",
    "id": null,
    "metadata": {},
    "name": "MyLoansQuery",
    "operationKind": "query",
    "text": "query MyLoansQuery {\n  user {\n    ...MyLoans_user\n    id\n  }\n  authUser {\n    isLender\n    isSupport\n    isBorrower\n    language\n    accountId\n    id\n  }\n}\n\nfragment LoanRow_loan on Loan {\n  id\n  id_user\n  score\n  ROI\n  goal\n  term\n  raised\n  expiry\n  status\n  scheduledPayments {\n    amortize\n    status\n    scheduledDate\n  }\n  pending\n  pendingCents\n}\n\nfragment MyLoans_user on User {\n  myLoans(first: 5, after: \"\", firstFetch: true) {\n    edges {\n      node {\n        id\n        ...LoanRow_loan\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n  id\n}\n"
  }
};
})();

(node as any).hash = "871d140d961e17232d6646a4eddf91da";

export default node;
