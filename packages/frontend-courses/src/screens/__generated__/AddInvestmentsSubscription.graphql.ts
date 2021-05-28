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
export type AddInvestmentsSubscriptionVariables = {};
export type AddInvestmentsSubscriptionResponse = {
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
export type AddInvestmentsSubscription = {
  readonly response: AddInvestmentsSubscriptionResponse;
  readonly variables: AddInvestmentsSubscriptionVariables;
};

/*
subscription AddInvestmentsSubscription {
  loans_subscribe {
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
      alias: null,
      args: null,
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
      argumentDefinitions: [],
      kind: "Fragment",
      metadata: null,
      name: "AddInvestmentsSubscription",
      selections: v0 /*: any*/,
      type: "Subscription",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: [],
      kind: "Operation",
      name: "AddInvestmentsSubscription",
      selections: v0 /*: any*/,
    },
    params: {
      cacheID: "da251f7bdef803c3b2e205e44399adc7",
      id: null,
      metadata: {},
      name: "AddInvestmentsSubscription",
      operationKind: "subscription",
      text: "subscription AddInvestmentsSubscription {\n  loans_subscribe {\n    loan_edge {\n      node {\n        id\n        _id_user\n        score\n        ROI\n        goal\n        term\n        raised\n        expiry\n        status\n      }\n      cursor\n    }\n    type\n  }\n}\n",
    },
  } as any;
})();
(node as any).hash = "2fdf2de5c53f2ebaead6dba2d14780aa";
export default node;
