/**
 * @generated SignedSource<<f0fe52a9487a2fb29d7580aa8950485a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type AddLendsInput = {
  clientMutationId?: string | null;
  lends: ReadonlyArray<LendList>;
};
export type LendList = {
  ROI: number;
  borrower_id: string;
  goal: string;
  loan_gid: string;
  quantity: string;
  term: number;
};
export type AddInvestmentsMutation$variables = {
  input: AddLendsInput;
};
export type AddInvestmentsMutation$data = {
  readonly addLends: {
    readonly error: string;
    readonly validAccessToken: string;
  };
};
export type AddInvestmentsMutation = {
  response: AddInvestmentsMutation$data;
  variables: AddInvestmentsMutation$variables;
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
