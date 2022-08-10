/**
 * @generated SignedSource<<488698b1355a3f10bac4bd6a660667fe>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Routes_user$data = {
  readonly accountAvailable: string;
  readonly id: string;
  readonly investmentsUser: ReadonlyArray<{
    readonly ROI: number;
    readonly _id_loan: string;
    readonly payments: number;
    readonly quantity: number;
    readonly term: number;
  }>;
  readonly " $fragmentSpreads": FragmentRefs<"Account_user" | "AddFunds_user" | "AddInvestments_user" | "AddLoan_user" | "MyInvestments_user" | "MyTransactions_user" | "RetireFunds_user">;
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
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "AddFunds_user"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "RetireFunds_user"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "AddLoan_user"
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
      "name": "AddInvestments_user"
    }
  ],
  "type": "User",
  "abstractKey": null
};

(node as any).hash = "cc56e05b133b933b84d8132ca6c5fdbd";

export default node;
