/**
 * @generated SignedSource<<a0334dbbf2dd408a8db54b99dad622dd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type InvestmentStatus = "DELAY_PAYMENT" | "FINANCING" | "PAID" | "PAST_DUE" | "UP_TO_DATE" | "%future added value";
export type MyInvestmentsInvestmentsUpdateSubscription$variables = Record<PropertyKey, never>;
export type MyInvestmentsInvestmentsUpdateSubscription$data = {
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
export type MyInvestmentsInvestmentsUpdateSubscription = {
  response: MyInvestmentsInvestmentsUpdateSubscription$data;
  variables: MyInvestmentsInvestmentsUpdateSubscription$variables;
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
    "name": "MyInvestmentsInvestmentsUpdateSubscription",
    "selections": (v0/*: any*/),
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "MyInvestmentsInvestmentsUpdateSubscription",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "9a2ccf0b86e9a251a59ce2ce2069beb3",
    "id": null,
    "metadata": {},
    "name": "MyInvestmentsInvestmentsUpdateSubscription",
    "operationKind": "subscription",
    "text": "subscription MyInvestmentsInvestmentsUpdateSubscription {\n  investments_subscribe_update {\n    id\n    id_borrower\n    id_lender\n    _id_loan\n    quantity\n    ROI\n    payments\n    term\n    moratory\n    created\n    updated\n    status\n    interest_to_earn\n    paid_already\n    to_be_paid\n  }\n}\n"
  }
};
})();

(node as any).hash = "f57ee5ddb2c06d3271cc2a40459ceba0";

export default node;
