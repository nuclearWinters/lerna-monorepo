/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type InvestmentStatus =
  | "DELAY_PAYMENT"
  | "PAID"
  | "PAST_DUE"
  | "UP_TO_DATE"
  | "%future added value";
export type SubscribeType = "INSERT" | "UPDATE" | "%future added value";
export type RoutesInvestmentsSubscriptionVariables = {
  user_gid: string;
  status: Array<InvestmentStatus>;
};
export type RoutesInvestmentsSubscriptionResponse = {
  readonly investments_subscribe: {
    readonly investment_edge: {
      readonly node: {
        readonly id: string;
        readonly _id_borrower: string;
        readonly _id_lender: string;
        readonly _id_loan: string;
        readonly quantity: number;
        readonly created: number;
        readonly updated: number;
        readonly status: InvestmentStatus;
      } | null;
      readonly cursor: string;
    };
    readonly type: SubscribeType;
  };
};
export type RoutesInvestmentsSubscription = {
  readonly response: RoutesInvestmentsSubscriptionResponse;
  readonly variables: RoutesInvestmentsSubscriptionVariables;
};

/*
subscription RoutesInvestmentsSubscription(
  $user_gid: ID!
  $status: [InvestmentStatus!]!
) {
  investments_subscribe(user_gid: $user_gid, status: $status) {
    investment_edge {
      node {
        id
        _id_borrower
        _id_lender
        _id_loan
        quantity
        created
        updated
        status
      }
      cursor
    }
    type
  }
}
*/

const node: ConcreteRequest = (function () {
  var v0 = {
      defaultValue: null,
      kind: "LocalArgument",
      name: "status",
    } as any,
    v1 = {
      defaultValue: null,
      kind: "LocalArgument",
      name: "user_gid",
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
          {
            kind: "Variable",
            name: "user_gid",
            variableName: "user_gid",
          },
        ],
        concreteType: "Investment_Subscribe",
        kind: "LinkedField",
        name: "investments_subscribe",
        plural: false,
        selections: [
          {
            alias: null,
            args: null,
            concreteType: "InvestmentsEdge",
            kind: "LinkedField",
            name: "investment_edge",
            plural: false,
            selections: [
              {
                alias: null,
                args: null,
                concreteType: "Investment",
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
                    name: "_id_borrower",
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "_id_lender",
                    storageKey: null,
                  },
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
                    name: "created",
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "updated",
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
      argumentDefinitions: [v0 /*: any*/, v1 /*: any*/],
      kind: "Fragment",
      metadata: null,
      name: "RoutesInvestmentsSubscription",
      selections: v2 /*: any*/,
      type: "Subscription",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: [v1 /*: any*/, v0 /*: any*/],
      kind: "Operation",
      name: "RoutesInvestmentsSubscription",
      selections: v2 /*: any*/,
    },
    params: {
      cacheID: "3da334ed88ac2b6bcff04d79f0870cf6",
      id: null,
      metadata: {},
      name: "RoutesInvestmentsSubscription",
      operationKind: "subscription",
      text: "subscription RoutesInvestmentsSubscription(\n  $user_gid: ID!\n  $status: [InvestmentStatus!]!\n) {\n  investments_subscribe(user_gid: $user_gid, status: $status) {\n    investment_edge {\n      node {\n        id\n        _id_borrower\n        _id_lender\n        _id_loan\n        quantity\n        created\n        updated\n        status\n      }\n      cursor\n    }\n    type\n  }\n}\n",
    },
  } as any;
})();
(node as any).hash = "96c548362008b65e1fa584fb168d213c";
export default node;
