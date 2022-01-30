/**
 * @generated SignedSource<<ec5e5a4299ed80ec35b4bb8249352d71>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type Languages = "EN" | "ES" | "DEFAULT" | "%future added value";
export type SignUpInput = {
  password: string;
  email: string;
  clientMutationId?: string | null;
  isLender: boolean;
  language: Languages;
};
export type SignUpMutation$variables = {
  input: SignUpInput;
};
export type SignUpMutationVariables = SignUpMutation$variables;
export type SignUpMutation$data = {
  readonly signUp: {
    readonly error: string;
    readonly accessToken: string;
    readonly refreshToken: string;
  };
};
export type SignUpMutationResponse = SignUpMutation$data;
export type SignUpMutation = {
  variables: SignUpMutationVariables;
  response: SignUpMutation$data;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "SignUpPayload",
    "kind": "LinkedField",
    "name": "signUp",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "error",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "accessToken",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "refreshToken",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SignUpMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SignUpMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "51f13e55fa79632a99765a965dd5d3ed",
    "id": null,
    "metadata": {},
    "name": "SignUpMutation",
    "operationKind": "mutation",
    "text": "mutation SignUpMutation(\n  $input: SignUpInput!\n) {\n  signUp(input: $input) {\n    error\n    accessToken\n    refreshToken\n  }\n}\n"
  }
};
})();

(node as any).hash = "b0475cad1ddee70b458fa957f2725d8b";

export default node;
