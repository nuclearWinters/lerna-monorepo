/**
 * @generated SignedSource<<95cd4b33453af81864366b49948126f2>>
 * @relayHash cf31722bae61dfad16168680dadfcde6
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID cf31722bae61dfad16168680dadfcde6

import { ConcreteRequest } from 'relay-runtime';
export type LoanScheduledPaymentStatus = "DELAYED" | "PAID" | "TO_BE_PAID" | "%future added value";
export type ScheduledPaymentRowQuery$variables = {
  loan_gid: string;
};
export type ScheduledPaymentRowQuery$data = {
  readonly scheduledPaymentsbyLoanId: ReadonlyArray<{
    readonly amortize: string;
    readonly id: string;
    readonly loan_id: string;
    readonly scheduledDate: Int;
    readonly status: LoanScheduledPaymentStatus;
  } | null | undefined> | null | undefined;
};
export type ScheduledPaymentRowQuery = {
  response: ScheduledPaymentRowQuery$data;
  variables: ScheduledPaymentRowQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "loan_gid"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "loan_gid",
        "variableName": "loan_gid"
      }
    ],
    "concreteType": "ScheduledPayments",
    "kind": "LinkedField",
    "name": "scheduledPaymentsbyLoanId",
    "plural": true,
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
        "name": "loan_id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "amortize",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "status",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "scheduledDate",
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
    "name": "ScheduledPaymentRowQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ScheduledPaymentRowQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "cf31722bae61dfad16168680dadfcde6",
    "metadata": {},
    "name": "ScheduledPaymentRowQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "3217501e0c13b104a2d2b95a1b316f3c";

export default node;
