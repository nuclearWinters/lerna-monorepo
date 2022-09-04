/**
 * @generated SignedSource<<40cf797200dd4015fc37776e0ebb1dfb>>
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
      readonly _id_loan: string;
      readonly created: Int;
      readonly id: string;
      readonly id_borrower: string;
      readonly id_lender: string;
      readonly quantity: string;
      readonly status: InvestmentStatus;
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
    "cacheID": "6fe9c3969f9a6c6fd7fcbe88452ce53c",
    "id": null,
    "metadata": {},
    "name": "RoutesInvestmentsSubscription",
    "operationKind": "subscription",
    "text": "subscription RoutesInvestmentsSubscription(\n  $status: [InvestmentStatus!]\n) {\n  investments_subscribe_insert(status: $status) {\n    node {\n      id\n      id_borrower\n      id_lender\n      _id_loan\n      quantity\n      created\n      updated\n      status\n    }\n    cursor\n  }\n}\n"
  }
};
})();

(node as any).hash = "69aa5178aa530936387f532bda9f261c";

export default node;
