/**
 * @generated SignedSource<<3fcd9c7e95329ca1931cd7f324720ca5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @indirectDataDrivenDependency MyTransactionsQueries_user.transactions.edges.node {"branches":{"InvestTransaction":{"component":"InvestmentTransaction","fragment":"InvestmentTransaction_transaction$normalization.graphql"},"MoneyTransaction":{"component":"MoneyTransaction","fragment":"MoneyTransaction_transaction$normalization.graphql"}},"plural":true}

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MyTransactionsQueriesQuery$variables = Record<PropertyKey, never>;
export type MyTransactionsQueriesQuery$data = {
  readonly user: {
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"MyTransactionsQueries_user">;
  };
};
export type MyTransactionsQueriesQuery = {
  response: MyTransactionsQueriesQuery$data;
  variables: MyTransactionsQueriesQuery$variables;
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
    "kind": "Literal",
    "name": "after",
    "value": ""
  },
  {
    "kind": "Literal",
    "name": "first",
    "value": 5
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "MyTransactionsQueriesQuery",
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
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "MyTransactionsQueries_user"
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
    "name": "MyTransactionsQueriesQuery",
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
          {
            "alias": null,
            "args": (v1/*: any*/),
            "concreteType": "TransactionConnection",
            "kind": "LinkedField",
            "name": "transactions",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "TransactionEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
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
                        "kind": "InlineFragment",
                        "selections": [
                          {
                            "args": null,
                            "documentName": "MyTransactionsQueries_user",
                            "fragmentName": "InvestmentTransaction_transaction",
                            "fragmentPropName": "transaction",
                            "kind": "ModuleImport"
                          },
                          (v0/*: any*/)
                        ],
                        "type": "InvestTransaction",
                        "abstractKey": null
                      },
                      {
                        "kind": "InlineFragment",
                        "selections": [
                          {
                            "args": null,
                            "documentName": "MyTransactionsQueries_user",
                            "fragmentName": "MoneyTransaction_transaction",
                            "fragmentPropName": "transaction",
                            "kind": "ModuleImport"
                          },
                          (v0/*: any*/)
                        ],
                        "type": "MoneyTransaction",
                        "abstractKey": null
                      },
                      {
                        "kind": "ClientExtension",
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "__id",
                            "storageKey": null
                          }
                        ]
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
            "storageKey": "transactions(after:\"\",first:5)"
          },
          {
            "alias": null,
            "args": (v1/*: any*/),
            "filters": null,
            "handle": "connection",
            "key": "MyTransactions_user_transactions",
            "kind": "LinkedHandle",
            "name": "transactions"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "a32e9218ec20568dcb483aa2678859bf",
    "id": null,
    "metadata": {},
    "name": "MyTransactionsQueriesQuery",
    "operationKind": "query",
    "text": "query MyTransactionsQueriesQuery {\n  user {\n    id\n    ...MyTransactionsQueries_user\n  }\n}\n\nfragment InvestmentTransaction_transaction on InvestTransaction {\n  id\n  user_id\n  type\n  quantity\n  created_at\n  borrower_id\n  loan_id\n}\n\nfragment MoneyTransaction_transaction on MoneyTransaction {\n  id\n  user_id\n  type\n  quantity\n  created_at\n}\n\nfragment MyTransactionsQueries_user on User {\n  transactions(first: 5, after: \"\") {\n    edges {\n      node {\n        __typename\n        ... on InvestTransaction {\n          ...InvestmentTransaction_transaction\n          __module_operation_MyTransactionsQueries_user: js(module: \"InvestmentTransaction_transaction$normalization.graphql\", id: \"MyTransactionsQueries_user.transactions.edges.node\")\n          __module_component_MyTransactionsQueries_user: js(module: \"InvestmentTransaction\", id: \"MyTransactionsQueries_user.transactions.edges.node\")\n          id\n        }\n        ... on MoneyTransaction {\n          ...MoneyTransaction_transaction\n          __module_operation_MyTransactionsQueries_user: js(module: \"MoneyTransaction_transaction$normalization.graphql\", id: \"MyTransactionsQueries_user.transactions.edges.node\")\n          __module_component_MyTransactionsQueries_user: js(module: \"MoneyTransaction\", id: \"MyTransactionsQueries_user.transactions.edges.node\")\n          id\n        }\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n  id\n}\n"
  }
};
})();

(node as any).hash = "7cb90236c8668fa7d10d9c89d6f42d17";

export default node;
