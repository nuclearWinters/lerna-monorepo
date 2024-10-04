/**
 * @generated SignedSource<<51aece7e3c095ebba6a605846c9faffa>>
 * @relayHash 0780cb2c2df8b07a96bc5e98037d56fa
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 0780cb2c2df8b07a96bc5e98037d56fa

import { ConcreteRequest } from 'relay-runtime';
export type Languages = "EN" | "ES" | "%future added value";
export type SignUpInput = {
  clientMutationId?: string | null | undefined;
  email: string;
  isLender: boolean;
  language: Languages;
  password: string;
};
export type SignUpMutation$variables = {
  input: SignUpInput;
};
export type SignUpMutation$data = {
  readonly signUp: {
    readonly error: string;
  };
};
export type SignUpMutation = {
  response: SignUpMutation$data;
  variables: SignUpMutation$variables;
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
    "id": "0780cb2c2df8b07a96bc5e98037d56fa",
    "metadata": {},
    "name": "SignUpMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "30bd129965416672bff3baea64f7707e";

export default node;
