/**
 * @generated SignedSource<<9dbf6a0586353831c95c07154234b3c3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type TransactionType = "COLLECT" | "CREDIT" | "INVEST" | "WITHDRAWAL" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type MoneyTransaction_transaction$data = {
  readonly created_at: Int;
  readonly id: string;
  readonly id_user: string;
  readonly quantity: string;
  readonly type: TransactionType;
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
    }
  ],
  "type": "MoneyTransaction",
  "abstractKey": null
};

(node as any).hash = "6453efe797ecc1389b60be36ecb53255";

export default node;
