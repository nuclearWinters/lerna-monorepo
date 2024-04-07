/**
 * @generated SignedSource<<406bb67021cf1657488f977bc5e4752b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment, RefetchableFragment } from 'relay-runtime';
export type InvestmentStatus = "DELAY_PAYMENT" | "FINANCING" | "PAID" | "PAST_DUE" | "UP_TO_DATE" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type MyInvestmentsQueries_user$data = {
  readonly id: string;
  readonly investments: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly ROI: number;
        readonly borrower_id: string;
        readonly created_at: Int;
        readonly id: string;
        readonly interest_to_earn: string;
        readonly loan_id: string;
        readonly moratory: string;
        readonly paid_already: string;
        readonly payments: number;
        readonly quantity: string;
        readonly status: InvestmentStatus;
        readonly term: number;
        readonly to_be_paid: string;
        readonly updated_at: Int;
        readonly " $fragmentSpreads": FragmentRefs<"MyInvestmentsQueriesRow_investment">;
      } | null | undefined;
    } | null | undefined> | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "MyInvestmentsQueries_user";
};
export type MyInvestmentsQueries_user$key = {
  readonly " $data"?: MyInvestmentsQueries_user$data;
  readonly " $fragmentSpreads": FragmentRefs<"MyInvestmentsQueries_user">;
};

const node: ReaderFragment = (function(){
var v0 = [
  "investments"
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
      "defaultValue": 0,
      "kind": "LocalArgument",
      "name": "reset"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "status"
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
      "operation": require('./MyInvestmentsQueriesPaginationUser.graphql'),
      "identifierInfo": {
        "identifierField": "id",
        "identifierQueryVariableName": "id"
      }
    }
  },
  "name": "MyInvestmentsQueries_user",
  "selections": [
    {
      "alias": "investments",
      "args": [
        {
          "kind": "Variable",
          "name": "reset",
          "variableName": "reset"
        },
        {
          "kind": "Variable",
          "name": "status",
          "variableName": "status"
        }
      ],
      "concreteType": "InvestmentsConnection",
      "kind": "LinkedField",
      "name": "__MyInvestmentsQueries_user_investments_connection",
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
                (v1/*: any*/),
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
                },
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "MyInvestmentsQueriesRow_investment"
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
    (v1/*: any*/)
  ],
  "type": "User",
  "abstractKey": null
};
})();

(node as any).hash = "7d4e58595025291c60063e1589a03f4e";

export default node;
