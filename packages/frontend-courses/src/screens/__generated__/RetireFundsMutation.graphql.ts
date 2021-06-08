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
        alias: null,
        args: [
          {
            kind: "Variable",
            name: "input",
            variableName: "input",
          },
        ],
        concreteType: "AddFundsPayload",
        kind: "LinkedField",
        name: "addFunds",
        plural: false,
        selections: [
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "error",
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "validAccessToken",
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
      name: "RetireFundsMutation",
      selections: v1 /*: any*/,
      type: "Mutation",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "RetireFundsMutation",
      selections: v1 /*: any*/,
    },
    params: {
      cacheID: "c9cf9ad9437d6066c128b952ee3e8617",
      id: null,
      metadata: {},
      name: "RetireFundsMutation",
      operationKind: "mutation",
      text: "mutation RetireFundsMutation(\n  $input: AddFundsInput!\n) {\n  addFunds(input: $input) {\n    error\n    validAccessToken\n  }\n}\n",
    },
  } as any;
})();
(node as any).hash = "94db9d4b4b3d89a14ae3dc2cc190b7fe";
export default node;
