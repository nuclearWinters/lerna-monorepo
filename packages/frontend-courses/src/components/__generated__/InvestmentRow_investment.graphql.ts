/**
 * @generated SignedSource<<cb884e4ff7d81557420b991b5afa377d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment, RefetchableFragment } from 'relay-runtime';
export type InvestmentStatus = "DELAY_PAYMENT" | "UP_TO_DATE" | "FINANCING" | "PAST_DUE" | "PAID" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type InvestmentRow_investment$data = {
  readonly id: string;
  readonly _id_borrower: string;
  readonly _id_loan: string;
  readonly quantity: number;
  readonly created: Int;
  readonly updated: Int;
  readonly status: InvestmentStatus;
  readonly payments: number;
  readonly ROI: number;
  readonly term: number;
  readonly moratory: string;
  readonly " $fragmentType": "InvestmentRow_investment";
};
export type InvestmentRow_investment = InvestmentRow_investment$data;
export type InvestmentRow_investment$key = {
  readonly " $data"?: InvestmentRow_investment$data;
  readonly " $fragmentSpreads": FragmentRefs<"InvestmentRow_investment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "refetch": {
      "connection": null,
      "fragmentPathInResult": [
        "node"
      ],
      "operation": require('./InvestmentRowRefetchQuery.graphql'),
      "identifierField": "id"
    }
  },
  "name": "InvestmentRow_investment",
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
      "name": "_id_borrower",
      "storageKey": null
    },
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
      "name": "created",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "updated",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "status",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "payments",
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
      "name": "term",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "moratory",
      "storageKey": null
    }
  ],
  "type": "Investment",
  "abstractKey": null
};

(node as any).hash = "3e1cac86e549c2f4e368fcae142c5584";

export default node;
