/**
 * @generated SignedSource<<ac653111c32e582ad267db02347effc9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @dataDrivenDependency MyTransactionsTransactionsSubscription.transactions_subscribe_insert.node {"branches":{"InvestTransaction":{"component":"InvestmentTransaction","fragment":"InvestmentTransaction_transaction$normalization.graphql"},"MoneyTransaction":{"component":"MoneyTransaction","fragment":"MoneyTransaction_transaction$normalization.graphql"}},"plural":false}

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MyTransactionsTransactionsSubscription$variables = {
  connections: ReadonlyArray<string>;
};
export type MyTransactionsTransactionsSubscription$data = {
  readonly transactions_subscribe_insert: {
    readonly cursor: string;
    readonly node: {
      readonly __fragmentPropName?: string | null;
      readonly __id: string;
      readonly __module_component?: string | null;
      readonly " $fragmentSpreads": FragmentRefs<"InvestmentTransaction_transaction" | "MoneyTransaction_transaction">;
    } | null;
  };
};
export type MyTransactionsTransactionsSubscription = {
  response: MyTransactionsTransactionsSubscription$data;
  variables: MyTransactionsTransactionsSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "connections"
  }
],
v1 = {
  "args": null,
  "documentName": "MyTransactionsTransactionsSubscription",
  "fragmentName": "InvestmentTransaction_transaction",
  "fragmentPropName": "transaction",
  "kind": "ModuleImport"
},
v2 = {
  "args": null,
  "documentName": "MyTransactionsTransactionsSubscription",
  "fragmentName": "MoneyTransaction_transaction",
  "fragmentPropName": "transaction",
  "kind": "ModuleImport"
},
v3 = {
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
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "MyTransactionsTransactionsSubscription",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "TransactionEdge",
        "kind": "LinkedField",
        "name": "transactions_subscribe_insert",
        "plural": false,
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
                "kind": "InlineFragment",
                "selections": [
                  (v1/*: any*/)
                ],
                "type": "InvestTransaction",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  (v2/*: any*/)
                ],
                "type": "MoneyTransaction",
                "abstractKey": null
              },
              (v3/*: any*/)
            ],
            "storageKey": null
          },
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MyTransactionsTransactionsSubscription",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "TransactionEdge",
        "kind": "LinkedField",
        "name": "transactions_subscribe_insert",
        "plural": false,
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
                  (v1/*: any*/),
                  (v5/*: any*/)
                ],
                "type": "InvestTransaction",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  (v2/*: any*/),
                  (v5/*: any*/)
                ],
                "type": "MoneyTransaction",
                "abstractKey": null
              },
              (v3/*: any*/)
            ],
            "storageKey": null
          },
          (v4/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "filters": null,
        "handle": "prependEdge",
        "key": "",
        "kind": "LinkedHandle",
        "name": "transactions_subscribe_insert",
        "handleArgs": [
          {
            "kind": "Variable",
            "name": "connections",
            "variableName": "connections"
          }
        ]
      }
    ]
  },
  "params": {
    "cacheID": "6fbbbd7c237d2cfe7550952de90649d5",
    "id": null,
    "metadata": {},
    "name": "MyTransactionsTransactionsSubscription",
    "operationKind": "subscription",
    "text": "subscription MyTransactionsTransactionsSubscription {\n  transactions_subscribe_insert {\n    node {\n      __typename\n      ... on InvestTransaction {\n        ...InvestmentTransaction_transaction\n        __module_operation_MyTransactionsTransactionsSubscription: js(module: \"InvestmentTransaction_transaction$normalization.graphql\", id: \"MyTransactionsTransactionsSubscription.transactions_subscribe_insert.node\")\n        __module_component_MyTransactionsTransactionsSubscription: js(module: \"InvestmentTransaction\", id: \"MyTransactionsTransactionsSubscription.transactions_subscribe_insert.node\")\n        id\n      }\n      ... on MoneyTransaction {\n        ...MoneyTransaction_transaction\n        __module_operation_MyTransactionsTransactionsSubscription: js(module: \"MoneyTransaction_transaction$normalization.graphql\", id: \"MyTransactionsTransactionsSubscription.transactions_subscribe_insert.node\")\n        __module_component_MyTransactionsTransactionsSubscription: js(module: \"MoneyTransaction\", id: \"MyTransactionsTransactionsSubscription.transactions_subscribe_insert.node\")\n        id\n      }\n    }\n    cursor\n  }\n}\n\nfragment InvestmentTransaction_transaction on InvestTransaction {\n  id\n  id_user\n  type\n  quantity\n  created\n  id_borrower\n  _id_loan\n}\n\nfragment MoneyTransaction_transaction on MoneyTransaction {\n  id\n  id_user\n  type\n  quantity\n  created\n}\n"
  }
};
})();

(node as any).hash = "b9e2adbcbfa35eac5048ca148a8e9cac";

export default node;
