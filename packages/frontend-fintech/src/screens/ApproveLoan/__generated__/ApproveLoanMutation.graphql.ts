/**
 * @generated SignedSource<<27290267721c5a210b9aa4f5d362f9b0>>
 * @relayHash f195854fe93adea3b9eb8a2246eb539b
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID f195854fe93adea3b9eb8a2246eb539b

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type LoanStatus = "FINANCING" | "PAID" | "PAST_DUE" | "TO_BE_PAID" | "WAITING_FOR_APPROVAL" | "%future added value";
export type ApproveLoanInput = {
  clientMutationId?: string | null | undefined;
  loan_gid: string;
};
export type ApproveLoanMutation$variables = {
  input: ApproveLoanInput;
};
export type ApproveLoanMutation$data = {
  readonly approveLoan: {
    readonly error: string;
    readonly loan: {
      readonly id: string;
      readonly status: LoanStatus;
    } | null | undefined;
  };
};
export type ApproveLoanMutation = {
  response: ApproveLoanMutation$data;
  variables: ApproveLoanMutation$variables;
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
    "name": "ApproveLoanMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ApproveLoanMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "f195854fe93adea3b9eb8a2246eb539b",
    "metadata": {},
    "name": "ApproveLoanMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "2d9a6c6ac36d2707fd9ec947fb7f9df3";

export default node;
