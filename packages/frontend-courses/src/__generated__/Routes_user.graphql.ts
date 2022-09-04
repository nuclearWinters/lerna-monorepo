/**
 * @generated SignedSource<<c7ad9593f4cde34b73fbd7858e586a1c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type InvestmentStatus = "DELAY_PAYMENT" | "FINANCING" | "PAID" | "PAST_DUE" | "UP_TO_DATE" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type Routes_user$data = {
  readonly accountAvailable: string;
  readonly accountId: string;
  readonly accountTotal: string;
  readonly id: string;
  readonly statusLocal: ReadonlyArray<InvestmentStatus> | null;
  readonly " $fragmentSpreads": FragmentRefs<"Account_user" | "LoansToApprove_user" | "MyInvestments_user" | "MyLoans_user" | "MyTransactions_user">;
  readonly " $fragmentType": "Routes_user";
};
export type Routes_user$key = {
  readonly " $data"?: Routes_user$data;
  readonly " $fragmentSpreads": FragmentRefs<"Routes_user">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Routes_user",
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
      "name": "accountAvailable",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "accountTotal",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "accountId",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Account_user"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MyTransactions_user"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MyInvestments_user"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MyLoans_user"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "LoansToApprove_user"
    },
    {
      "kind": "ClientExtension",
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "statusLocal",
          "storageKey": null
        }
      ]
    }
  ],
  "type": "User",
  "abstractKey": null
};

(node as any).hash = "24c7684188c4945a32ef0901a820e909";

export default node;
