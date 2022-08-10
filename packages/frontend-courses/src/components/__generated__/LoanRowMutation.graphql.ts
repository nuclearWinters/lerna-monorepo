/**
 * @generated SignedSource<<88c6a60370e58be2b9c480c739c5cea1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type LoanStatus = "FINANCING" | "PAID" | "PAST_DUE" | "TO_BE_PAID" | "WAITING_FOR_APPROVAL" | "%future added value";
export type ApproveLoanInput = {
  clientMutationId?: string | null;
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
    } | null;
    readonly validAccessToken: string;
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
        "kind": "ScalarField",
        "name": "validAccessToken",
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
    "cacheID": "acbd1401be5a5550bb912f536b34d47b",
    "id": null,
    "metadata": {},
    "name": "LoanRowMutation",
    "operationKind": "mutation",
    "text": "mutation LoanRowMutation(\n  $input: ApproveLoanInput!\n) {\n  approveLoan(input: $input) {\n    error\n    validAccessToken\n    loan {\n      id\n      status\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "52597eb7141c6fbeada50a4e67f6a6ed";

export default node;
