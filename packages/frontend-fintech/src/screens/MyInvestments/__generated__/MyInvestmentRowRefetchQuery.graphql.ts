/**
 * @generated SignedSource<<9fb055444aefda687f7f2873a1467b9d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MyInvestmentRowRefetchQuery$variables = {
  id: string;
};
export type MyInvestmentRowRefetchQuery$data = {
  readonly node: {
    readonly " $fragmentSpreads": FragmentRefs<"MyInvestmentsQueriesRow_investment">;
  } | null | undefined;
};
export type MyInvestmentRowRefetchQuery = {
  response: MyInvestmentRowRefetchQuery$data;
  variables: MyInvestmentRowRefetchQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "MyInvestmentRowRefetchQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "MyInvestmentsQueriesRow_investment"
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MyInvestmentRowRefetchQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "borrower_id",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "loan_id",
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
                "name": "created_at",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "updated_at",
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
                "name": "interest_to_earn",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "paid_already",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "to_be_paid",
                "storageKey": null
              }
            ],
            "type": "Investment",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "859a477d42e444e295ab1cc6cade1550",
    "id": null,
    "metadata": {},
    "name": "MyInvestmentRowRefetchQuery",
    "operationKind": "query",
    "text": "query MyInvestmentRowRefetchQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ...MyInvestmentsQueriesRow_investment\n    id\n  }\n}\n\nfragment MyInvestmentsQueriesRow_investment on Investment {\n  id\n  borrower_id\n  loan_id\n  quantity\n  created_at\n  updated_at\n  status\n  payments\n  ROI\n  term\n  moratory\n  interest_to_earn\n  paid_already\n  to_be_paid\n}\n"
  }
};
})();

(node as any).hash = "3da30e88e395c4e3d7cb8f7432eb6d7e";

export default node;
