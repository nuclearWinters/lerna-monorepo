/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type AddLendsInput = {
  clientMutationId?: string | null;
  refreshToken: string;
  lender_gid: string;
  lends: Array<LendList>;
};
export type LendList = {
  loan_gid: string;
  quantity: string;
  borrower_id: string;
};
export type AddInvestmentsMutationVariables = {
  input: AddLendsInput;
};
export type AddInvestmentsMutationResponse = {
  readonly addLends: {
    readonly error: string;
    readonly validAccessToken: string;
    readonly user: {
      readonly accountAvailable: string;
    };
    readonly loans: ReadonlyArray<{
      readonly id: string;
      readonly raised: string;
    }> | null;
  };
};
export type AddInvestmentsMutation = {
  readonly response: AddInvestmentsMutationResponse;
  readonly variables: AddInvestmentsMutationVariables;
};

/*
mutation AddInvestmentsMutation(
  $input: AddLendsInput!
) {
  addLends(input: $input) {
    error
    validAccessToken
    user {
      accountAvailable
      id
    }
    loans {
      id
      raised
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
      kind: "ScalarField",
      name: "accountAvailable",
      storageKey: null,
    } as any,
    v5 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "id",
      storageKey: null,
    } as any,
    v6 = {
      alias: null,
      args: null,
      concreteType: "Loan",
      kind: "LinkedField",
      name: "loans",
      plural: true,
      selections: [
        v5 /*: any*/,
        {
          alias: null,
          args: null,
          kind: "ScalarField",
          name: "raised",
          storageKey: null,
        },
      ],
      storageKey: null,
    } as any;
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Fragment",
      metadata: null,
      name: "AddInvestmentsMutation",
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: "AddLendsPayload",
          kind: "LinkedField",
          name: "addLends",
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
              selections: [v4 /*: any*/],
              storageKey: null,
            },
            v6 /*: any*/,
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
      name: "AddInvestmentsMutation",
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: "AddLendsPayload",
          kind: "LinkedField",
          name: "addLends",
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
            v6 /*: any*/,
          ],
          storageKey: null,
        },
      ],
    },
    params: {
      cacheID: "18ea106eb36e8d08d2d4858a3804cb1b",
      id: null,
      metadata: {},
      name: "AddInvestmentsMutation",
      operationKind: "mutation",
      text: "mutation AddInvestmentsMutation(\n  $input: AddLendsInput!\n) {\n  addLends(input: $input) {\n    error\n    validAccessToken\n    user {\n      accountAvailable\n      id\n    }\n    loans {\n      id\n      raised\n    }\n  }\n}\n",
    },
  } as any;
})();
(node as any).hash = "3492c25dfccd49af9174725d4ba4d474";
export default node;
