/**
 * @generated SignedSource<<cc688cf9d1bbd7ecee5da4cef127ce9d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment, RefetchableFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MyLoans_user$data = {
  readonly id: string;
  readonly myLoans: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly " $fragmentSpreads": FragmentRefs<"LoanRow_loan">;
      } | null;
    } | null> | null;
  } | null;
  readonly " $fragmentType": "MyLoans_user";
};
export type MyLoans_user$key = {
  readonly " $data"?: MyLoans_user$data;
  readonly " $fragmentSpreads": FragmentRefs<"MyLoans_user">;
};

const node: ReaderFragment = (function(){
var v0 = [
  "myLoans"
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
      "defaultValue": true,
      "kind": "LocalArgument",
      "name": "firstFetch"
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
      "operation": require('./MyLoansPaginationUser.graphql'),
      "identifierField": "id"
    }
  },
  "name": "MyLoans_user",
  "selections": [
    {
      "alias": "myLoans",
      "args": [
        {
          "kind": "Variable",
          "name": "firstFetch",
          "variableName": "firstFetch"
        }
      ],
      "concreteType": "LoanConnection",
      "kind": "LinkedField",
      "name": "__MyLoans_user_myLoans_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "LoanEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Loan",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                (v1/*: any*/),
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "LoanRow_loan"
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

(node as any).hash = "ee1cfc1a513e936b4363d61403a09475";

export default node;
