/**
 * @generated SignedSource<<cd335de506d7dc50c8a2b2055ab8e77d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type Languages = "DEFAULT" | "EN" | "ES" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type Routes_query$data = {
  readonly authUser: {
    readonly apellidoMaterno: string;
    readonly apellidoPaterno: string;
    readonly id: string;
    readonly isBorrower: boolean;
    readonly isSupport: boolean;
    readonly language: Languages;
    readonly name: string;
    readonly " $fragmentSpreads": FragmentRefs<"CheckExpiration_auth_user" | "Settings_auth_user">;
  };
  readonly user: {
    readonly accountAvailable: string;
    readonly id: string;
    readonly investments: ReadonlyArray<{
      readonly ROI: number;
      readonly _id_loan: string;
      readonly payments: number;
      readonly quantity: number;
      readonly term: number;
    }>;
    readonly " $fragmentSpreads": FragmentRefs<"Account_user" | "AddFunds_user" | "AddLoan_user" | "RetireFunds_user">;
  };
  readonly " $fragmentType": "Routes_query";
};
export type Routes_query$key = {
  readonly " $data"?: Routes_query$data;
  readonly " $fragmentSpreads": FragmentRefs<"Routes_query">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Routes_query",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "User",
      "kind": "LinkedField",
      "name": "user",
      "plural": false,
      "selections": [
        (v0/*: any*/),
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
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "AuthUser",
      "kind": "LinkedField",
      "name": "authUser",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "name",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "apellidoPaterno",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "apellidoMaterno",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "language",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "isBorrower",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "isSupport",
          "storageKey": null
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "Settings_auth_user"
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "CheckExpiration_auth_user"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};
})();

(node as any).hash = "beb0149f38285d3b2dc9247e1e5f94af";

export default node;
