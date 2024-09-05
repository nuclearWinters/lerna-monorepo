/**
 * @generated SignedSource<<018b2f3b9d8f5180b6e1f7c5f78a8876>>
 * @relayHash 92aa35a102966a6f0e1d793c0282ed47
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 92aa35a102966a6f0e1d793c0282ed47

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type AddLendsInput = {
  clientMutationId?: string | null | undefined;
  lends: ReadonlyArray<LendList>;
};
export type LendList = {
  borrower_id: string;
  loan_gid: string;
  quantity: string;
};
export type AddInvestmentsPageMutation$variables = {
  input: AddLendsInput;
};
export type AddInvestmentsPageMutation$data = {
  readonly addLends: {
    readonly error: string;
  };
};
export type AddInvestmentsPageMutation = {
  response: AddInvestmentsPageMutation$data;
  variables: AddInvestmentsPageMutation$variables;
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
    "concreteType": "AddLendsPayload",
    "kind": "LinkedField",
    "name": "addLends",
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
    "name": "AddInvestmentsPageMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AddInvestmentsPageMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "92aa35a102966a6f0e1d793c0282ed47",
    "metadata": {},
    "name": "AddInvestmentsPageMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "6c45cc5db5ccf7b949948564cd559632";

export default node;
