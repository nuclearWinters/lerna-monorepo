/**
 * @generated SignedSource<<2782e4ffeab4b0a382e98abbb2101bd4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type AddFunds_user$data = {
  readonly id: string;
  readonly " $fragmentType": "AddFunds_user";
};
export type AddFunds_user = AddFunds_user$data;
export type AddFunds_user$key = {
  readonly " $data"?: AddFunds_user$data;
  readonly " $fragmentSpreads": FragmentRefs<"AddFunds_user">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "AddFunds_user",
  "selections": [
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

(node as any).hash = "29fe39a8c3737ed57a71de59ab5b53cc";

export default node;
