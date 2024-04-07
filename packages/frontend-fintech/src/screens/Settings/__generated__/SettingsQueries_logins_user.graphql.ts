/**
 * @generated SignedSource<<308a4f702691f2d582e1cb70a8b88eb4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment, RefetchableFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type SettingsQueries_logins_user$data = {
  readonly id: string;
  readonly logins: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly address: string;
        readonly applicationName: string;
        readonly id: string;
        readonly time: Int;
      } | null | undefined;
    } | null | undefined> | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "SettingsQueries_logins_user";
};
export type SettingsQueries_logins_user$key = {
  readonly " $data"?: SettingsQueries_logins_user$data;
  readonly " $fragmentSpreads": FragmentRefs<"SettingsQueries_logins_user">;
};

const node: ReaderFragment = (function(){
var v0 = [
  "logins"
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
      "operation": require('./SettingsLoginsPaginationUser.graphql'),
      "identifierInfo": {
        "identifierField": "id",
        "identifierQueryVariableName": "id"
      }
    }
  },
  "name": "SettingsQueries_logins_user",
  "selections": [
    {
      "alias": "logins",
      "args": [
        {
          "kind": "Variable",
          "name": "reset",
          "variableName": "reset"
        }
      ],
      "concreteType": "LoginsConnection",
      "kind": "LinkedField",
      "name": "__Settings_user_logins_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "LoginEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Login",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                (v1/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "applicationName",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "time",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "address",
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
    (v1/*: any*/)
  ],
  "type": "AuthUser",
  "abstractKey": null
};
})();

(node as any).hash = "3b54fe70cbd6fe34802d0526616bc328";

export default node;
