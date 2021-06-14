/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type RoutesUserSubscriptionVariables = {
  user_gid: string;
};
export type RoutesUserSubscriptionResponse = {
  readonly user_subscribe: {
    readonly user: {
      readonly id: string;
      readonly accountAvailable: string;
      readonly investments: ReadonlyArray<{
        readonly _id_loan: string;
        readonly quantity: number;
        readonly term: number;
        readonly ROI: number;
        readonly payments: number;
      }>;
    };
  };
};
export type RoutesUserSubscription = {
  readonly response: RoutesUserSubscriptionResponse;
  readonly variables: RoutesUserSubscriptionVariables;
};

/*
subscription RoutesUserSubscription(
  $user_gid: ID!
) {
  user_subscribe(user_gid: $user_gid) {
    user {
      id
      accountAvailable
      investments {
        _id_loan
        quantity
        term
        ROI
        payments
      }
    }
  }
}
*/

const node: ConcreteRequest = (function () {
  var v0 = [
      {
        defaultValue: null,
        kind: "LocalArgument",
        name: "user_gid",
      } as any,
    ],
    v1 = [
      {
        alias: null,
        args: [
          {
            kind: "Variable",
            name: "user_gid",
            variableName: "user_gid",
          },
        ],
        concreteType: "User_Subscribe",
        kind: "LinkedField",
        name: "user_subscribe",
        plural: false,
        selections: [
          {
            alias: null,
            args: null,
            concreteType: "User",
            kind: "LinkedField",
            name: "user",
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
                name: "accountAvailable",
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "InvestmentsUser",
                kind: "LinkedField",
                name: "investments",
                plural: true,
                selections: [
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "_id_loan",
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "quantity",
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
                    name: "ROI",
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "payments",
                    storageKey: null,
                  },
                ],
                storageKey: null,
              },
            ],
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
      name: "RoutesUserSubscription",
      selections: v1 /*: any*/,
      type: "Subscription",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "RoutesUserSubscription",
      selections: v1 /*: any*/,
    },
    params: {
      cacheID: "62928fd56560f651cf35596136772c1c",
      id: null,
      metadata: {},
      name: "RoutesUserSubscription",
      operationKind: "subscription",
      text: "subscription RoutesUserSubscription(\n  $user_gid: ID!\n) {\n  user_subscribe(user_gid: $user_gid) {\n    user {\n      id\n      accountAvailable\n      investments {\n        _id_loan\n        quantity\n        term\n        ROI\n        payments\n      }\n    }\n  }\n}\n",
    },
  } as any;
})();
(node as any).hash = "ea855217b1778d9a81d8eab8caca6cac";
export default node;
