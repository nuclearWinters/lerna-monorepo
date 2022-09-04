/**
 * @generated SignedSource<<eac37099021ca94449e5c30276066ff6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type Languages = "DEFAULT" | "EN" | "ES" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type AddInvestments_auth_quer$data = {
  readonly accountId: string;
  readonly isBorrower: boolean;
  readonly isLender: boolean;
  readonly isSupport: boolean;
  readonly language: Languages;
  readonly " $fragmentType": "AddInvestments_auth_quer";
};
export type AddInvestments_auth_quer$key = {
  readonly " $data"?: AddInvestments_auth_quer$data;
  readonly " $fragmentSpreads": FragmentRefs<"AddInvestments_auth_quer">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "AddInvestments_auth_quer",
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

(node as any).hash = "634b82946dcaa04c02559f9f1b4c3e97";

export default node;
