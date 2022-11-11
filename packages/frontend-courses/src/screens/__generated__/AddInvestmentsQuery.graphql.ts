/**
 * @generated SignedSource<<9288e71af5108f2b252e1d792cd2fa61>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Languages = "DEFAULT" | "EN" | "ES" | "%future added value";
export type AddInvestmentsQuery$variables = {};
export type AddInvestmentsQuery$data = {
  readonly authUser: {
    readonly accountId: string;
    readonly isBorrower: boolean;
    readonly isLender: boolean;
    readonly isSupport: boolean;
    readonly language: Languages;
  };
  readonly " $fragmentSpreads": FragmentRefs<"AddInvestments_query">;
};
export type AddInvestmentsQuery = {
  response: AddInvestmentsQuery$data;
  variables: AddInvestmentsQuery$variables;
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
    "name": "AddInvestmentsQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "AddInvestments_query"
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
    "name": "AddInvestmentsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v5/*: any*/),
        "concreteType": "LoanConnection",
        "kind": "LinkedField",
        "name": "loansFinancing",
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
        "storageKey": "loansFinancing(after:\"\",first:5)"
      },
      {
        "alias": null,
        "args": (v5/*: any*/),
        "filters": null,
        "handle": "connection",
        "key": "AddInvestments_query_loansFinancing",
        "kind": "LinkedHandle",
        "name": "loansFinancing"
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
    "cacheID": "d13544940f88cef2d9a5c170352f55a8",
    "id": null,
    "metadata": {},
    "name": "AddInvestmentsQuery",
    "operationKind": "query",
    "text": "query AddInvestmentsQuery {\n  ...AddInvestments_query\n  authUser {\n    isLender\n    isSupport\n    isBorrower\n    language\n    accountId\n    id\n  }\n}\n\nfragment AddInvestments_query on Query {\n  loansFinancing(first: 5, after: \"\") {\n    edges {\n      node {\n        id\n        ...LoanRow_loan\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment LoanRow_loan on Loan {\n  id\n  id_user\n  score\n  ROI\n  goal\n  term\n  raised\n  expiry\n  status\n  scheduledPayments {\n    amortize\n    status\n    scheduledDate\n  }\n  pending\n  pendingCents\n}\n"
  }
};
})();

(node as any).hash = "1be2262043e560a0abea9995ee591589";

export default node;
