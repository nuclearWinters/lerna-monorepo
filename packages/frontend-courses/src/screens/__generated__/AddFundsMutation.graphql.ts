/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type AddFundsInput = {
  clientMutationId?: string | null;
  user_gid: string;
  quantity: string;
};
export type AddFundsMutationVariables = {
  input: AddFundsInput;
};
export type AddFundsMutationResponse = {
  readonly addFunds: {
    readonly error: string;
    readonly validAccessToken: string;
    readonly user: {
      readonly accountTotal: string;
      readonly accountAvailable: string;
    } | null;
  };
};
export type AddFundsMutation = {
  readonly response: AddFundsMutationResponse;
  readonly variables: AddFundsMutationVariables;
};

/*
mutation AddFundsMutation(
  $input: AddFundsInput!
) {
  addFunds(input: $input) {
    error
    validAccessToken
    user {
      accountTotal
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
      name: "accountTotal",
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
      name: "AddFundsMutation",
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
      name: "AddFundsMutation",
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
      cacheID: "547138b20422b9c485f92dfbd332fa2f",
      id: null,
      metadata: {},
      name: "AddFundsMutation",
      operationKind: "mutation",
      text: "mutation AddFundsMutation(\n  $input: AddFundsInput!\n) {\n  addFunds(input: $input) {\n    error\n    validAccessToken\n    user {\n      accountTotal\n      accountAvailable\n      id\n    }\n  }\n}\n",
    },
  } as any;
})();
(node as any).hash = "afb70bd423d0f36380f7cdc4fc52f505";
export default node;
