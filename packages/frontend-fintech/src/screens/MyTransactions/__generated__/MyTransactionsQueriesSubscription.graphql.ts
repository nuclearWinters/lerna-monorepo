/**
 * @generated SignedSource<<07580f511223a6e0f480f611914ba7c1>>
 * @relayHash a6e009cfced9ddb83b7b78ef4b72713f
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID a6e009cfced9ddb83b7b78ef4b72713f
// @dataDrivenDependency MyTransactionsQueriesSubscription.transactions_subscribe_insert.node {"branches":{"InvestTransaction":{"component":"InvestmentTransaction","fragment":"InvestmentTransaction_transaction$normalization.graphql"},"MoneyTransaction":{"component":"MoneyTransaction","fragment":"MoneyTransaction_transaction$normalization.graphql"}},"plural":false}

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MyTransactionsQueriesSubscription$variables = {
  connections: ReadonlyArray<string>;
};
export type MyTransactionsQueriesSubscription$data = {
  readonly transactions_subscribe_insert: {
    readonly cursor: string;
    readonly node: {
      readonly __fragmentPropName?: string | null | undefined;
      readonly __id: string;
      readonly __module_component?: string | null | undefined;
      readonly " $fragmentSpreads": FragmentRefs<"InvestmentTransaction_transaction" | "MoneyTransaction_transaction">;
    } | null | undefined;
  };
};
export type MyTransactionsQueriesSubscription = {
  response: MyTransactionsQueriesSubscription$data;
  variables: MyTransactionsQueriesSubscription$variables;
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
  "documentName": "MyTransactionsQueriesSubscription",
  "fragmentName": "InvestmentTransaction_transaction",
  "fragmentPropName": "transaction",
  "kind": "ModuleImport"
},
v2 = {
  "args": null,
  "documentName": "MyTransactionsQueriesSubscription",
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
    "name": "MyTransactionsQueriesSubscription",
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
    "name": "MyTransactionsQueriesSubscription",
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
    "id": "a6e009cfced9ddb83b7b78ef4b72713f",
    "metadata": {},
    "name": "MyTransactionsQueriesSubscription",
    "operationKind": "subscription",
    "text": null
  }
};
})();

(node as any).hash = "afac7acb06074e96b82fd661f894f821";

export default node;
