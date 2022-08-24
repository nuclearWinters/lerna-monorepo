/**
 * @generated SignedSource<<eb5a981c28bff0d4cb0a8970a948c881>>
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
  readonly accountId: string;
  readonly accountTotal: string;
  readonly id: string;
  readonly " $fragmentSpreads": FragmentRefs<"Account_user" | "AddInvestments_user" | "MyInvestments_user" | "MyTransactions_user">;
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
      "name": "AddInvestments_user"
    }
  ],
  "type": "User",
  "abstractKey": null
};

(node as any).hash = "6a5eddd0506d43ba508a36f6fd397ac7";

export default node;
