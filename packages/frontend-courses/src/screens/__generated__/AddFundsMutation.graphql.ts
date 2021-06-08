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
      name: "AddFundsMutation",
      selections: v1 /*: any*/,
      type: "Mutation",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "AddFundsMutation",
      selections: v1 /*: any*/,
    },
    params: {
      cacheID: "b0984601444b2376feeca4094815e3de",
      id: null,
      metadata: {},
      name: "AddFundsMutation",
      operationKind: "mutation",
      text: "mutation AddFundsMutation(\n  $input: AddFundsInput!\n) {\n  addFunds(input: $input) {\n    error\n    validAccessToken\n  }\n}\n",
    },
  } as any;
})();
(node as any).hash = "1b729b33c09a5c004e5a443b5ff0fb03";
export default node;
