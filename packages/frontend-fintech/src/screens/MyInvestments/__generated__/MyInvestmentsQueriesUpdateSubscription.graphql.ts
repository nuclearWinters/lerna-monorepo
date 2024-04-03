/**
 * @generated SignedSource<<f873c9c666cc05d1cc0ef8af4f93bad4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type InvestmentStatus = "DELAY_PAYMENT" | "FINANCING" | "PAID" | "PAST_DUE" | "UP_TO_DATE" | "%future added value";
export type MyInvestmentsQueriesUpdateSubscription$variables = Record<PropertyKey, never>;
export type MyInvestmentsQueriesUpdateSubscription$data = {
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
export type MyInvestmentsQueriesUpdateSubscription = {
  response: MyInvestmentsQueriesUpdateSubscription$data;
  variables: MyInvestmentsQueriesUpdateSubscription$variables;
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
    "name": "MyInvestmentsQueriesUpdateSubscription",
    "selections": (v0/*: any*/),
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "MyInvestmentsQueriesUpdateSubscription",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "5f2434483903e5e4f6ada9e316f0bb94",
    "id": null,
    "metadata": {},
    "name": "MyInvestmentsQueriesUpdateSubscription",
    "operationKind": "subscription",
    "text": "subscription MyInvestmentsQueriesUpdateSubscription {\n  investments_subscribe_update {\n    id\n    borrower_id\n    lender_id\n    loan_id\n    quantity\n    ROI\n    payments\n    term\n    moratory\n    created_at\n    updated_at\n    status\n    interest_to_earn\n    paid_already\n    to_be_paid\n  }\n}\n"
  }
};
})();

(node as any).hash = "8d69934f9ac337229e03a416a6a6cd11";

export default node;
