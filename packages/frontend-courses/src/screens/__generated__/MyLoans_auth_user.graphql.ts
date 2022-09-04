/**
 * @generated SignedSource<<5de5b699b2fafbca3383119c725bc025>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type Languages = "DEFAULT" | "EN" | "ES" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type MyLoans_auth_user$data = {
  readonly accountId: string;
  readonly isBorrower: boolean;
  readonly isLender: boolean;
  readonly isSupport: boolean;
  readonly language: Languages;
  readonly " $fragmentType": "MyLoans_auth_user";
};
export type MyLoans_auth_user$key = {
  readonly " $data"?: MyLoans_auth_user$data;
  readonly " $fragmentSpreads": FragmentRefs<"MyLoans_auth_user">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MyLoans_auth_user",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isLender",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isSupport",
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
      "name": "language",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "accountId",
      "storageKey": null
    }
  ],
  "type": "AuthUser",
  "abstractKey": null
};

(node as any).hash = "fad68266ce3dae0a85a30978f6db4321";

export default node;
