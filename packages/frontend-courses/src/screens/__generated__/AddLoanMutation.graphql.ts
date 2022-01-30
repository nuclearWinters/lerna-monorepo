/**
 * @generated SignedSource<<17ad7e1351df05e7ac3580bdf7b2e30b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type AddLoanInput = {
  clientMutationId?: string | null;
  user_gid: string;
  term: number;
  goal: string;
};
export type AddLoanMutation$variables = {
  input: AddLoanInput;
};
export type AddLoanMutationVariables = AddLoanMutation$variables;
export type AddLoanMutation$data = {
  readonly addLoan: {
    readonly error: string;
    readonly validAccessToken: string;
  };
};
export type AddLoanMutationResponse = AddLoanMutation$data;
export type AddLoanMutation = {
  variables: AddLoanMutationVariables;
  response: AddLoanMutation$data;
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
    "cacheID": "ddc2af4eeaf57ce271d4bc2f7c4f7147",
    "id": null,
    "metadata": {},
    "name": "AddLoanMutation",
    "operationKind": "mutation",
    "text": "mutation AddLoanMutation(\n  $input: AddLoanInput!\n) {\n  addLoan(input: $input) {\n    error\n    validAccessToken\n  }\n}\n"
  }
};
})();

(node as any).hash = "fcd80089e064adae267565217b35b0c5";

export default node;
