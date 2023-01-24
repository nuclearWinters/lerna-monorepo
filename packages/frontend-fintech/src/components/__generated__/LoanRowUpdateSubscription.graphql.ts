/**
 * @generated SignedSource<<3f63e59c5a40dbb49cbdd668389af618>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type LoanScheduledPaymentStatus = "DELAYED" | "PAID" | "TO_BE_PAID" | "%future added value";
export type LoanStatus = "FINANCING" | "PAID" | "PAST_DUE" | "TO_BE_PAID" | "WAITING_FOR_APPROVAL" | "%future added value";
export type LoanRowUpdateSubscription$variables = {
  gid: string;
};
export type LoanRowUpdateSubscription$data = {
  readonly loans_subscribe_update: {
    readonly ROI: number;
    readonly expiry: Int;
    readonly goal: string;
    readonly id: string;
    readonly id_user: string;
    readonly pending: string;
    readonly pendingCents: number;
    readonly raised: string;
    readonly scheduledPayments: ReadonlyArray<{
      readonly amortize: string;
      readonly scheduledDate: Int;
      readonly status: LoanScheduledPaymentStatus;
    }> | null;
    readonly score: string;
    readonly status: LoanStatus;
    readonly term: number;
  };
};
export type LoanRowUpdateSubscription = {
  response: LoanRowUpdateSubscription$data;
  variables: LoanRowUpdateSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "gid"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "gid",
        "variableName": "gid"
      }
    ],
    "concreteType": "Loan",
    "kind": "LinkedField",
    "name": "loans_subscribe_update",
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
        "name": "id_user",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "score",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "ROI",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "goal",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "term",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "raised",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "expiry",
        "storageKey": null
      },
      (v1/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "ScheduledPayments",
        "kind": "LinkedField",
        "name": "scheduledPayments",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "amortize",
            "storageKey": null
          },
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "scheduledDate",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "pending",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "pendingCents",
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
    "name": "LoanRowUpdateSubscription",
    "selections": (v2/*: any*/),
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "LoanRowUpdateSubscription",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "fc82cc9162c291aafd347be0d58be2b1",
    "id": null,
    "metadata": {},
    "name": "LoanRowUpdateSubscription",
    "operationKind": "subscription",
    "text": "subscription LoanRowUpdateSubscription(\n  $gid: ID!\n) {\n  loans_subscribe_update(gid: $gid) {\n    id\n    id_user\n    score\n    ROI\n    goal\n    term\n    raised\n    expiry\n    status\n    scheduledPayments {\n      amortize\n      status\n      scheduledDate\n    }\n    pending\n    pendingCents\n  }\n}\n"
  }
};
})();

(node as any).hash = "92d94996e12be222466756ee9fad7321";

export default node;
