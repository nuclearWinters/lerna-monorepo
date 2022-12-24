/**
 * @generated SignedSource<<dec6b994fe29a044a08ce432a8702d8b>>
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
export type RoutesLogOutMutation$variables = {
  input: LogOutInput;
};
export type RoutesLogOutMutation$data = {
  readonly logOut: {
    readonly error: string;
  };
};
export type RoutesLogOutMutation = {
  response: RoutesLogOutMutation$data;
  variables: RoutesLogOutMutation$variables;
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
    "name": "RoutesLogOutMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RoutesLogOutMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "035437bf63250ad4cedca711167b3635",
    "id": null,
    "metadata": {},
    "name": "RoutesLogOutMutation",
    "operationKind": "mutation",
    "text": "mutation RoutesLogOutMutation(\n  $input: LogOutInput!\n) {\n  logOut(input: $input) {\n    error\n  }\n}\n"
  }
};
})();

(node as any).hash = "b032e8ac46e7c1a57c29ba55b733155e";

export default node;
