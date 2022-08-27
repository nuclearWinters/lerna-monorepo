/**
 * @generated SignedSource<<0bf48093eb4907aa34b39c30179795a1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Account_user$data = {
  readonly accountAvailable: string;
  readonly accountToBePaid: string;
  readonly accountTotal: string;
  readonly " $fragmentType": "Account_user";
};
export type Account_user$key = {
  readonly " $data"?: Account_user$data;
  readonly " $fragmentSpreads": FragmentRefs<"Account_user">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Account_user",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "accountAvailable",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "accountToBePaid",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "accountTotal",
      "storageKey": null
    }
  ],
  "type": "User",
  "abstractKey": null
};

(node as any).hash = "d278d7eb1771a9bbe5622b33386cab08";

export default node;
