/**
 * @generated SignedSource<<6720af55b7995245d53fbfbc2df7ad43>>
 * @relayHash 363198c728833a7a9684d8072b6c96db
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 363198c728833a7a9684d8072b6c96db

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type AddFundsInput = {
  clientMutationId?: string | null | undefined;
  quantity: string;
};
export type AddFundsMutation$variables = {
  input: AddFundsInput;
};
export type AddFundsMutation$data = {
  readonly addFunds: {
    readonly error: string;
  };
};
export type AddFundsMutation = {
  response: AddFundsMutation$data;
  variables: AddFundsMutation$variables;
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
    "id": "363198c728833a7a9684d8072b6c96db",
    "metadata": {},
    "name": "AddFundsMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "2bb15824bd1076af40230f562d29f461";

export default node;
