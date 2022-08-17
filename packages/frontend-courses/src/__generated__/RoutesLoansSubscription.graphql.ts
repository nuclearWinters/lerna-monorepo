/**
 * @generated SignedSource<<2a70da177a4129acaa837bc2792f80e9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type LoanScheduledPaymentStatus = "DELAYED" | "PAID" | "TO_BE_PAID" | "%future added value";
export type LoanStatus = "FINANCING" | "PAID" | "PAST_DUE" | "TO_BE_PAID" | "WAITING_FOR_APPROVAL" | "%future added value";
export type SubscribeType = "INSERT" | "UPDATE" | "%future added value";
export type RoutesLoansSubscription$variables = {
  status: ReadonlyArray<LoanStatus>;
};
export type RoutesLoansSubscription$data = {
  readonly loans_subscribe: {
    readonly loan_edge: {
      readonly cursor: string;
      readonly node: {
        readonly ROI: number;
        readonly expiry: Int;
        readonly goal: string;
        readonly id: string;
        readonly id_user: string;
        readonly raised: string;
        readonly scheduledPayments: ReadonlyArray<{
          readonly amortize: string;
          readonly scheduledDate: Int;
          readonly status: LoanScheduledPaymentStatus;
        }> | null;
        readonly score: string;
        readonly status: LoanStatus;
        readonly term: number;
      } | null;
    };
    readonly type: SubscribeType;
  };
};
export type RoutesLoansSubscription = {
  response: RoutesLoansSubscription$data;
  variables: RoutesLoansSubscription$variables;
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
                "name": "id_user",
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
    "cacheID": "1e6ca67320f32786ebeee69422453d68",
    "id": null,
    "metadata": {},
    "name": "RoutesLoansSubscription",
    "operationKind": "subscription",
    "text": "subscription RoutesLoansSubscription(\n  $status: [LoanStatus!]!\n) {\n  loans_subscribe(status: $status) {\n    loan_edge {\n      node {\n        id\n        id_user\n        score\n        ROI\n        goal\n        term\n        raised\n        expiry\n        status\n        scheduledPayments {\n          amortize\n          status\n          scheduledDate\n        }\n      }\n      cursor\n    }\n    type\n  }\n}\n"
  }
};
})();

(node as any).hash = "996119fb63fdb1771ca67593d26383fc";

export default node;
