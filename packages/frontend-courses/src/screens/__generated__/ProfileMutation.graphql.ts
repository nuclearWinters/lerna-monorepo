/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
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
};
export type ProfileMutationVariables = {
  input: UpdateUserInput;
};
export type ProfileMutationResponse = {
  readonly updateUser: {
    readonly error: string;
    readonly validAccessToken: string;
  };
};
export type ProfileMutation = {
  readonly response: ProfileMutationResponse;
  readonly variables: ProfileMutationVariables;
};

/*
mutation ProfileMutation(
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
      name: "ProfileMutation",
      selections: v1 /*: any*/,
      type: "Mutation",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "ProfileMutation",
      selections: v1 /*: any*/,
    },
    params: {
      cacheID: "8b554baaf690a1bc29d96db7737a3817",
      id: null,
      metadata: {},
      name: "ProfileMutation",
      operationKind: "mutation",
      text: "mutation ProfileMutation(\n  $input: UpdateUserInput!\n) {\n  updateUser(input: $input) {\n    error\n    validAccessToken\n  }\n}\n",
    },
  } as any;
})();
(node as any).hash = "19132681145b201a23190a791746ac7c";
export default node;
