/**
 * @generated SignedSource<<3af65562ddfbba14ff0f3f119435021b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment, RefetchableFragment } from 'relay-runtime';
export type InvestmentStatus = "DELAY_PAYMENT" | "FINANCING" | "PAID" | "PAST_DUE" | "UP_TO_DATE" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type MyInvestmentsQueriesRow_investment$data = {
  readonly ROI: number;
  readonly borrower_id: string;
  readonly created_at: Int;
  readonly id: string;
  readonly interest_to_earn: string;
  readonly loan_id: string;
  readonly moratory: string;
  readonly paid_already: string;
  readonly payments: number;
  readonly quantity: string;
  readonly status: InvestmentStatus;
  readonly term: number;
  readonly to_be_paid: string;
  readonly updated_at: Int;
  readonly " $fragmentType": "MyInvestmentsQueriesRow_investment";
};
export type MyInvestmentsQueriesRow_investment$key = {
  readonly " $data"?: MyInvestmentsQueriesRow_investment$data;
  readonly " $fragmentSpreads": FragmentRefs<"MyInvestmentsQueriesRow_investment">;
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
      "operation": require('./MyInvestmentRowRefetchQuery.graphql'),
      "identifierInfo": {
        "identifierField": "id",
        "identifierQueryVariableName": "id"
      }
    }
  },
  "name": "MyInvestmentsQueriesRow_investment",
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
      "name": "borrower_id",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "loan_id",
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
      "name": "updated_at",
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
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "interest_to_earn",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "paid_already",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "to_be_paid",
      "storageKey": null
    }
  ],
  "type": "Investment",
  "abstractKey": null
};

(node as any).hash = "3da30e88e395c4e3d7cb8f7432eb6d7e";

export default node;
