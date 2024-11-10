/**
 * @generated SignedSource<<d319e9ac3d5d65dfc92bce83149c35d6>>
 * @relayHash 4e65856e4f21af21cfd702bbdea624e4
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 4e65856e4f21af21cfd702bbdea624e4

import { ConcreteRequest } from 'relay-runtime';
export type ExtendSessionInput = {
  clientMutationId?: string | null | undefined;
};
export type CheckExpirationMutation$variables = {
  input: ExtendSessionInput;
};
export type CheckExpirationMutation$data = {
  readonly extendSession: {
    readonly error: string;
  };
};
export type CheckExpirationMutation = {
  response: CheckExpirationMutation$data;
  variables: CheckExpirationMutation$variables;
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
    "concreteType": "ExtendSessionPayload",
    "kind": "LinkedField",
    "name": "extendSession",
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
    "name": "CheckExpirationMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CheckExpirationMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "4e65856e4f21af21cfd702bbdea624e4\r",
    "metadata": {},
    "name": "CheckExpirationMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "81caabdca1e75cb5b68a91ddc171546a";

export default node;
