/**
 * @generated SignedSource<<303958ed6e355d8afbaeef3c04b08f27>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type RevokeSessionInput = {
  clientMutationId?: string | null | undefined;
  sessionId: string;
};
export type SessionRowRevokeSessionMutation$variables = {
  input: RevokeSessionInput;
};
export type SessionRowRevokeSessionMutation$data = {
  readonly revokeSession: {
    readonly error: string;
    readonly session: {
      readonly expirationDate: Int;
      readonly id: string;
    } | null | undefined;
    readonly shouldReloadBrowser: boolean;
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
    "cacheID": "c805d3efba6a287ee137739ad32685a5",
    "id": null,
    "metadata": {},
    "name": "SessionRowRevokeSessionMutation",
    "operationKind": "mutation",
    "text": "mutation SessionRowRevokeSessionMutation(\n  $input: RevokeSessionInput!\n) {\n  revokeSession(input: $input) {\n    error\n    shouldReloadBrowser\n    session {\n      id\n      expirationDate\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "6ac2c13bea532666bcf23fcb7a4f54a0";

export default node;
