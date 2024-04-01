/**
 * @generated SignedSource<<b3c3a238199ed1c0373474aab347c517>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type AddLoanInput = {
  clientMutationId?: string | null | undefined;
  goal: string;
  term: number;
};
export type AddLoanMutation$variables = {
  input: AddLoanInput;
};
export type AddLoanMutation$data = {
  readonly addLoan: {
    readonly error: string;
  };
};
export type AddLoanMutation = {
  response: AddLoanMutation$data;
  variables: AddLoanMutation$variables;
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
    "concreteType": "AddLoanPayload",
    "kind": "LinkedField",
    "name": "addLoan",
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
    "name": "AddLoanMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AddLoanMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "724d04ad259434fb4e466e4916f7fad6",
    "id": null,
    "metadata": {},
    "name": "AddLoanMutation",
    "operationKind": "mutation",
    "text": "mutation AddLoanMutation(\n  $input: AddLoanInput!\n) {\n  addLoan(input: $input) {\n    error\n  }\n}\n"
  }
};
})();

(node as any).hash = "a2ada4a2c289091b0df386251a4df46c";

export default node;
