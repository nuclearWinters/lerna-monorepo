/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type SignInInput = {
  password: string;
  email: string;
  clientMutationId?: string | null;
};
export type CheckExpirationMutationVariables = {
  input: SignInInput;
};
export type CheckExpirationMutationResponse = {
  readonly signIn: {
    readonly error: string | null;
    readonly accessToken: string;
    readonly refreshToken: string;
  };
};
export type CheckExpirationMutation = {
  readonly response: CheckExpirationMutationResponse;
  readonly variables: CheckExpirationMutationVariables;
};

/*
mutation CheckExpirationMutation(
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
      name: "CheckExpirationMutation",
      selections: v1 /*: any*/,
      type: "Mutation",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "CheckExpirationMutation",
      selections: v1 /*: any*/,
    },
    params: {
      cacheID: "799d3bd5b8c0c9b255a2cb14eccdb9e1",
      id: null,
      metadata: {},
      name: "CheckExpirationMutation",
      operationKind: "mutation",
      text: "mutation CheckExpirationMutation(\n  $input: SignInInput!\n) {\n  signIn(input: $input) {\n    error\n    accessToken\n    refreshToken\n  }\n}\n",
    },
  } as any;
})();
(node as any).hash = "5c6f2c97977d6287f4a925aa67e06a68";
export default node;
