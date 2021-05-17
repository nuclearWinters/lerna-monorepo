/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type SignUpInput = {
  password: string;
  email: string;
  clientMutationId?: string | null;
};
export type SignUpMutationVariables = {
  input: SignUpInput;
};
export type SignUpMutationResponse = {
  readonly signUp: {
    readonly error: string;
    readonly accessToken: string;
    readonly refreshToken: string;
  };
};
export type SignUpMutation = {
  readonly response: SignUpMutationResponse;
  readonly variables: SignUpMutationVariables;
};

/*
mutation SignUpMutation(
  $input: SignUpInput!
) {
  signUp(input: $input) {
    error
    accessToken
    refreshToken
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
        concreteType: "SignUpPayload",
        kind: "LinkedField",
        name: "signUp",
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
            name: "accessToken",
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "refreshToken",
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
      name: "SignUpMutation",
      selections: v1 /*: any*/,
      type: "Mutation",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "SignUpMutation",
      selections: v1 /*: any*/,
    },
    params: {
      cacheID: "51f13e55fa79632a99765a965dd5d3ed",
      id: null,
      metadata: {},
      name: "SignUpMutation",
      operationKind: "mutation",
      text:
        "mutation SignUpMutation(\n  $input: SignUpInput!\n) {\n  signUp(input: $input) {\n    error\n    accessToken\n    refreshToken\n  }\n}\n",
    },
  } as any;
})();
(node as any).hash = "b0475cad1ddee70b458fa957f2725d8b";
export default node;
