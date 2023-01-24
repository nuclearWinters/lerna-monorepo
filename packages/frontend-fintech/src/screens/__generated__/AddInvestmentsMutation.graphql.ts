/**
 * @generated SignedSource<<b3aa3837fcb049f58f7131b961c705b8>>
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
    "cacheID": "64b571ffb2b4d4c3b1ab5d40cf54f5b1",
    "id": null,
    "metadata": {},
    "name": "AddInvestmentsMutation",
    "operationKind": "mutation",
    "text": "mutation AddInvestmentsMutation(\n  $input: AddLendsInput!\n) {\n  addLends(input: $input) {\n    error\n  }\n}\n"
  }
};
})();

(node as any).hash = "cb835c1d772c479baaed457025935b0c";

export default node;
