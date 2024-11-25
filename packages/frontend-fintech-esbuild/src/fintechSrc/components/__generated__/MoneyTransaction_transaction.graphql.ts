/**
 * @generated SignedSource<<22fec502f6bc3028e37e7e2fd06939c8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type TransactionType = "COLLECT" | "CREDIT" | "INVEST" | "WITHDRAWAL" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type MoneyTransaction_transaction$data = {
  readonly created_at: Int;
  readonly id: string;
  readonly quantity: string;
  readonly type: TransactionType;
  readonly user_id: string;
  readonly " $fragmentType": "MoneyTransaction_transaction";
};
export type MoneyTransaction_transaction$key = {
  readonly " $data"?: MoneyTransaction_transaction$data;
  readonly " $fragmentSpreads": FragmentRefs<"MoneyTransaction_transaction">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MoneyTransaction_transaction",
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
    }
  ],
  "type": "MoneyTransaction",
  "abstractKey": null
};

(node as any).hash = "cdea304e3bf531f87d2ad9cf5bc5845e";

export default node;
