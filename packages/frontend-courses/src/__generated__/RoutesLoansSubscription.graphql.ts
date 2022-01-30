/**
 * @generated SignedSource<<57d87187868e6fcf07e37acb939b8ff2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type LoanScheduledPaymentStatus = "TO_BE_PAID" | "DELAYED" | "PAID" | "%future added value";
export type LoanStatus = "PAID" | "TO_BE_PAID" | "FINANCING" | "WAITING_FOR_APPROVAL" | "PAST_DUE" | "%future added value";
export type SubscribeType = "UPDATE" | "INSERT" | "%future added value";
export type RoutesLoansSubscription$variables = {
  status: ReadonlyArray<LoanStatus>;
};
export type RoutesLoansSubscriptionVariables = RoutesLoansSubscription$variables;
export type RoutesLoansSubscription$data = {
  readonly loans_subscribe: {
    readonly loan_edge: {
      readonly node: {
        readonly id: string;
        readonly _id_user: string;
        readonly score: string;
        readonly ROI: number;
        readonly goal: string;
        readonly term: number;
        readonly raised: string;
        readonly expiry: Int;
        readonly status: LoanStatus;
        readonly scheduledPayments: ReadonlyArray<{
          readonly amortize: string;
          readonly status: LoanScheduledPaymentStatus;
          readonly scheduledDate: Int;
        }> | null;
      } | null;
      readonly cursor: string;
    };
    readonly type: SubscribeType;
  };
};
export type RoutesLoansSubscriptionResponse = RoutesLoansSubscription$data;
export type RoutesLoansSubscription = {
  variables: RoutesLoansSubscriptionVariables;
  response: RoutesLoansSubscription$data;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "status"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "status",
        "variableName": "status"
      }
    ],
    "concreteType": "Loan_Subscribe",
    "kind": "LinkedField",
    "name": "loans_subscribe",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "LoanEdge",
        "kind": "LinkedField",
        "name": "loan_edge",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Loan",
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
                "name": "_id_user",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "score",
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
                "name": "goal",
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
                "name": "raised",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "expiry",
                "storageKey": null
              },
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "ScheduledPayments",
                "kind": "LinkedField",
                "name": "scheduledPayments",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "amortize",
                    "storageKey": null
                  },
                  (v1/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "scheduledDate",
                    "storageKey": null
                  }
                ],
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RoutesLoansSubscription",
    "selections": (v2/*: any*/),
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RoutesLoansSubscription",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "ad92025489beddea4f351e38eb1f6260",
    "id": null,
    "metadata": {},
    "name": "RoutesLoansSubscription",
    "operationKind": "subscription",
    "text": "subscription RoutesLoansSubscription(\n  $status: [LoanStatus!]!\n) {\n  loans_subscribe(status: $status) {\n    loan_edge {\n      node {\n        id\n        _id_user\n        score\n        ROI\n        goal\n        term\n        raised\n        expiry\n        status\n        scheduledPayments {\n          amortize\n          status\n          scheduledDate\n        }\n      }\n      cursor\n    }\n    type\n  }\n}\n"
  }
};
})();

(node as any).hash = "49f15ce5518f2311b8575c229580744d";

export default node;
