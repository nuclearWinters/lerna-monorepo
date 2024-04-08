/**
 * @generated SignedSource<<1a80fcaf241f9fba62801ba912a62a2c>>
 * @relayHash 62f48d6f993235723f255966785c11c1
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 62f48d6f993235723f255966785c11c1

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type LogOutInput = {
  clientMutationId?: string | null | undefined;
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
    "id": "62f48d6f993235723f255966785c11c1",
    "metadata": {},
    "name": "utilsLogOutMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "f4e542bcbca70def31e21b863ebd1180";

export default node;
