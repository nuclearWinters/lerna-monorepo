/**
 * @generated SignedSource<<39cd0d321866b11a7f7e058687f69c59>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type RetireFunds_user$data = {
  readonly id: string;
  readonly " $fragmentType": "RetireFunds_user";
};
export type RetireFunds_user$key = {
  readonly " $data"?: RetireFunds_user$data;
  readonly " $fragmentSpreads": FragmentRefs<"RetireFunds_user">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "RetireFunds_user",
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

(node as any).hash = "87bead93c556c7b81e8309b608ee05f2";

export default node;
