/**
 * @generated SignedSource<<dd692bd1f117f6bd722ae2e3e45f498d>>
 * @relayHash 360b8a63b14154e6762d64c916371a6e
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 360b8a63b14154e6762d64c916371a6e

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
    "id": "360b8a63b14154e6762d64c916371a6e",
    "metadata": {},
    "name": "SettingsSessionRowRevokeSessionMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "10856882ebffa0ea2ce66e3979b1e721";

export default node;
