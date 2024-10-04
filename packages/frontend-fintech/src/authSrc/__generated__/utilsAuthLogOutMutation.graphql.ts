/**
 * @generated SignedSource<<27b8e0540c91dd364f835f95a8c84ca4>>
 * @relayHash adf8a141164c9d25336db3b811342820
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID adf8a141164c9d25336db3b811342820

import { ConcreteRequest } from 'relay-runtime';
export type LogOutInput = {
  clientMutationId?: string | null | undefined;
};
export type utilsAuthLogOutMutation$variables = {
  input: LogOutInput;
};
export type utilsAuthLogOutMutation$data = {
  readonly logOut: {
    readonly error: string;
  };
};
export type utilsAuthLogOutMutation = {
  response: utilsAuthLogOutMutation$data;
  variables: utilsAuthLogOutMutation$variables;
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
    "concreteType": "LogOutPayload",
    "kind": "LinkedField",
    "name": "logOut",
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
    "name": "utilsAuthLogOutMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "utilsAuthLogOutMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "adf8a141164c9d25336db3b811342820",
    "metadata": {},
    "name": "utilsAuthLogOutMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "e66166c9444cadec2481ba1dd882ef4d";

export default node;
