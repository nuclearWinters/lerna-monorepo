/**
 * @generated SignedSource<<01e2f367a960b10463bc3809b298cfb3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment, RefetchableFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type AddInvestmentsQueriesRowRefetch_loan$data = {
  readonly ROI: number;
  readonly expiry: Int;
  readonly goal: string;
  readonly id: string;
  readonly pending: string;
  readonly pendingCents: number;
  readonly raised: string;
  readonly score: string;
  readonly term: number;
  readonly user_id: string;
  readonly " $fragmentType": "AddInvestmentsQueriesRowRefetch_loan";
};
export type AddInvestmentsQueriesRowRefetch_loan$key = {
  readonly " $data"?: AddInvestmentsQueriesRowRefetch_loan$data;
  readonly " $fragmentSpreads": FragmentRefs<"AddInvestmentsQueriesRowRefetch_loan">;
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
      "operation": require('./AddInvestmentQueriesRefetchQuery.graphql'),
      "identifierInfo": {
        "identifierField": "id",
        "identifierQueryVariableName": "id"
      }
    }
  },
  "name": "AddInvestmentsQueriesRowRefetch_loan",
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
      "name": "pending",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "pendingCents",
      "storageKey": null
    }
  ],
  "type": "Loan",
  "abstractKey": null
};

(node as any).hash = "7daaf3144cccffc8a3552c697e549803";

export default node;
