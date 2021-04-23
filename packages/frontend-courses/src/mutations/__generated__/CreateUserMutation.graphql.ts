/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type CreateUserInput = {
  password: string;
  email: string;
  clientMutationId?: string | null;
};
export type CreateUserMutationVariables = {
  input: CreateUserInput;
};
export type CreateUserMutationResponse = {
  readonly createUser: {
    readonly error: string;
    readonly refreshToken: string;
    readonly accessToken: string;
  };
};
export type CreateUserMutation = {
  readonly response: CreateUserMutationResponse;
  readonly variables: CreateUserMutationVariables;
};

/*
mutation CreateUserMutation(
  $input: CreateUserInput!
) {
  createUser(input: $input) {
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
        concreteType: "CreateUserPayload",
        kind: "LinkedField",
        name: "createUser",
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
      name: "CreateUserMutation",
      selections: v1 /*: any*/,
      type: "Mutation",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "CreateUserMutation",
      selections: v1 /*: any*/,
    },
    params: {
      cacheID: "793de8408271a234f405d4d1b953a49a",
      id: null,
      metadata: {},
      name: "CreateUserMutation",
      operationKind: "mutation",
      text:
        "mutation CreateUserMutation(\n  $input: CreateUserInput!\n) {\n  createUser(input: $input) {\n    error\n    refreshToken\n    accessToken\n  }\n}\n",
    },
  } as any;
})();
(node as any).hash = "19a3d47364bc03729e42102582a60b4e";
export default node;
