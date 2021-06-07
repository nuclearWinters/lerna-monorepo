/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type AddFundsInput = {
  clientMutationId?: string | null;
  user_gid: string;
  quantity: string;
};
export type RetireFundsMutationVariables = {
  input: AddFundsInput;
};
export type RetireFundsMutationResponse = {
  readonly addFunds: {
    readonly error: string;
    readonly validAccessToken: string;
    readonly user: {
      readonly investments: ReadonlyArray<{
        readonly _id_loan: string;
        readonly quantity: number;
        readonly term: number;
        readonly ROI: number;
        readonly payments: number;
      }>;
      readonly accountAvailable: string;
    } | null;
  };
};
export type RetireFundsMutation = {
  readonly response: RetireFundsMutationResponse;
  readonly variables: RetireFundsMutationVariables;
};

/*
mutation RetireFundsMutation(
  $input: AddFundsInput!
) {
  addFunds(input: $input) {
    error
    validAccessToken
    user {
      investments {
        _id_loan
        quantity
        term
        ROI
        payments
      }
      accountAvailable
      id
    }
  }
}
*/

const node: ConcreteRequest = (function () {
  var v0 = [
      {
        defaultValue: null,
        kind: "LocalArgument",
        name: "input",
      } as any,
    ],
    v1 = [
      {
        kind: "Variable",
        name: "input",
        variableName: "input",
      } as any,
    ],
    v2 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "error",
      storageKey: null,
    } as any,
    v3 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "validAccessToken",
      storageKey: null,
    } as any,
    v4 = {
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
    } as any,
    v5 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "accountAvailable",
      storageKey: null,
    } as any;
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Fragment",
      metadata: null,
      name: "RetireFundsMutation",
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: "AddFundsPayload",
          kind: "LinkedField",
          name: "addFunds",
          plural: false,
          selections: [
            v2 /*: any*/,
            v3 /*: any*/,
            {
              alias: null,
              args: null,
              concreteType: "User",
              kind: "LinkedField",
              name: "user",
              plural: false,
              selections: [v4 /*: any*/, v5 /*: any*/],
              storageKey: null,
            },
          ],
          storageKey: null,
        },
      ],
      type: "Mutation",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "RetireFundsMutation",
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: "AddFundsPayload",
          kind: "LinkedField",
          name: "addFunds",
          plural: false,
          selections: [
            v2 /*: any*/,
            v3 /*: any*/,
            {
              alias: null,
              args: null,
              concreteType: "User",
              kind: "LinkedField",
              name: "user",
              plural: false,
              selections: [
                v4 /*: any*/,
                v5 /*: any*/,
                {
                  alias: null,
                  args: null,
                  kind: "ScalarField",
                  name: "id",
                  storageKey: null,
                },
              ],
              storageKey: null,
            },
          ],
          storageKey: null,
        },
      ],
    },
    params: {
      cacheID: "c660743499c0a3f84df3a23dcdadf515",
      id: null,
      metadata: {},
      name: "RetireFundsMutation",
      operationKind: "mutation",
      text: "mutation RetireFundsMutation(\n  $input: AddFundsInput!\n) {\n  addFunds(input: $input) {\n    error\n    validAccessToken\n    user {\n      investments {\n        _id_loan\n        quantity\n        term\n        ROI\n        payments\n      }\n      accountAvailable\n      id\n    }\n  }\n}\n",
    },
  } as any;
})();
(node as any).hash = "68e23075be5dfd42b865f13a4fb13a1f";
export default node;
