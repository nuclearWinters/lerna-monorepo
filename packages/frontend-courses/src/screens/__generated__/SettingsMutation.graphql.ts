/**
 * @generated SignedSource<<a79394575059bfdb8c465abd224acf84>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type Languages = "EN" | "ES" | "DEFAULT" | "%future added value";
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
export type SettingsMutation$variables = {
  input: UpdateUserInput;
};
export type SettingsMutationVariables = SettingsMutation$variables;
export type SettingsMutation$data = {
  readonly updateUser: {
    readonly error: string;
    readonly validAccessToken: string;
  };
};
export type SettingsMutationResponse = SettingsMutation$data;
export type SettingsMutation = {
  variables: SettingsMutationVariables;
  response: SettingsMutation$data;
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
    "concreteType": "UpdateUserPayload",
    "kind": "LinkedField",
    "name": "updateUser",
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
        "name": "validAccessToken",
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
    "name": "SettingsMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SettingsMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "2f59602b39989d38c8915828d03ed896",
    "id": null,
    "metadata": {},
    "name": "SettingsMutation",
    "operationKind": "mutation",
    "text": "mutation SettingsMutation(\n  $input: UpdateUserInput!\n) {\n  updateUser(input: $input) {\n    error\n    validAccessToken\n  }\n}\n"
  }
};
})();

(node as any).hash = "e8a6824be5ad701e4f26e139156c3567";

export default node;
