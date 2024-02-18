/**
 * @generated SignedSource<<a3af5725464d9f5b89ab1cfb7320578a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type LoanScheduledPaymentStatus = "DELAYED" | "PAID" | "TO_BE_PAID" | "%future added value";
export type ScheduledPaymentRowQuery$variables = {
  id: string;
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
    "name": "id"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
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
    "cacheID": "892b0b7cb2372e8cefa31a23a068985e",
    "id": null,
    "metadata": {},
    "name": "ScheduledPaymentRowQuery",
    "operationKind": "query",
    "text": "query ScheduledPaymentRowQuery(\n  $id: ID!\n) {\n  scheduledPaymentsbyLoanId(id: $id) {\n    id\n    loan_id\n    amortize\n    status\n    scheduledDate\n  }\n}\n"
  }
};
})();

(node as any).hash = "ec2294b26d1eb79b9dfef17582fbef28";

export default node;
