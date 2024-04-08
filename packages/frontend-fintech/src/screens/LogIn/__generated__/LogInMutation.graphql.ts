/**
 * @generated SignedSource<<81bcb4c44c3cd4286df4963c09194e78>>
 * @relayHash 95e2b3e28198459a859cd2b7075ac533
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 95e2b3e28198459a859cd2b7075ac533

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type SignInInput = {
  clientMutationId?: string | null | undefined;
  email: string;
  password: string;
};
export type LogInMutation$variables = {
  input: SignInInput;
};
export type LogInMutation$data = {
  readonly signIn: {
    readonly error: string;
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
    "id": "95e2b3e28198459a859cd2b7075ac533",
    "metadata": {},
    "name": "LogInMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "5cd990a9e1e357aacf06c9eade04e1d0";

export default node;
