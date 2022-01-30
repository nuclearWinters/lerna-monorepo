/**
 * @generated SignedSource<<143b872fc83db99ef4807ef5701db678>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type AddFundsInput = {
  clientMutationId?: string | null;
  user_gid: string;
  quantity: string;
};
export type AddFundsMutation$variables = {
  input: AddFundsInput;
};
export type AddFundsMutationVariables = AddFundsMutation$variables;
export type AddFundsMutation$data = {
  readonly addFunds: {
    readonly error: string;
    readonly validAccessToken: string;
  };
};
export type AddFundsMutationResponse = AddFundsMutation$data;
export type AddFundsMutation = {
  variables: AddFundsMutationVariables;
  response: AddFundsMutation$data;
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
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "validAccessToken",
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
    "name": "AddFundsMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AddFundsMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "b0984601444b2376feeca4094815e3de",
    "id": null,
    "metadata": {},
    "name": "AddFundsMutation",
    "operationKind": "mutation",
    "text": "mutation AddFundsMutation(\n  $input: AddFundsInput!\n) {\n  addFunds(input: $input) {\n    error\n    validAccessToken\n  }\n}\n"
  }
};
})();

(node as any).hash = "1b729b33c09a5c004e5a443b5ff0fb03";

export default node;
