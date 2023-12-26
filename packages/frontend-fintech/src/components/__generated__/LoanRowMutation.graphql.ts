/**
 * @generated SignedSource<<9e0a4d3a19a4506eafb2835412690850>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type LoanStatus = "FINANCING" | "PAID" | "PAST_DUE" | "TO_BE_PAID" | "WAITING_FOR_APPROVAL" | "%future added value";
export type ApproveLoanInput = {
  clientMutationId?: string | null | undefined;
  loan_gid: string;
};
export type LoanRowMutation$variables = {
  input: ApproveLoanInput;
};
export type LoanRowMutation$data = {
  readonly approveLoan: {
    readonly error: string;
    readonly loan: {
      readonly id: string;
      readonly status: LoanStatus;
    } | null | undefined;
  };
};
export type LoanRowMutation = {
  response: LoanRowMutation$data;
  variables: LoanRowMutation$variables;
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
    "concreteType": "ApproveLoanPayload",
    "kind": "LinkedField",
    "name": "approveLoan",
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
        "concreteType": "Loan",
        "kind": "LinkedField",
        "name": "loan",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "status",
            "storageKey": null
          }
        ],
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
    "name": "LoanRowMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "LoanRowMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "6e5ef895faf8652d89ec6f5667e1a505",
    "id": null,
    "metadata": {},
    "name": "LoanRowMutation",
    "operationKind": "mutation",
    "text": "mutation LoanRowMutation(\n  $input: ApproveLoanInput!\n) {\n  approveLoan(input: $input) {\n    error\n    loan {\n      id\n      status\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "15e8c9fc1464ad304c9bcd7248aeb348";

export default node;
