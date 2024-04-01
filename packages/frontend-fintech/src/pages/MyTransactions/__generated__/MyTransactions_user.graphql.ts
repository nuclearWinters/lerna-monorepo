/**
 * @generated SignedSource<<26c4d47ec4715b55c57cb8644a5e64b8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @dataDrivenDependency MyTransactions_user.transactions.edges.node {"branches":{"InvestTransaction":{"component":"InvestmentTransaction","fragment":"InvestmentTransaction_transaction$normalization.graphql"},"MoneyTransaction":{"component":"MoneyTransaction","fragment":"MoneyTransaction_transaction$normalization.graphql"}},"plural":true}

import { ReaderFragment, RefetchableFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MyTransactions_user$data = {
  readonly id: string;
  readonly transactions: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly __fragmentPropName?: string | null | undefined;
        readonly __id: string;
        readonly __module_component?: string | null | undefined;
        readonly " $fragmentSpreads": FragmentRefs<"InvestmentTransaction_transaction" | "MoneyTransaction_transaction">;
      } | null | undefined;
    } | null | undefined> | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "MyTransactions_user";
};
export type MyTransactions_user$key = {
  readonly " $data"?: MyTransactions_user$data;
  readonly " $fragmentSpreads": FragmentRefs<"MyTransactions_user">;
};

const node: ReaderFragment = (function(){
var v0 = [
  "transactions"
];
return {
  "argumentDefinitions": [
    {
      "defaultValue": 5,
      "kind": "LocalArgument",
      "name": "count"
    },
    {
      "defaultValue": "",
      "kind": "LocalArgument",
      "name": "cursor"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": (v0/*: any*/)
      }
    ],
    "refetch": {
      "connection": {
        "forward": {
          "count": "count",
          "cursor": "cursor"
        },
        "backward": null,
        "path": (v0/*: any*/)
      },
      "fragmentPathInResult": [
        "node"
      ],
      "operation": require('./MyTransactionsPaginationUser.graphql'),
      "identifierInfo": {
        "identifierField": "id",
        "identifierQueryVariableName": "id"
      }
    }
  },
  "name": "MyTransactions_user",
  "selections": [
    {
      "alias": "transactions",
      "args": null,
      "concreteType": "TransactionConnection",
      "kind": "LinkedField",
      "name": "__MyTransactions_user_transactions_connection",
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
                  "kind": "InlineFragment",
                  "selections": [
                    {
                      "args": null,
                      "documentName": "MyTransactions_user",
                      "fragmentName": "InvestmentTransaction_transaction",
                      "fragmentPropName": "transaction",
                      "kind": "ModuleImport"
                    }
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
                    }
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
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    }
  ],
  "type": "User",
  "abstractKey": null
};
})();

(node as any).hash = "8fcdb123e1cf72a3358213d08eb0e647";

export default node;
