/**
 * @generated SignedSource<<ce565a727bf4833af2149ce0c85c179a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type Languages = "DEFAULT" | "EN" | "ES" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type Routes_auth_user$data = {
  readonly apellidoMaterno: string;
  readonly apellidoPaterno: string;
  readonly id: string;
  readonly isBorrower: boolean;
  readonly isSupport: boolean;
  readonly language: Languages;
  readonly name: string;
  readonly " $fragmentType": "Routes_auth_user";
};
export type Routes_auth_user$key = {
  readonly " $data"?: Routes_auth_user$data;
  readonly " $fragmentSpreads": FragmentRefs<"Routes_auth_user">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Routes_auth_user",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "apellidoPaterno",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "apellidoMaterno",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "language",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isBorrower",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isSupport",
      "storageKey": null
    }
  ],
  "type": "AuthUser",
  "abstractKey": null
};

(node as any).hash = "08ee99f2cf062f6c77f171612f9dd707";

export default node;
