/**
 * @generated SignedSource<<5ec00f296ea9dbc3d422a718d08a6d4c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type RevokeSessionInput = {
  clientMutationId?: string | null;
  sessionId: string;
};
export type SessionRowRevokeSessionMutation$variables = {
  input: RevokeSessionInput;
};
export type SessionRowRevokeSessionMutation$data = {
  readonly revokeSession: {
    readonly error: string | null;
  };
};
export type SessionRowRevokeSessionMutation = {
  response: SessionRowRevokeSessionMutation$data;
  variables: SessionRowRevokeSessionMutation$variables;
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
    "concreteType": "RevokeSessionPayload",
    "kind": "LinkedField",
    "name": "revokeSession",
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
    "name": "SessionRowRevokeSessionMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SessionRowRevokeSessionMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ff5900811f750a8bfb83511c69b109f1",
    "id": null,
    "metadata": {},
    "name": "SessionRowRevokeSessionMutation",
    "operationKind": "mutation",
    "text": "mutation SessionRowRevokeSessionMutation(\n  $input: RevokeSessionInput!\n) {\n  revokeSession(input: $input) {\n    error\n  }\n}\n"
  }
};
})();

(node as any).hash = "ea03c8185fbf1583ce7e8a276fd80a0b";

export default node;
