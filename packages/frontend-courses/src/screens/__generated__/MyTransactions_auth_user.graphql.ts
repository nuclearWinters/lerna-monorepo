/**
 * @generated SignedSource<<a40ac11b7d656e9b7f0bf986c63e60cc>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type Languages = "DEFAULT" | "EN" | "ES" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type MyTransactions_auth_user$data = {
  readonly language: Languages;
  readonly " $fragmentType": "MyTransactions_auth_user";
};
export type MyTransactions_auth_user$key = {
  readonly " $data"?: MyTransactions_auth_user$data;
  readonly " $fragmentSpreads": FragmentRefs<"MyTransactions_auth_user">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MyTransactions_auth_user",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "language",
      "storageKey": null
    }
  ],
  "type": "AuthUser",
  "abstractKey": null
};

(node as any).hash = "72c80385958f65f29f01c925d3e8204f";

export default node;
