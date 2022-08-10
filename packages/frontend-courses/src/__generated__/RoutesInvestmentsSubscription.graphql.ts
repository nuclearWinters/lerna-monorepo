/**
 * @generated SignedSource<<2acfa08342ef40d18a0b54ce2eafee93>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type InvestmentStatus = "DELAY_PAYMENT" | "FINANCING" | "PAID" | "PAST_DUE" | "UP_TO_DATE" | "%future added value";
export type SubscribeType = "INSERT" | "UPDATE" | "%future added value";
export type RoutesInvestmentsSubscription$variables = {
  status: ReadonlyArray<InvestmentStatus>;
  user_gid: string;
};
export type RoutesInvestmentsSubscription$data = {
  readonly investments_subscribe: {
    readonly investment_edge: {
      readonly cursor: string;
      readonly node: {
        readonly _id_loan: string;
        readonly created: Int;
        readonly id: string;
        readonly id_borrower: string;
        readonly id_lender: string;
        readonly quantity: number;
        readonly status: InvestmentStatus;
        readonly updated: Int;
      } | null;
    };
    readonly type: SubscribeType;
  };
};
export type RoutesInvestmentsSubscription = {
  response: RoutesInvestmentsSubscription$data;
  variables: RoutesInvestmentsSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "status"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "user_gid"
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "status",
        "variableName": "status"
      },
      {
        "kind": "Variable",
        "name": "user_gid",
        "variableName": "user_gid"
      }
    ],
    "concreteType": "Investment_Subscribe",
    "kind": "LinkedField",
    "name": "investments_subscribe",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "InvestmentsEdge",
        "kind": "LinkedField",
        "name": "investment_edge",
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
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "type",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "RoutesInvestmentsSubscription",
    "selections": (v2/*: any*/),
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "RoutesInvestmentsSubscription",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "15054c4e49c2c8c6b9f6dd679c3e749b",
    "id": null,
    "metadata": {},
    "name": "RoutesInvestmentsSubscription",
    "operationKind": "subscription",
    "text": "subscription RoutesInvestmentsSubscription(\n  $user_gid: ID!\n  $status: [InvestmentStatus!]!\n) {\n  investments_subscribe(user_gid: $user_gid, status: $status) {\n    investment_edge {\n      node {\n        id\n        id_borrower\n        id_lender\n        _id_loan\n        quantity\n        created\n        updated\n        status\n      }\n      cursor\n    }\n    type\n  }\n}\n"
  }
};
})();

(node as any).hash = "a60951f9f2fc31bc54a02ab632e42780";

export default node;
