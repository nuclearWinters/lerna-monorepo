/**
 * @generated SignedSource<<1ee9aa55b2c46b573e09b68f1b730470>>
 * @relayHash ccd989a67362a42de18960129992958e
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID ccd989a67362a42de18960129992958e

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type AddFundsInput = {
  clientMutationId?: string | null | undefined;
  quantity: string;
};
export type AddFundsButtonMutation$variables = {
  input: AddFundsInput;
};
export type AddFundsButtonMutation$data = {
  readonly addFunds: {
    readonly error: string;
  };
};
export type AddFundsButtonMutation = {
  response: AddFundsButtonMutation$data;
  variables: AddFundsButtonMutation$variables;
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
    "name": "AddFundsButtonMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AddFundsButtonMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "ccd989a67362a42de18960129992958e",
    "metadata": {},
    "name": "AddFundsButtonMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "d48e4677a9d84874df54fdef6a72da3c";

export default node;
