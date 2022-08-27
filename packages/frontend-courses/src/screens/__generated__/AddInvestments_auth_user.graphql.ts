/**
 * @generated SignedSource<<641071bdca339320e89909fad28f6811>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type Languages = "DEFAULT" | "EN" | "ES" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type AddInvestments_auth_user$data = {
  readonly accountId: string;
  readonly isBorrower: boolean;
  readonly isLender: boolean;
  readonly isSupport: boolean;
  readonly language: Languages;
  readonly " $fragmentType": "AddInvestments_auth_user";
};
export type AddInvestments_auth_user$key = {
  readonly " $data"?: AddInvestments_auth_user$data;
  readonly " $fragmentSpreads": FragmentRefs<"AddInvestments_auth_user">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "AddInvestments_auth_user",
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

(node as any).hash = "54234596e3f94b8789a8ed6bc7f0718a";

export default node;
