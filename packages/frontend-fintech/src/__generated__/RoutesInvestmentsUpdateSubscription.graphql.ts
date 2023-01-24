/**
 * @generated SignedSource<<b0078bfe47644195dfcd8385a7ffa5d1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type InvestmentStatus = "DELAY_PAYMENT" | "FINANCING" | "PAID" | "PAST_DUE" | "UP_TO_DATE" | "%future added value";
export type RoutesInvestmentsUpdateSubscription$variables = {};
export type RoutesInvestmentsUpdateSubscription$data = {
  readonly investments_subscribe_update: {
    readonly ROI: number;
    readonly _id_loan: string;
    readonly created: Int;
    readonly id: string;
    readonly id_borrower: string;
    readonly id_lender: string;
    readonly interest_to_earn: string;
    readonly moratory: string;
    readonly paid_already: string;
    readonly payments: number;
    readonly quantity: string;
    readonly status: InvestmentStatus;
    readonly term: number;
    readonly to_be_paid: string;
    readonly updated: Int;
  };
};
export type RoutesInvestmentsUpdateSubscription = {
  response: RoutesInvestmentsUpdateSubscription$data;
  variables: RoutesInvestmentsUpdateSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Investment",
    "kind": "LinkedField",
    "name": "investments_subscribe_update",
    "plural": false,
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
        "name": "id_borrower",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id_lender",
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
        "name": "ROI",
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
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "RoutesInvestmentsUpdateSubscription",
    "selections": (v0/*: any*/),
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "RoutesInvestmentsUpdateSubscription",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "905c8180b226696e906ba1518da14fd7",
    "id": null,
    "metadata": {},
    "name": "RoutesInvestmentsUpdateSubscription",
    "operationKind": "subscription",
    "text": "subscription RoutesInvestmentsUpdateSubscription {\n  investments_subscribe_update {\n    id\n    id_borrower\n    id_lender\n    _id_loan\n    quantity\n    ROI\n    payments\n    term\n    moratory\n    created\n    updated\n    status\n    interest_to_earn\n    paid_already\n    to_be_paid\n  }\n}\n"
  }
};
})();

(node as any).hash = "a3476be9c8a42cf4d34a1dcdd0ac8d3b";

export default node;
