/**
 * @generated SignedSource<<4944ee3f720712c4ee59de7722386dd6>>
 * @relayHash 6fd0f5290ad731d160369f4bbae87b78
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 6fd0f5290ad731d160369f4bbae87b78

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type LoanStatus = "FINANCING" | "PAID" | "PAST_DUE" | "TO_BE_PAID" | "WAITING_FOR_APPROVAL" | "%future added value";
export type ApproveLoanInput = {
  clientMutationId?: string | null | undefined;
  loan_gid: string;
};
export type ApproveLoanPageMutation$variables = {
  input: ApproveLoanInput;
};
export type ApproveLoanPageMutation$data = {
  readonly approveLoan: {
    readonly error: string;
    readonly loan: {
      readonly id: string;
      readonly status: LoanStatus;
    } | null | undefined;
  };
};
export type ApproveLoanPageMutation = {
  response: ApproveLoanPageMutation$data;
  variables: ApproveLoanPageMutation$variables;
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
    "name": "ApproveLoanPageMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ApproveLoanPageMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "6fd0f5290ad731d160369f4bbae87b78",
    "metadata": {},
    "name": "ApproveLoanPageMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "b24e8744ef0d4ed5ad1f59b2a4d334fa";

export default node;
