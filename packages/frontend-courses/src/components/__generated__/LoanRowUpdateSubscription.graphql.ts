/**
 * @generated SignedSource<<bda172f1e9bacd00b3e1dea8d29fa6fa>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type LoanRowUpdateSubscription$variables = {
  gid: string;
};
export type LoanRowUpdateSubscription$data = {
  readonly loans_subscribe_update: {
    readonly id: string;
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
v1 = [
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
    "selections": (v1/*: any*/),
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "LoanRowUpdateSubscription",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "5caf878ef357db4ac6f8880b3ef77aa5",
    "id": null,
    "metadata": {},
    "name": "LoanRowUpdateSubscription",
    "operationKind": "subscription",
    "text": "subscription LoanRowUpdateSubscription(\n  $gid: ID!\n) {\n  loans_subscribe_update(gid: $gid) {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "2716f19d4cfd50abe53252bca53c3486";

export default node;
