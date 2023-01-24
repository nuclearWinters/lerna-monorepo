/**
 * @generated SignedSource<<faff85ac3ec793ae28000855ee8612a1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type LogOutInput = {
  clientMutationId?: string | null;
};
export type utilsLogOutMutation$variables = {
  input: LogOutInput;
};
export type utilsLogOutMutation$data = {
  readonly logOut: {
    readonly error: string;
  };
};
export type utilsLogOutMutation = {
  response: utilsLogOutMutation$data;
  variables: utilsLogOutMutation$variables;
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
    "name": "utilsLogOutMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "utilsLogOutMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "62f48d6f993235723f255966785c11c1",
    "id": null,
    "metadata": {},
    "name": "utilsLogOutMutation",
    "operationKind": "mutation",
    "text": "mutation utilsLogOutMutation(\n  $input: LogOutInput!\n) {\n  logOut(input: $input) {\n    error\n  }\n}\n"
  }
};
})();

(node as any).hash = "f4e542bcbca70def31e21b863ebd1180";

export default node;
