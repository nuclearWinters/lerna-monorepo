/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
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
        readonly id: string;
        readonly _id_user: string;
        readonly score: string;
        readonly ROI: number;
        readonly goal: string;
        readonly term: number;
        readonly raised: string;
        readonly expiry: number;
        readonly status: LoanStatus;
      } | null;
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
        id
        _id_user
        score
        ROI
        goal
        term
        raised
        expiry
        status
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
    v1 = [
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
            concreteType: "LoanEdge",
            kind: "LinkedField",
            name: "loan_edge",
            plural: false,
            selections: [
              {
                alias: null,
                args: null,
                concreteType: "Loan",
                kind: "LinkedField",
                name: "node",
                plural: false,
                selections: [
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "id",
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
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "status",
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
      selections: v1 /*: any*/,
      type: "Subscription",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "RoutesLoansSubscription",
      selections: v1 /*: any*/,
    },
    params: {
      cacheID: "0ee611909d74aaf4704042a13d27daf3",
      id: null,
      metadata: {},
      name: "RoutesLoansSubscription",
      operationKind: "subscription",
      text: "subscription RoutesLoansSubscription(\n  $status: [LoanStatus!]!\n) {\n  loans_subscribe(status: $status) {\n    loan_edge {\n      node {\n        id\n        _id_user\n        score\n        ROI\n        goal\n        term\n        raised\n        expiry\n        status\n      }\n      cursor\n    }\n    type\n  }\n}\n",
    },
  } as any;
})();
(node as any).hash = "974365ce3245a395ef851162647d1fe0";
export default node;
