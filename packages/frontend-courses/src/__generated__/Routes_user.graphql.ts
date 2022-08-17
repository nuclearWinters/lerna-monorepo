/**
 * @generated SignedSource<<820280898296d296fffa04bdadf0df25>>
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
  readonly accountTotal: string;
  readonly id: string;
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

(node as any).hash = "87c6b939513a04103bbaca07a652b924";

export default node;
