/**
 * @generated SignedSource<<4926881617cf61045e29bfa7a1b9d72e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type RoutesUserSubscription$variables = {
  user_gid: string;
};
export type RoutesUserSubscription$data = {
  readonly user_subscribe: {
    readonly user: {
      readonly accountAvailable: string;
      readonly id: string;
      readonly investmentsUser: ReadonlyArray<{
        readonly ROI: number;
        readonly _id_loan: string;
        readonly payments: number;
        readonly quantity: number;
        readonly term: number;
      }>;
    };
  };
};
export type RoutesUserSubscription = {
  response: RoutesUserSubscription$data;
  variables: RoutesUserSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "user_gid"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "user_gid",
        "variableName": "user_gid"
      }
    ],
    "concreteType": "User_Subscribe",
    "kind": "LinkedField",
    "name": "user_subscribe",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "user",
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
            "name": "accountAvailable",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "InvestmentsUser",
            "kind": "LinkedField",
            "name": "investmentsUser",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "_id_loan",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "quantity",
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
                "name": "ROI",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "payments",
                "storageKey": null
              }
            ],
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
    "name": "RoutesUserSubscription",
    "selections": (v1/*: any*/),
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RoutesUserSubscription",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "55af187334ee0a466e9a4b1f10ff51d8",
    "id": null,
    "metadata": {},
    "name": "RoutesUserSubscription",
    "operationKind": "subscription",
    "text": "subscription RoutesUserSubscription(\n  $user_gid: ID!\n) {\n  user_subscribe(user_gid: $user_gid) {\n    user {\n      id\n      accountAvailable\n      investmentsUser {\n        _id_loan\n        quantity\n        term\n        ROI\n        payments\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "651cad6f1b268f78153ae135c7c2e9de";

export default node;
