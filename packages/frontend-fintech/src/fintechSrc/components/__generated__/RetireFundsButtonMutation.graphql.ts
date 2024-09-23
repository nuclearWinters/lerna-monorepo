/**
 * @generated SignedSource<<32eb9e5db06f04abf6f61e9a31c20c70>>
 * @relayHash 8eb16c9fc2c34f7d9630e5664a33b9e6
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 8eb16c9fc2c34f7d9630e5664a33b9e6

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type AddFundsInput = {
  clientMutationId?: string | null | undefined;
  quantity: string;
};
export type RetireFundsButtonMutation$variables = {
  input: AddFundsInput;
};
export type RetireFundsButtonMutation$data = {
  readonly addFunds: {
    readonly error: string;
  };
};
export type RetireFundsButtonMutation = {
  response: RetireFundsButtonMutation$data;
  variables: RetireFundsButtonMutation$variables;
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
    "concreteType": "AddFundsPayload",
    "kind": "LinkedField",
    "name": "addFunds",
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
    "name": "RetireFundsButtonMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RetireFundsButtonMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "8eb16c9fc2c34f7d9630e5664a33b9e6",
    "metadata": {},
    "name": "RetireFundsButtonMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "772277c69661375f67265a8f6f6b8919";

export default node;
