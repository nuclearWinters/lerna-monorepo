/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type AddLendsInput = {
  clientMutationId?: string | null;
  refreshToken: string;
  id: string;
  lends: Array<LendList>;
};
export type LendList = {
  id: string;
  lend: number;
  _id_borrower: string;
};
export type AddLendsMutationVariables = {
  input: AddLendsInput;
};
export type AddLendsMutationResponse = {
  readonly addLends: {
    readonly error: string;
    readonly validAccessToken: string;
    readonly user: {
      readonly accountAvailable: number;
    };
    readonly loans: ReadonlyArray<{
      readonly id: string;
      readonly total: number;
    }> | null;
  };
};
export type AddLendsMutation = {
  readonly response: AddLendsMutationResponse;
  readonly variables: AddLendsMutationVariables;
};

/*
mutation AddLendsMutation(
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
      total
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
          name: "total",
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
      name: "AddLendsMutation",
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
      name: "AddLendsMutation",
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
      cacheID: "b56033db2f16470b99ae2516e1aab8dd",
      id: null,
      metadata: {},
      name: "AddLendsMutation",
      operationKind: "mutation",
      text:
        "mutation AddLendsMutation(\n  $input: AddLendsInput!\n) {\n  addLends(input: $input) {\n    error\n    validAccessToken\n    user {\n      accountAvailable\n      id\n    }\n    loans {\n      id\n      total\n    }\n  }\n}\n",
    },
  } as any;
})();
(node as any).hash = "aefb799829ea416b84b1973ec1bef30d";
export default node;
