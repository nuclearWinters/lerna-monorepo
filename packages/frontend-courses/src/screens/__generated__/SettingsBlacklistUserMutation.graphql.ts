/**
 * @generated SignedSource<<c82e2a8e7e1eaeff6845b0f2ea94350e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type BlacklistUserInput = {
  clientMutationId?: string | null;
};
export type SettingsBlacklistUserMutation$variables = {
  input: BlacklistUserInput;
};
export type SettingsBlacklistUserMutation$data = {
  readonly blacklistUser: {
    readonly error: string;
  };
};
export type SettingsBlacklistUserMutation = {
  response: SettingsBlacklistUserMutation$data;
  variables: SettingsBlacklistUserMutation$variables;
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
    "cacheID": "785a3efd0adf9b273bdd82c1391c7b75",
    "id": null,
    "metadata": {},
    "name": "SettingsBlacklistUserMutation",
    "operationKind": "mutation",
    "text": "mutation SettingsBlacklistUserMutation(\n  $input: BlacklistUserInput!\n) {\n  blacklistUser(input: $input) {\n    error\n  }\n}\n"
  }
};
})();

(node as any).hash = "847542b869f6ad082842b24087285a12";

export default node;
