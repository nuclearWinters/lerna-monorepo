/**
 * @generated SignedSource<<58e914233b49aeb7bfe0ec8070b2ada8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type AddLoan_user$data = {
  readonly id: string;
  readonly " $fragmentType": "AddLoan_user";
};
export type AddLoan_user$key = {
  readonly " $data"?: AddLoan_user$data;
  readonly " $fragmentSpreads": FragmentRefs<"AddLoan_user">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "AddLoan_user",
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

(node as any).hash = "2d1cbc45c30f5a531698f4be303084a6";

export default node;
