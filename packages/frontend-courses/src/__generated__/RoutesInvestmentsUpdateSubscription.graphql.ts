/**
 * @generated SignedSource<<6be9a100c752e3393e47a4e4cc6267b1>>
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
    readonly _id_loan: string;
    readonly created: Int;
    readonly id: string;
    readonly id_borrower: string;
    readonly id_lender: string;
    readonly quantity: string;
    readonly status: InvestmentStatus;
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
    "cacheID": "2f20c3941a75f416e2b48affc8d3e91c",
    "id": null,
    "metadata": {},
    "name": "RoutesInvestmentsUpdateSubscription",
    "operationKind": "subscription",
    "text": "subscription RoutesInvestmentsUpdateSubscription {\n  investments_subscribe_update {\n    id\n    id_borrower\n    id_lender\n    _id_loan\n    quantity\n    created\n    updated\n    status\n  }\n}\n"
  }
};
})();

(node as any).hash = "4cb93e2adf3f235634c50c887ee2a3c4";

export default node;
