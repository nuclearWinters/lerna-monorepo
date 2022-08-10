/**
 * @generated SignedSource<<7203d322aeef93c7c29f8c9f1f3fabe3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Account_user$data = {
  readonly accountAvailable: string;
  readonly investmentsUser: ReadonlyArray<{
    readonly ROI: number;
    readonly _id_loan: string;
    readonly payments: number;
    readonly quantity: number;
    readonly term: number;
  }>;
  readonly " $fragmentType": "Account_user";
};
export type Account_user$key = {
  readonly " $data"?: Account_user$data;
  readonly " $fragmentSpreads": FragmentRefs<"Account_user">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Account_user",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "InvestmentsUser",
      "kind": "LinkedField",
      "name": "investmentsUser",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "_id_loan",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "quantity",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "term",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "ROI",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "payments",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "accountAvailable",
      "storageKey": null
    }
  ],
  "type": "User",
  "abstractKey": null
};

(node as any).hash = "7a6ee6d5495345f6a1e89e2242cca866";

export default node;
