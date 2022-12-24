/**
 * @generated SignedSource<<0f3151f635c98ac25f5a90f16db99931>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type Languages = "DEFAULT" | "EN" | "ES" | "%future added value";
export type UpdateUserInput = {
  CURP: string;
  RFC: string;
  apellidoMaterno: string;
  apellidoPaterno: string;
  clabe: string;
  clientMutationId?: string | null;
  email: string;
  language: Languages;
  mobile: string;
  name: string;
  user_gid: string;
};
export type SettingsMutation$variables = {
  input: UpdateUserInput;
};
export type SettingsMutation$data = {
  readonly updateUser: {
    readonly error: string;
  };
};
export type SettingsMutation = {
  response: SettingsMutation$data;
  variables: SettingsMutation$variables;
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
    "cacheID": "c86a74eef0f0dcb0e098328bbfe7f9d5",
    "id": null,
    "metadata": {},
    "name": "SettingsMutation",
    "operationKind": "mutation",
    "text": "mutation SettingsMutation(\n  $input: UpdateUserInput!\n) {\n  updateUser(input: $input) {\n    error\n  }\n}\n"
  }
};
})();

(node as any).hash = "584c5301466a7a63d7f26505ab173137";

export default node;
