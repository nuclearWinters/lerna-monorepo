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
      cacheID: "c038cae93e0906e9f30c33caca7fee1c",
      id: null,
      metadata: {},
      name: "SignUpMutation",
      operationKind: "mutation",
      text:
        "mutation SignUpMutation(\n  $input: SignUpInput!\n) {\n  signUp(input: $input) {\n    error\n    accessToken\n  }\n}\n",
    },
  } as any;
})();
(node as any).hash = "0dea7eab86f740ea1a4ae131f0b770fc";
export default node;
