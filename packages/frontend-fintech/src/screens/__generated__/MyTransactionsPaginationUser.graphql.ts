/**
 * @generated SignedSource<<b2906fcea78cf7b001e2a6829d8dfb14>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @indirectDataDrivenDependency MyTransactions_user.transactions.edges.node {"branches":{"InvestTransaction":{"component":"InvestmentTransaction","fragment":"InvestmentTransaction_transaction$normalization.graphql"},"MoneyTransaction":{"component":"MoneyTransaction","fragment":"MoneyTransaction_transaction$normalization.graphql"}},"plural":true}

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MyTransactionsPaginationUser$variables = {
  count?: number | null | undefined;
  cursor?: string | null | undefined;
  id: string;
};
export type MyTransactionsPaginationUser$data = {
  readonly node: {
    readonly " $fragmentSpreads": FragmentRefs<"MyTransactions_user">;
  } | null | undefined;
};
export type MyTransactionsPaginationUser = {
  response: MyTransactionsPaginationUser$data;
  variables: MyTransactionsPaginationUser$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": 5,
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
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "MyTransactionsPaginationUser",
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
              }
            ],
            "kind": "FragmentSpread",
            "name": "MyTransactions_user"
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
    "name": "MyTransactionsPaginationUser",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": (v4/*: any*/),
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
                          (v2/*: any*/),
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              {
                                "args": null,
                                "documentName": "MyTransactions_user",
                                "fragmentName": "InvestmentTransaction_transaction",
                                "fragmentPropName": "transaction",
                                "kind": "ModuleImport"
                              },
                              (v3/*: any*/)
                            ],
                            "type": "InvestTransaction",
                            "abstractKey": null
                          },
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              {
                                "args": null,
                                "documentName": "MyTransactions_user",
                                "fragmentName": "MoneyTransaction_transaction",
                                "fragmentPropName": "transaction",
                                "kind": "ModuleImport"
                              },
                              (v3/*: any*/)
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
                "args": (v4/*: any*/),
                "filters": null,
                "handle": "connection",
                "key": "MyTransactions_user_transactions",
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
    "cacheID": "e609c259ed30fe72c8de352a655c7e43",
    "id": null,
    "metadata": {},
    "name": "MyTransactionsPaginationUser",
    "operationKind": "query",
    "text": "query MyTransactionsPaginationUser(\n  $count: Int = 5\n  $cursor: String = \"\"\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ...MyTransactions_user_1G22uz\n    id\n  }\n}\n\nfragment InvestmentTransaction_transaction on InvestTransaction {\n  id\n  user_id\n  type\n  quantity\n  created_at\n  borrower_id\n  loan_id\n}\n\nfragment MoneyTransaction_transaction on MoneyTransaction {\n  id\n  user_id\n  type\n  quantity\n  created_at\n}\n\nfragment MyTransactions_user_1G22uz on User {\n  transactions(first: $count, after: $cursor) {\n    edges {\n      node {\n        __typename\n        ... on InvestTransaction {\n          ...InvestmentTransaction_transaction\n          __module_operation_MyTransactions_user: js(module: \"InvestmentTransaction_transaction$normalization.graphql\", id: \"MyTransactions_user.transactions.edges.node\")\n          __module_component_MyTransactions_user: js(module: \"InvestmentTransaction\", id: \"MyTransactions_user.transactions.edges.node\")\n          id\n        }\n        ... on MoneyTransaction {\n          ...MoneyTransaction_transaction\n          __module_operation_MyTransactions_user: js(module: \"MoneyTransaction_transaction$normalization.graphql\", id: \"MyTransactions_user.transactions.edges.node\")\n          __module_component_MyTransactions_user: js(module: \"MoneyTransaction\", id: \"MyTransactions_user.transactions.edges.node\")\n          id\n        }\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n  id\n}\n"
  }
};
})();

(node as any).hash = "8fcdb123e1cf72a3358213d08eb0e647";

export default node;
