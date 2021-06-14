/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type Languages = "DEFAULT" | "EN" | "ES" | "%future added value";
export type UpdateUserInput = {
  clientMutationId?: string | null;
  user_gid: string;
  name: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  RFC: string;
  CURP: string;
  clabe: string;
  mobile: string;
  email: string;
  language: Languages;
};
export type SettingsMutationVariables = {
  input: UpdateUserInput;
};
export type SettingsMutationResponse = {
  readonly updateUser: {
    readonly error: string;
    readonly validAccessToken: string;
  };
};
export type SettingsMutation = {
  readonly response: SettingsMutationResponse;
  readonly variables: SettingsMutationVariables;
};

/*
mutation SettingsMutation(
  $input: UpdateUserInput!
) {
  updateUser(input: $input) {
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
        concreteType: "UpdateUserPayload",
        kind: "LinkedField",
        name: "updateUser",
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
      name: "SettingsMutation",
      selections: v1 /*: any*/,
      type: "Mutation",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "SettingsMutation",
      selections: v1 /*: any*/,
    },
    params: {
      cacheID: "2f59602b39989d38c8915828d03ed896",
      id: null,
      metadata: {},
      name: "SettingsMutation",
      operationKind: "mutation",
      text: "mutation SettingsMutation(\n  $input: UpdateUserInput!\n) {\n  updateUser(input: $input) {\n    error\n    validAccessToken\n  }\n}\n",
    },
  } as any;
})();
(node as any).hash = "e8a6824be5ad701e4f26e139156c3567";
export default node;
