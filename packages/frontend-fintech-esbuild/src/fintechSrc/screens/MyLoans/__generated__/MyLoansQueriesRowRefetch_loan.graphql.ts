/**
 * @generated SignedSource<<a28410f0ed68811701dc9d890e37c971>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type LoanStatus = "FINANCING" | "PAID" | "PAST_DUE" | "TO_BE_PAID" | "WAITING_FOR_APPROVAL" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type MyLoansQueriesRowRefetch_loan$data = {
  readonly ROI: number;
  readonly expiry: Int;
  readonly goal: string;
  readonly id: string;
  readonly pending: string;
  readonly raised: string;
  readonly score: string;
  readonly status: LoanStatus;
  readonly term: number;
  readonly user_id: string;
  readonly " $fragmentType": "MyLoansQueriesRowRefetch_loan";
};
export type MyLoansQueriesRowRefetch_loan$key = {
  readonly " $data"?: MyLoansQueriesRowRefetch_loan$data;
  readonly " $fragmentSpreads": FragmentRefs<"MyLoansQueriesRowRefetch_loan">;
};

import MyLoansQueriesRefetchQuery_graphql from './MyLoansQueriesRefetchQuery.graphql';

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "refetch": {
      "connection": null,
      "fragmentPathInResult": [
        "node"
      ],
      "operation": MyLoansQueriesRefetchQuery_graphql,
      "identifierInfo": {
        "identifierField": "id",
        "identifierQueryVariableName": "id"
      }
    }
  },
  "name": "MyLoansQueriesRowRefetch_loan",
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
      "name": "score",
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
      "name": "goal",
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
      "name": "raised",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "expiry",
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
      "name": "pending",
      "storageKey": null
    }
  ],
  "type": "Loan",
  "abstractKey": null
};

(node as any).hash = "b9bd23b9161ac47acd933bc5b8ded744";

export default node;
