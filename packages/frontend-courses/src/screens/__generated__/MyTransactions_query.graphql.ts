/**
 * @generated SignedSource<<d072f33a3337d48ad681b4e874531480>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment, RefetchableFragment } from 'relay-runtime';
export type Languages = "EN" | "ES" | "DEFAULT" | "%future added value";
export type TransactionType = "CREDIT" | "WITHDRAWAL" | "INVEST" | "COLLECT" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type MyTransactions_query$data = {
  readonly transactions: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly count: number;
        readonly history: ReadonlyArray<{
          readonly id: string;
          readonly _id_borrower: string | null;
          readonly _id_loan: string | null;
          readonly type: TransactionType;
          readonly quantity: string;
          readonly created: Int;
        }>;
      } | null;
    } | null> | null;
  } | null;
  readonly authUser: {
    readonly language: Languages;
  };
  readonly " $fragmentType": "MyTransactions_query";
};
export type MyTransactions_query = MyTransactions_query$data;
export type MyTransactions_query$key = {
  readonly " $data"?: MyTransactions_query$data;
  readonly " $fragmentSpreads": FragmentRefs<"MyTransactions_query">;
};

const node: ReaderFragment = (function(){
var v0 = [
  "transactions"
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [
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
      "kind": "RootArgument",
      "name": "id"
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
      "fragmentPathInResult": [],
      "operation": require('./MyTransactionsPaginationQuery.graphql')
    }
  },
  "name": "MyTransactions_query",
  "selections": [
    {
      "alias": "transactions",
      "args": [
        {
          "kind": "Variable",
          "name": "user_id",
          "variableName": "id"
        }
      ],
      "concreteType": "BucketTransactionConnection",
      "kind": "LinkedField",
      "name": "__MyTransactions_query_transactions_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "BucketTransactionEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "BucketTransaction",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                (v1/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "count",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Transaction",
                  "kind": "LinkedField",
                  "name": "history",
                  "plural": true,
                  "selections": [
                    (v1/*: any*/),
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
                      "name": "type",
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
                    }
                  ],
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
      "args": [
        {
          "kind": "Variable",
          "name": "id",
          "variableName": "id"
        }
      ],
      "concreteType": "AuthUser",
      "kind": "LinkedField",
      "name": "authUser",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "language",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};
})();

(node as any).hash = "b9b6c88634eee7f5d7c24ed0d70b3e72";

export default node;
