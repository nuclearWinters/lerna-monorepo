/**
 * @generated SignedSource<<6219ebc3c28794ef7173317795064828>>
 * @relayHash 2ec3011510269d3a2c968f03552bf2cc
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 2ec3011510269d3a2c968f03552bf2cc

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type RevokeSessionInput = {
  clientMutationId?: string | null | undefined;
  sessionId: string;
};
export type SettingsSessionRowRevokeSessionMutation$variables = {
  input: RevokeSessionInput;
};
export type SettingsSessionRowRevokeSessionMutation$data = {
  readonly revokeSession: {
    readonly error: string;
    readonly session: {
      readonly expirationDate: Int;
      readonly id: string;
    } | null | undefined;
    readonly shouldReloadBrowser: boolean;
  };
};
export type SettingsSessionRowRevokeSessionMutation = {
  response: SettingsSessionRowRevokeSessionMutation$data;
  variables: SettingsSessionRowRevokeSessionMutation$variables;
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
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "shouldReloadBrowser",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Session",
        "kind": "LinkedField",
        "name": "session",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "expirationDate",
            "storageKey": null
          }
        ],
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
    "name": "SettingsSessionRowRevokeSessionMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SettingsSessionRowRevokeSessionMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "2ec3011510269d3a2c968f03552bf2cc",
    "metadata": {},
    "name": "SettingsSessionRowRevokeSessionMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "87b83b1d24fc383229834212f608eb92";

export default node;
