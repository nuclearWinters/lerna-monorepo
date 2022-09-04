/**
 * @generated SignedSource<<4b9cb75aeafa1bc4e2d351f7e6d4596d>>
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
  readonly " $fragmentSpreads": FragmentRefs<"AddInvestments_auth_query" | "LoansToApprove_auth_user" | "MyLoans_auth_user" | "MyTransactions_auth_user" | "Settings_auth_user">;
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
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Settings_auth_user"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MyLoans_auth_user"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MyTransactions_auth_user"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "AddInvestments_auth_query"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "LoansToApprove_auth_user"
    }
  ],
  "type": "AuthUser",
  "abstractKey": null
};

(node as any).hash = "fe7b900fcee78b19ac3171a8c35ed511";

export default node;
