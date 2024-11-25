/**
 * @generated SignedSource<<b2b41b4fab09b0de057e0cbbc56843a0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type TransactionType = "COLLECT" | "CREDIT" | "INVEST" | "WITHDRAWAL" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type InvestmentTransaction_transaction$data = {
  readonly borrower_id: string;
  readonly created_at: Int;
  readonly id: string;
  readonly loan_id: string;
  readonly quantity: string;
  readonly type: TransactionType;
  readonly user_id: string;
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
      "name": "user_id",
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
      "name": "borrower_id",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "loan_id",
      "storageKey": null
    }
  ],
  "type": "InvestTransaction",
  "abstractKey": null
};

(node as any).hash = "5bf9679d7d1107ae0dd64c0a03a46d20";

export default node;
