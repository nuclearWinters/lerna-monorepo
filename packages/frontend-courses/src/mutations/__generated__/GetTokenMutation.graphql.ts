/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type GetTokenInput = {
  password: string;
  email: string;
  clientMutationId?: string | null;
};
export type GetTokenMutationVariables = {
  input: GetTokenInput;
};
export type GetTokenMutationResponse = {
  readonly getToken: {
    readonly error: string | null;
    readonly refreshToken: string;
    readonly accessToken: string;
  };
};
export type GetTokenMutation = {
  readonly response: GetTokenMutationResponse;
  readonly variables: GetTokenMutationVariables;
};

/*
mutation GetTokenMutation(
  $input: GetTokenInput!
) {
  getToken(input: $input) {
    error
    refreshToken
    accessToken
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
        concreteType: "GetTokenPayload",
        kind: "LinkedField",
        name: "getToken",
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
            name: "refreshToken",
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "accessToken",
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
      name: "GetTokenMutation",
      selections: v1 /*: any*/,
      type: "Mutation",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "GetTokenMutation",
      selections: v1 /*: any*/,
    },
    params: {
      cacheID: "1574e3b9031ed5107b6da10a31ceb633",
      id: null,
      metadata: {},
      name: "GetTokenMutation",
      operationKind: "mutation",
      text:
        "mutation GetTokenMutation(\n  $input: GetTokenInput!\n) {\n  getToken(input: $input) {\n    error\n    refreshToken\n    accessToken\n  }\n}\n",
    },
  } as any;
})();
(node as any).hash = "7ad250c514017694d282a9607d6c6f53";
export default node;
