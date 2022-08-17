/**
 * @generated SignedSource<<3dbc54067c1e0ce9c0c4e35f2cfe6f45>>
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
  readonly accountInterests: string;
  readonly accountLent: string;
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
      "name": "accountLent",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "accountInterests",
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

(node as any).hash = "24e0beafd6a4f9fb985f28a4c9eaef7c";

export default node;
