/**
 * @generated SignedSource<<8666925cdde3f4db3f0dd86d399add22>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
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
    "cacheID": "4e65856e4f21af21cfd702bbdea624e4",
    "id": null,
    "metadata": {},
    "name": "CheckExpirationMutation",
    "operationKind": "mutation",
    "text": "mutation CheckExpirationMutation(\n  $input: ExtendSessionInput!\n) {\n  extendSession(input: $input) {\n    error\n  }\n}\n"
  }
};
})();

(node as any).hash = "81caabdca1e75cb5b68a91ddc171546a";

export default node;
