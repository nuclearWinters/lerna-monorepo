/**
 * @generated SignedSource<<8e6395b91ab7c9530d80a4ea7c8a886f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type InvestmentStatus = "DELAY_PAYMENT" | "FINANCING" | "PAID" | "PAST_DUE" | "UP_TO_DATE" | "%future added value";
export type MyInvestmentsQueriesSubscription$variables = {
  connections: ReadonlyArray<string>;
  status?: ReadonlyArray<InvestmentStatus> | null | undefined;
};
export type MyInvestmentsQueriesSubscription$data = {
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
export type MyInvestmentsQueriesSubscription = {
  response: MyInvestmentsQueriesSubscription$data;
  variables: MyInvestmentsQueriesSubscription$variables;
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
    "name": "MyInvestmentsQueriesSubscription",
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
    "name": "MyInvestmentsQueriesSubscription",
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
    "cacheID": "5779bdaed33088e4b35465d39b5fa485",
    "id": null,
    "metadata": {},
    "name": "MyInvestmentsQueriesSubscription",
    "operationKind": "subscription",
    "text": "subscription MyInvestmentsQueriesSubscription(\n  $status: [InvestmentStatus!]\n) {\n  investments_subscribe_insert(status: $status) {\n    node {\n      id\n      borrower_id\n      lender_id\n      loan_id\n      quantity\n      ROI\n      payments\n      term\n      moratory\n      created_at\n      updated_at\n      status\n      interest_to_earn\n      paid_already\n      to_be_paid\n    }\n    cursor\n  }\n}\n"
  }
};
})();

(node as any).hash = "a3f9bfd5a8a2e2ec28f553ac47a81d14";

export default node;
