/**
 * @generated SignedSource<<c8c5a27d2377aa6937a1d7d81d51a4ef>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type AddFundsInput = {
  clientMutationId?: string | null | undefined;
  quantity: string;
};
export type RetireFundsMutation$variables = {
  input: AddFundsInput;
};
export type RetireFundsMutation$data = {
  readonly addFunds: {
    readonly error: string;
  };
};
export type RetireFundsMutation = {
  response: RetireFundsMutation$data;
  variables: RetireFundsMutation$variables;
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
    "name": "RetireFundsMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RetireFundsMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "29f47c163bbe2cc824eedc8befb30674",
    "id": null,
    "metadata": {},
    "name": "RetireFundsMutation",
    "operationKind": "mutation",
    "text": "mutation RetireFundsMutation(\n  $input: AddFundsInput!\n) {\n  addFunds(input: $input) {\n    error\n  }\n}\n"
  }
};
})();

(node as any).hash = "acbbccd284dc6ea659f787c91e05969c";

export default node;
