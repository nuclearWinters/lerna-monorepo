/**
 * @generated SignedSource<<dadbd09a60f3d3ce05b03220c623bc94>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @indirectDataDrivenDependency MyTransactionsQueries_user.transactions.edges.node {"branches":{"InvestTransaction":{"component":"InvestmentTransaction","fragment":"InvestmentTransaction_transaction$normalization.graphql"},"MoneyTransaction":{"component":"MoneyTransaction","fragment":"MoneyTransaction_transaction$normalization.graphql"}},"plural":true}

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MyTransactionsQueriesPaginationUser$variables = {
  count?: number | null | undefined;
  cursor?: string | null | undefined;
  id: string;
  reset?: number | null | undefined;
};
export type MyTransactionsQueriesPaginationUser$data = {
  readonly node: {
    readonly " $fragmentSpreads": FragmentRefs<"MyTransactionsQueries_user">;
  } | null | undefined;
};
export type MyTransactionsQueriesPaginationUser = {
  response: MyTransactionsQueriesPaginationUser$data;
  variables: MyTransactionsQueriesPaginationUser$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": 5,
  "kind": "LocalArgument",
  "name": "count"
},
v1 = {
  "defaultValue": "",
  "kind": "LocalArgument",
  "name": "cursor"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v3 = {
  "defaultValue": 0,
  "kind": "LocalArgument",
  "name": "reset"
},
v4 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v5 = {
  "kind": "Variable",
  "name": "reset",
  "variableName": "reset"
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v8 = [
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
  (v5/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "MyTransactionsQueriesPaginationUser",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
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
              (v5/*: any*/)
            ],
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v3/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Operation",
    "name": "MyTransactionsQueriesPaginationUser",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v6/*: any*/),
          (v7/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": (v8/*: any*/),
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
                          (v6/*: any*/),
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
                              (v7/*: any*/)
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
                              (v7/*: any*/)
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
                "storageKey": null
              },
              {
                "alias": null,
                "args": (v8/*: any*/),
                "filters": [
                  "reset"
                ],
                "handle": "connection",
                "key": "MyTransactionsQueries_user_transactions",
                "kind": "LinkedHandle",
                "name": "transactions"
              }
            ],
            "type": "User",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "c4c8cc42f6f36174207c1b6dfc4adfae",
    "id": null,
    "metadata": {},
    "name": "MyTransactionsQueriesPaginationUser",
    "operationKind": "query",
    "text": "query MyTransactionsQueriesPaginationUser(\n  $count: Int = 5\n  $cursor: String = \"\"\n  $reset: Float = 0\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ...MyTransactionsQueries_user_3sPmgd\n    id\n  }\n}\n\nfragment InvestmentTransaction_transaction on InvestTransaction {\n  id\n  user_id\n  type\n  quantity\n  created_at\n  borrower_id\n  loan_id\n}\n\nfragment MoneyTransaction_transaction on MoneyTransaction {\n  id\n  user_id\n  type\n  quantity\n  created_at\n}\n\nfragment MyTransactionsQueries_user_3sPmgd on User {\n  transactions(first: $count, after: $cursor, reset: $reset) {\n    edges {\n      node {\n        __typename\n        ... on InvestTransaction {\n          ...InvestmentTransaction_transaction\n          __module_operation_MyTransactionsQueries_user: js(module: \"InvestmentTransaction_transaction$normalization.graphql\", id: \"MyTransactionsQueries_user.transactions.edges.node\")\n          __module_component_MyTransactionsQueries_user: js(module: \"InvestmentTransaction\", id: \"MyTransactionsQueries_user.transactions.edges.node\")\n          id\n        }\n        ... on MoneyTransaction {\n          ...MoneyTransaction_transaction\n          __module_operation_MyTransactionsQueries_user: js(module: \"MoneyTransaction_transaction$normalization.graphql\", id: \"MyTransactionsQueries_user.transactions.edges.node\")\n          __module_component_MyTransactionsQueries_user: js(module: \"MoneyTransaction\", id: \"MyTransactionsQueries_user.transactions.edges.node\")\n          id\n        }\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n  id\n}\n"
  }
};
})();

(node as any).hash = "f2d900130175437da6b19c2f43ddbd8b";

export default node;
