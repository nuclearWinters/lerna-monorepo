/**
 * @generated SignedSource<<8841d8c7bba13226389050827efc3fb6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment, RefetchableFragment } from 'relay-runtime';
export type LoanScheduledPaymentStatus = "DELAYED" | "PAID" | "TO_BE_PAID" | "%future added value";
export type LoanStatus = "FINANCING" | "PAID" | "PAST_DUE" | "TO_BE_PAID" | "WAITING_FOR_APPROVAL" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type LoanRow_loan$data = {
  readonly ROI: number;
  readonly expiry: Int;
  readonly goal: string;
  readonly id: string;
  readonly id_user: string;
  readonly pending: string;
  readonly pendingCents: number;
  readonly raised: string;
  readonly scheduledPayments: ReadonlyArray<{
    readonly amortize: string;
    readonly scheduledDate: Int;
    readonly status: LoanScheduledPaymentStatus;
  }> | null;
  readonly score: string;
  readonly status: LoanStatus;
  readonly term: number;
  readonly " $fragmentType": "LoanRow_loan";
};
export type LoanRow_loan$key = {
  readonly " $data"?: LoanRow_loan$data;
  readonly " $fragmentSpreads": FragmentRefs<"LoanRow_loan">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "refetch": {
      "connection": null,
      "fragmentPathInResult": [
        "node"
      ],
      "operation": require('./LoanRowRefetchQuery.graphql'),
      "identifierField": "id"
    }
  },
  "name": "LoanRow_loan",
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
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "ScheduledPayments",
      "kind": "LinkedField",
      "name": "scheduledPayments",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "amortize",
          "storageKey": null
        },
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "scheduledDate",
          "storageKey": null
        }
      ],
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
})();

(node as any).hash = "69923bcac15fc0ac98ab7b3c948e328a";

export default node;
