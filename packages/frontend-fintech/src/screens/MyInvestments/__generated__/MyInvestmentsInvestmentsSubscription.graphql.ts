/**
 * @generated SignedSource<<7b11360b0472cf53ac6b34e332dc5787>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type InvestmentStatus = "DELAY_PAYMENT" | "FINANCING" | "PAID" | "PAST_DUE" | "UP_TO_DATE" | "%future added value";
export type MyInvestmentsInvestmentsSubscription$variables = {
  connections: ReadonlyArray<string>;
  status?: ReadonlyArray<InvestmentStatus> | null | undefined;
};
export type MyInvestmentsInvestmentsSubscription$data = {
  readonly investments_subscribe_insert: {
    readonly cursor: string;
    readonly node: {
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
    } | null | undefined;
  };
};
export type MyInvestmentsInvestmentsSubscription = {
  response: MyInvestmentsInvestmentsSubscription$data;
  variables: MyInvestmentsInvestmentsSubscription$variables;
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
    "name": "MyInvestmentsInvestmentsSubscription",
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
    "name": "MyInvestmentsInvestmentsSubscription",
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
    "cacheID": "299797d0715653fcd7170aa994c2ea72",
    "id": null,
    "metadata": {},
    "name": "MyInvestmentsInvestmentsSubscription",
    "operationKind": "subscription",
    "text": "subscription MyInvestmentsInvestmentsSubscription(\n  $status: [InvestmentStatus!]\n) {\n  investments_subscribe_insert(status: $status) {\n    node {\n      id\n      borrower_id\n      lender_id\n      loan_id\n      quantity\n      ROI\n      payments\n      term\n      moratory\n      created_at\n      updated_at\n      status\n      interest_to_earn\n      paid_already\n      to_be_paid\n    }\n    cursor\n  }\n}\n"
  }
};
})();

(node as any).hash = "60ec4dddc5f22310cb486861f2a0163a";

export default node;
