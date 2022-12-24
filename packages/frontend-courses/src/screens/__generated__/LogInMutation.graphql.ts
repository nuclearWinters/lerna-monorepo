/**
 * @generated SignedSource<<85904d67ec94b9fe2756ad04a7e84ed0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type SignInInput = {
  clientMutationId?: string | null;
  email: string;
  password: string;
};
export type LogInMutation$variables = {
  input: SignInInput;
};
export type LogInMutation$data = {
  readonly signIn: {
    readonly error: string | null;
  };
};
export type LogInMutation = {
  response: LogInMutation$data;
  variables: LogInMutation$variables;
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
    "concreteType": "SignInPayload",
    "kind": "LinkedField",
    "name": "signIn",
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
    "name": "LogInMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "LogInMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "95e2b3e28198459a859cd2b7075ac533",
    "id": null,
    "metadata": {},
    "name": "LogInMutation",
    "operationKind": "mutation",
    "text": "mutation LogInMutation(\n  $input: SignInInput!\n) {\n  signIn(input: $input) {\n    error\n  }\n}\n"
  }
};
})();

(node as any).hash = "5cd990a9e1e357aacf06c9eade04e1d0";

export default node;
