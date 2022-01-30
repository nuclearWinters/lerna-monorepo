/**
 * @generated SignedSource<<14db6cb4069c80afd1f362630a110c6a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type InvestmentStatus = "DELAY_PAYMENT" | "UP_TO_DATE" | "FINANCING" | "PAST_DUE" | "PAID" | "%future added value";
export type MyInvestmentsPaginationQuery$variables = {
  count?: number | null;
  cursor?: string | null;
  id: string;
  status?: ReadonlyArray<InvestmentStatus> | null;
};
export type MyInvestmentsPaginationQueryVariables = MyInvestmentsPaginationQuery$variables;
export type MyInvestmentsPaginationQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"MyInvestments_query">;
};
export type MyInvestmentsPaginationQueryResponse = MyInvestmentsPaginationQuery$data;
export type MyInvestmentsPaginationQuery = {
  variables: MyInvestmentsPaginationQueryVariables;
  response: MyInvestmentsPaginationQuery$data;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": 2,
    "kind": "LocalArgument",
    "name": "count"
  },
  {
    "defaultValue": "",
    "kind": "LocalArgument",
    "name": "cursor"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  },
  {
    "defaultValue": [
      "DELAY_PAYMENT",
      "UP_TO_DATE",
      "FINANCING"
    ],
    "kind": "LocalArgument",
    "name": "status"
  }
],
v1 = {
  "kind": "Variable",
  "name": "status",
  "variableName": "status"
},
v2 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  },
  (v1/*: any*/),
  {
    "kind": "Variable",
    "name": "user_id",
    "variableName": "id"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "MyInvestmentsPaginationQuery",
    "selections": [
      {
        "args": [
          {
            "kind": "Variable",
            "name": "count",
            "variableName": "count"
          },
          {
            "kind": "Variable",
            "name": "cursor",
            "variableName": "cursor"
          },
          (v1/*: any*/)
        ],
        "kind": "FragmentSpread",
        "name": "MyInvestments_query"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MyInvestmentsPaginationQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "InvestmentsConnection",
        "kind": "LinkedField",
        "name": "investments",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "InvestmentsEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Investment",
                "kind": "LinkedField",
                "name": "node",
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
                    "name": "_id_borrower",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "_id_loan",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "quantity",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "created",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "updated",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "status",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "payments",
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
                    "name": "term",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "moratory",
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
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v2/*: any*/),
        "filters": [
          "user_id",
          "status"
        ],
        "handle": "connection",
        "key": "MyInvestments_query_investments",
        "kind": "LinkedHandle",
        "name": "investments"
      }
    ]
  },
  "params": {
    "cacheID": "f0fb4aaaee75615e1b63765712689305",
    "id": null,
    "metadata": {},
    "name": "MyInvestmentsPaginationQuery",
    "operationKind": "query",
    "text": "query MyInvestmentsPaginationQuery(\n  $count: Int = 2\n  $cursor: String = \"\"\n  $id: String!\n  $status: [InvestmentStatus!] = [DELAY_PAYMENT, UP_TO_DATE, FINANCING]\n) {\n  ...MyInvestments_query_4qXjrI\n}\n\nfragment InvestmentRow_investment on Investment {\n  id\n  _id_borrower\n  _id_loan\n  quantity\n  created\n  updated\n  status\n  payments\n  ROI\n  term\n  moratory\n}\n\nfragment MyInvestments_query_4qXjrI on Query {\n  investments(first: $count, after: $cursor, user_id: $id, status: $status) {\n    edges {\n      node {\n        id\n        ...InvestmentRow_investment\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "9182023af3df86826798dd2df127977f";

export default node;
