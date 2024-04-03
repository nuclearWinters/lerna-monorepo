/**
 * @generated SignedSource<<f28082493c268a89558790176d9ba73e>>
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
    readonly borrower_id: string;
    readonly created_at: Int;
    readonly id: string;
    readonly interest_to_earn: string;
    readonly lender_id: string;
    readonly loan_id: string;
    readonly moratory: string;
    readonly paid_already: string;
    readonly payments: number;
    readonly quantity: string;
    readonly status: InvestmentStatus;
    readonly term: number;
    readonly to_be_paid: string;
    readonly updated_at: Int;
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
        "name": "borrower_id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "lender_id",
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
    "cacheID": "c315341adb434eef30fc33f9c06cac21",
    "id": null,
    "metadata": {},
    "name": "MyInvestmentsInvestmentsUpdateSubscription",
    "operationKind": "subscription",
    "text": "subscription MyInvestmentsInvestmentsUpdateSubscription {\n  investments_subscribe_update {\n    id\n    borrower_id\n    lender_id\n    loan_id\n    quantity\n    ROI\n    payments\n    term\n    moratory\n    created_at\n    updated_at\n    status\n    interest_to_earn\n    paid_already\n    to_be_paid\n  }\n}\n"
  }
};
})();

(node as any).hash = "786781690506356754d16eb55fa165e3";

export default node;
