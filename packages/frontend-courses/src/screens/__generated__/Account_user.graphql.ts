/**
 * @generated SignedSource<<eb6657ec3f8e5f84f5b202f047cb21c8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Account_user$data = {
  readonly investments: ReadonlyArray<{
    readonly _id_loan: string;
    readonly quantity: number;
    readonly term: number;
    readonly ROI: number;
    readonly payments: number;
  }>;
  readonly accountAvailable: string;
  readonly " $fragmentType": "Account_user";
};
export type Account_user = Account_user$data;
export type Account_user$key = {
  readonly " $data"?: Account_user$data;
  readonly " $fragmentSpreads": FragmentRefs<"Account_user">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Account_user",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "InvestmentsUser",
      "kind": "LinkedField",
      "name": "investments",
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
    }
  ],
  "type": "User",
  "abstractKey": null
};

(node as any).hash = "1884c9fb8ba3ee24887c8a3fef615176";

export default node;
