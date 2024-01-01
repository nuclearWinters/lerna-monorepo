/**
 * @generated SignedSource<<7d4bbc08a10135d9ab46f28196725417>>
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
    readonly created_at: Int;
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
    "cacheID": "a8a2962404b499d62874dc8df8b39dd2",
    "id": null,
    "metadata": {},
    "name": "MyInvestmentsInvestmentsUpdateSubscription",
    "operationKind": "subscription",
    "text": "subscription MyInvestmentsInvestmentsUpdateSubscription {\n  investments_subscribe_update {\n    id\n    id_borrower\n    id_lender\n    _id_loan\n    quantity\n    ROI\n    payments\n    term\n    moratory\n    created_at\n    updated_at\n    status\n    interest_to_earn\n    paid_already\n    to_be_paid\n  }\n}\n"
  }
};
})();

(node as any).hash = "3619dad285fabce091c558a875d88bcc";

export default node;
