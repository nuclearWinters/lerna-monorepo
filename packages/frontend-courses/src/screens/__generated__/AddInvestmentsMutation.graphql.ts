/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type AddLendsInput = {
  clientMutationId?: string | null;
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
              selections: [
                v4 /*: any*/,
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
      cacheID: "21122b56fef0c2d9a534bb98b184a6af",
      id: null,
      metadata: {},
      name: "AddInvestmentsMutation",
      operationKind: "mutation",
      text: "mutation AddInvestmentsMutation(\n  $input: AddLendsInput!\n) {\n  addLends(input: $input) {\n    error\n    validAccessToken\n    user {\n      accountAvailable\n      id\n    }\n  }\n}\n",
    },
  } as any;
})();
(node as any).hash = "b5a778ed070715398b47ce62f6be0430";
export default node;
