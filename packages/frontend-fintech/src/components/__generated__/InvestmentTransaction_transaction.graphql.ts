/**
 * @generated SignedSource<<22c5a43d0bfe325387df89f97f9b7d8b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type TransactionType = "COLLECT" | "CREDIT" | "INVEST" | "WITHDRAWAL" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type InvestmentTransaction_transaction$data = {
  readonly _id_loan: string;
  readonly created_at: Int;
  readonly id: string;
  readonly id_borrower: string;
  readonly id_user: string;
  readonly quantity: string;
  readonly type: TransactionType;
  readonly " $fragmentType": "InvestmentTransaction_transaction";
};
export type InvestmentTransaction_transaction$key = {
  readonly " $data"?: InvestmentTransaction_transaction$data;
  readonly " $fragmentSpreads": FragmentRefs<"InvestmentTransaction_transaction">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "InvestmentTransaction_transaction",
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
      "name": "id_user",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "type",
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
      "name": "created_at",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id_borrower",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "_id_loan",
      "storageKey": null
    }
  ],
  "type": "InvestTransaction",
  "abstractKey": null
};

(node as any).hash = "e12f17e01c52c8b835a48805d905740f";

export default node;
