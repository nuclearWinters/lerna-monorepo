/**
 * @generated SignedSource<<8556d438d33e68fa64a04950c7eb91fd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @indirectDataDrivenDependency MyTransactions_user.transactions.edges.node {"branches":{"InvestTransaction":{"component":"InvestmentTransaction","fragment":"InvestmentTransaction_transaction$normalization.graphql"},"MoneyTransaction":{"component":"MoneyTransaction","fragment":"MoneyTransaction_transaction$normalization.graphql"}},"plural":true}

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Languages = "DEFAULT" | "EN" | "ES" | "%future added value";
export type MyTransactionsQuery$variables = {};
export type MyTransactionsQuery$data = {
  readonly authUser: {
    readonly language: Languages;
  };
  readonly user: {
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"MyTransactions_user">;
  };
};
export type MyTransactionsQuery = {
  response: MyTransactionsQuery$data;
  variables: MyTransactionsQuery$variables;
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
  "name": "language",
  "storageKey": null
},
v2 = [
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
    "name": "MyTransactionsQuery",
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
            "name": "MyTransactions_user"
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
          (v1/*: any*/)
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
    "name": "MyTransactionsQuery",
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
            "args": (v2/*: any*/),
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
                            "documentName": "MyTransactions_user",
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
                            "documentName": "MyTransactions_user",
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
            "args": (v2/*: any*/),
            "filters": null,
            "handle": "connection",
            "key": "MyTransactions_user_transactions",
            "kind": "LinkedHandle",
            "name": "transactions"
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
          (v1/*: any*/),
          (v0/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "aef5cdddbbeab9a260eef5981446ad14",
    "id": null,
    "metadata": {},
    "name": "MyTransactionsQuery",
    "operationKind": "query",
    "text": "query MyTransactionsQuery {\n  user {\n    id\n    ...MyTransactions_user\n  }\n  authUser {\n    language\n    id\n  }\n}\n\nfragment InvestmentTransaction_transaction on InvestTransaction {\n  id\n  id_user\n  type\n  quantity\n  created\n  id_borrower\n  _id_loan\n}\n\nfragment MoneyTransaction_transaction on MoneyTransaction {\n  id\n  id_user\n  type\n  quantity\n  created\n}\n\nfragment MyTransactions_user on User {\n  transactions(first: 5, after: \"\") {\n    edges {\n      node {\n        __typename\n        ... on InvestTransaction {\n          ...InvestmentTransaction_transaction\n          __module_operation_MyTransactions_user: js(module: \"InvestmentTransaction_transaction$normalization.graphql\", id: \"MyTransactions_user.transactions.edges.node\")\n          __module_component_MyTransactions_user: js(module: \"InvestmentTransaction\", id: \"MyTransactions_user.transactions.edges.node\")\n          id\n        }\n        ... on MoneyTransaction {\n          ...MoneyTransaction_transaction\n          __module_operation_MyTransactions_user: js(module: \"MoneyTransaction_transaction$normalization.graphql\", id: \"MyTransactions_user.transactions.edges.node\")\n          __module_component_MyTransactions_user: js(module: \"MoneyTransaction\", id: \"MyTransactions_user.transactions.edges.node\")\n          id\n        }\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n  id\n}\n"
  }
};
})();

(node as any).hash = "ccc5712dba60d5bea650c79079579e70";

export default node;
