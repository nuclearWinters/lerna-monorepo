/**
 * @generated SignedSource<<d30a81048f87c21f0b05ad3928e460e4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type AddLendsInput = {
  clientMutationId?: string | null;
  lender_gid: string;
  lends: ReadonlyArray<LendList>;
};
export type LendList = {
  loan_gid: string;
  quantity: string;
  borrower_id: string;
  term: number;
  goal: string;
  ROI: number;
};
export type AddInvestmentsMutation$variables = {
  input: AddLendsInput;
};
export type AddInvestmentsMutationVariables = AddInvestmentsMutation$variables;
export type AddInvestmentsMutation$data = {
  readonly addLends: {
    readonly error: string;
    readonly validAccessToken: string;
  };
};
export type AddInvestmentsMutationResponse = AddInvestmentsMutation$data;
export type AddInvestmentsMutation = {
  variables: AddInvestmentsMutationVariables;
  response: AddInvestmentsMutation$data;
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
    "name": "AddInvestmentsMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AddInvestmentsMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "9aa08a809975ca556933bb1478d3013e",
    "id": null,
    "metadata": {},
    "name": "AddInvestmentsMutation",
    "operationKind": "mutation",
    "text": "mutation AddInvestmentsMutation(\n  $input: AddLendsInput!\n) {\n  addLends(input: $input) {\n    error\n    validAccessToken\n  }\n}\n"
  }
};
})();

(node as any).hash = "4e5cf9b355984b680017055078259249";

export default node;
