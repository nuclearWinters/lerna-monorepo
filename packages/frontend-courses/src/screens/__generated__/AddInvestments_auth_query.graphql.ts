/**
 * @generated SignedSource<<096d8b223f9ecfcd35a537382ecf4fea>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type Languages = "DEFAULT" | "EN" | "ES" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type AddInvestments_auth_query$data = {
  readonly accountId: string;
  readonly isBorrower: boolean;
  readonly isLender: boolean;
  readonly isSupport: boolean;
  readonly language: Languages;
  readonly " $fragmentType": "AddInvestments_auth_query";
};
export type AddInvestments_auth_query$key = {
  readonly " $data"?: AddInvestments_auth_query$data;
  readonly " $fragmentSpreads": FragmentRefs<"AddInvestments_auth_query">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "AddInvestments_auth_query",
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

(node as any).hash = "59ff36dc510ac521eba00d6c17b6b2c0";

export default node;
