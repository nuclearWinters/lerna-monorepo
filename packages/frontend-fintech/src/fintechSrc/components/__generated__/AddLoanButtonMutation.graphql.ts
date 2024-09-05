/**
 * @generated SignedSource<<ab4c3c8d572d53a52929e7a29ee377a7>>
 * @relayHash 8fb70b700252819b04a0357e79c75aa6
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 8fb70b700252819b04a0357e79c75aa6

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type AddLoanInput = {
  clientMutationId?: string | null | undefined;
  goal: string;
  term: number;
};
export type AddLoanButtonMutation$variables = {
  input: AddLoanInput;
};
export type AddLoanButtonMutation$data = {
  readonly addLoan: {
    readonly error: string;
  };
};
export type AddLoanButtonMutation = {
  response: AddLoanButtonMutation$data;
  variables: AddLoanButtonMutation$variables;
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
    "name": "AddLoanButtonMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AddLoanButtonMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "8fb70b700252819b04a0357e79c75aa6\r",
    "metadata": {},
    "name": "AddLoanButtonMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "52462635ad919275ca7d0e6bfa23d964";

export default node;
