/**
 * @generated SignedSource<<a6ddc84710c88648fb7aed7f31d6d30e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type InvestmentStatus = "DELAY_PAYMENT" | "FINANCING" | "PAID" | "PAST_DUE" | "UP_TO_DATE" | "%future added value";
export type RoutesInvestmentsSubscription$variables = {
  connections: ReadonlyArray<string>;
  status?: ReadonlyArray<InvestmentStatus> | null;
};
export type RoutesInvestmentsSubscription$data = {
  readonly investments_subscribe_insert: {
    readonly cursor: string;
    readonly node: {
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
    } | null;
  };
};
export type RoutesInvestmentsSubscription = {
  response: RoutesInvestmentsSubscription$data;
  variables: RoutesInvestmentsSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "connections"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "status"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "status",
    "variableName": "status"
  }
],
v2 = {
  "alias": null,
  "args": (v1/*: any*/),
  "concreteType": "InvestmentsEdge",
  "kind": "LinkedField",
  "name": "investments_subscribe_insert",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Investment",
      "kind": "LinkedField",
      "name": "node",
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
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "cursor",
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RoutesInvestmentsSubscription",
    "selections": [
      (v2/*: any*/)
    ],
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RoutesInvestmentsSubscription",
    "selections": [
      (v2/*: any*/),
      {
        "alias": null,
        "args": (v1/*: any*/),
        "filters": null,
        "handle": "prependEdge",
        "key": "",
        "kind": "LinkedHandle",
        "name": "investments_subscribe_insert",
        "handleArgs": [
          {
            "kind": "Variable",
            "name": "connections",
            "variableName": "connections"
          }
        ]
      }
    ]
  },
  "params": {
    "cacheID": "5875d644325b9c79b14ced1fbcd2325d",
    "id": null,
    "metadata": {},
    "name": "RoutesInvestmentsSubscription",
    "operationKind": "subscription",
    "text": "subscription RoutesInvestmentsSubscription(\n  $status: [InvestmentStatus!]\n) {\n  investments_subscribe_insert(status: $status) {\n    node {\n      id\n      id_borrower\n      id_lender\n      _id_loan\n      quantity\n      ROI\n      payments\n      term\n      moratory\n      created\n      updated\n      status\n      interest_to_earn\n      paid_already\n      to_be_paid\n    }\n    cursor\n  }\n}\n"
  }
};
})();

(node as any).hash = "b1a5941ff04725186f2451c9636b0c72";

export default node;
