/**
 * @generated SignedSource<<dc52cd51eb768671ffa98109ed673489>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type BlacklistUserInput = {
  user_gid: string;
  clientMutationId?: string | null;
};
export type SettingsBlacklistUserMutation$variables = {
  input: BlacklistUserInput;
};
export type SettingsBlacklistUserMutationVariables = SettingsBlacklistUserMutation$variables;
export type SettingsBlacklistUserMutation$data = {
  readonly blacklistUser: {
    readonly error: string;
    readonly validAccessToken: string;
  };
};
export type SettingsBlacklistUserMutationResponse = SettingsBlacklistUserMutation$data;
export type SettingsBlacklistUserMutation = {
  variables: SettingsBlacklistUserMutationVariables;
  response: SettingsBlacklistUserMutation$data;
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
    "concreteType": "BlacklistUserPayload",
    "kind": "LinkedField",
    "name": "blacklistUser",
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
    "name": "SettingsBlacklistUserMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SettingsBlacklistUserMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "5e4fb7bc07a201aaa07384d376d910bb",
    "id": null,
    "metadata": {},
    "name": "SettingsBlacklistUserMutation",
    "operationKind": "mutation",
    "text": "mutation SettingsBlacklistUserMutation(\n  $input: BlacklistUserInput!\n) {\n  blacklistUser(input: $input) {\n    error\n    validAccessToken\n  }\n}\n"
  }
};
})();

(node as any).hash = "1fcdfed34f4ef9d1502b391155b4ff05";

export default node;
