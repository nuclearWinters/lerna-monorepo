/**
 * @generated SignedSource<<1a309a692e5a3547a69b26727d841a95>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type SignInInput = {
  password: string;
  email: string;
  clientMutationId?: string | null;
};
export type LogInMutation$variables = {
  input: SignInInput;
};
export type LogInMutationVariables = LogInMutation$variables;
export type LogInMutation$data = {
  readonly signIn: {
    readonly error: string | null;
    readonly accessToken: string;
    readonly refreshToken: string;
  };
};
export type LogInMutationResponse = LogInMutation$data;
export type LogInMutation = {
  variables: LogInMutationVariables;
  response: LogInMutation$data;
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
    "cacheID": "efb8de858dc33aba92f7525617672896",
    "id": null,
    "metadata": {},
    "name": "LogInMutation",
    "operationKind": "mutation",
    "text": "mutation LogInMutation(\n  $input: SignInInput!\n) {\n  signIn(input: $input) {\n    error\n    accessToken\n    refreshToken\n  }\n}\n"
  }
};
})();

(node as any).hash = "96f070a0b897e3ae741e4264338f2bd1";

export default node;
