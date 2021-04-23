/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type RenewAccessTokenInput = {
  password: string;
  email: string;
  clientMutationId?: string | null;
};
export type RenewAccessTokenMutationVariables = {
  input: RenewAccessTokenInput;
};
export type RenewAccessTokenMutationResponse = {
  readonly renewAccessToken: {
    readonly refreshToken: string;
  };
};
export type RenewAccessTokenMutation = {
  readonly response: RenewAccessTokenMutationResponse;
  readonly variables: RenewAccessTokenMutationVariables;
};

/*
mutation RenewAccessTokenMutation(
  $input: RenewAccessTokenInput!
) {
  renewAccessToken(input: $input) {
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
        concreteType: "RenewAccessTokenPayload",
        kind: "LinkedField",
        name: "renewAccessToken",
        plural: false,
        selections: [
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
      name: "RenewAccessTokenMutation",
      selections: v1 /*: any*/,
      type: "Mutation",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "RenewAccessTokenMutation",
      selections: v1 /*: any*/,
    },
    params: {
      cacheID: "36b9c749c25c403baee96d517da55b1a",
      id: null,
      metadata: {},
      name: "RenewAccessTokenMutation",
      operationKind: "mutation",
      text:
        "mutation RenewAccessTokenMutation(\n  $input: RenewAccessTokenInput!\n) {\n  renewAccessToken(input: $input) {\n    refreshToken\n  }\n}\n",
    },
  } as any;
})();
(node as any).hash = "ef5842eed90d21391490cbf3b9121628";
export default node;
