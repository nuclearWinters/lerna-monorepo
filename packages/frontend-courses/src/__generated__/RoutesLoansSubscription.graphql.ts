/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type LoanScheduledPaymentStatus =
  | "DELAYED"
  | "PAID"
  | "TO_BE_PAID"
  | "%future added value";
export type LoanStatus =
  | "FINANCING"
  | "PAID"
  | "PAST_DUE"
  | "TO_BE_PAID"
  | "WAITING_FOR_APPROVAL"
  | "%future added value";
export type SubscribeType = "INSERT" | "UPDATE" | "%future added value";
export type RoutesLoansSubscriptionVariables = {
  status: Array<LoanStatus>;
};
export type RoutesLoansSubscriptionResponse = {
  readonly loans_subscribe: {
    readonly loan_edge: {
      readonly node: {
        readonly loan_gid: string;
        readonly _id_user: string | null;
        readonly score: string | null;
        readonly ROI: number | null;
        readonly goal: string | null;
        readonly term: number | null;
        readonly raised: string | null;
        readonly expiry: number | null;
        readonly status: LoanStatus | null;
        readonly scheduledPayments: ReadonlyArray<{
          readonly amortize: string;
          readonly status: LoanScheduledPaymentStatus;
          readonly scheduledDate: number;
        }> | null;
      };
      readonly cursor: string;
    };
    readonly type: SubscribeType;
  };
};
export type RoutesLoansSubscription = {
  readonly response: RoutesLoansSubscriptionResponse;
  readonly variables: RoutesLoansSubscriptionVariables;
};

/*
subscription RoutesLoansSubscription(
  $status: [LoanStatus!]!
) {
  loans_subscribe(status: $status) {
    loan_edge {
      node {
        loan_gid
        _id_user
        score
        ROI
        goal
        term
        raised
        expiry
        status
        scheduledPayments {
          amortize
          status
          scheduledDate
        }
      }
      cursor
    }
    type
  }
}
*/

const node: ConcreteRequest = (function () {
  var v0 = [
      {
        defaultValue: null,
        kind: "LocalArgument",
        name: "status",
      } as any,
    ],
    v1 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "status",
      storageKey: null,
    } as any,
    v2 = [
      {
        alias: null,
        args: [
          {
            kind: "Variable",
            name: "status",
            variableName: "status",
          },
        ],
        concreteType: "Loan_Subscribe",
        kind: "LinkedField",
        name: "loans_subscribe",
        plural: false,
        selections: [
          {
            alias: null,
            args: null,
            concreteType: "LoanEdgeSubscription",
            kind: "LinkedField",
            name: "loan_edge",
            plural: false,
            selections: [
              {
                alias: null,
                args: null,
                concreteType: "LoanNodeSubscription",
                kind: "LinkedField",
                name: "node",
                plural: false,
                selections: [
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "loan_gid",
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "_id_user",
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "score",
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "ROI",
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "goal",
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "term",
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "raised",
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "expiry",
                    storageKey: null,
                  },
                  v1 /*: any*/,
                  {
                    alias: null,
                    args: null,
                    concreteType: "ScheduledPayments",
                    kind: "LinkedField",
                    name: "scheduledPayments",
                    plural: true,
                    selections: [
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "amortize",
                        storageKey: null,
                      },
                      v1 /*: any*/,
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "scheduledDate",
                        storageKey: null,
                      },
                    ],
                    storageKey: null,
                  },
                ],
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                kind: "ScalarField",
                name: "cursor",
                storageKey: null,
              },
            ],
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "type",
            storageKey: null,
          },
        ],
        storageKey: null,
      } as any,
    ];
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Fragment",
      metadata: null,
      name: "RoutesLoansSubscription",
      selections: v2 /*: any*/,
      type: "Subscription",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "RoutesLoansSubscription",
      selections: v2 /*: any*/,
    },
    params: {
      cacheID: "70d36bbd50dbca8ca2c139570f90f179",
      id: null,
      metadata: {},
      name: "RoutesLoansSubscription",
      operationKind: "subscription",
      text: "subscription RoutesLoansSubscription(\n  $status: [LoanStatus!]!\n) {\n  loans_subscribe(status: $status) {\n    loan_edge {\n      node {\n        loan_gid\n        _id_user\n        score\n        ROI\n        goal\n        term\n        raised\n        expiry\n        status\n        scheduledPayments {\n          amortize\n          status\n          scheduledDate\n        }\n      }\n      cursor\n    }\n    type\n  }\n}\n",
    },
  } as any;
})();
(node as any).hash = "1c1842b59d3ac67103628d6b217ad855";
export default node;
