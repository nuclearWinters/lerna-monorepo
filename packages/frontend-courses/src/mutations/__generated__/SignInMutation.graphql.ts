/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type SignInInput = {
  password: string;
  email: string;
  clientMutationId?: string | null;
};
export type SignInMutationVariables = {
  input: SignInInput;
};
export type SignInMutationResponse = {
  readonly signIn: {
    readonly error: string | null;
    readonly accessToken: string;
    readonly refreshToken: string;
  };
};
export type SignInMutation = {
  readonly response: SignInMutationResponse;
  readonly variables: SignInMutationVariables;
};

/*
mutation SignInMutation(
  $input: SignInInput!
) {
  signIn(input: $input) {
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
        concreteType: "SignInPayload",
        kind: "LinkedField",
        name: "signIn",
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
      name: "SignInMutation",
      selections: v1 /*: any*/,
      type: "Mutation",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "SignInMutation",
      selections: v1 /*: any*/,
    },
    params: {
      cacheID: "3520018fefa6e356512e43f8d7a4f9d6",
      id: null,
      metadata: {},
      name: "SignInMutation",
      operationKind: "mutation",
      text:
        "mutation SignInMutation(\n  $input: SignInInput!\n) {\n  signIn(input: $input) {\n    error\n    accessToken\n    refreshToken\n  }\n}\n",
    },
  } as any;
})();
(node as any).hash = "81a42a86f5d0d4de302cf343ab7dd619";
export default node;
