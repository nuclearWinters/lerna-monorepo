/**
 * @generated SignedSource<<969d4a3da5c04ce12d1fce5a2c2c3ec9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MyLoansQueriesRefetchQuery$variables = {
  id: string;
};
export type MyLoansQueriesRefetchQuery$data = {
  readonly node: {
    readonly " $fragmentSpreads": FragmentRefs<"MyLoansQueriesRowRefetch_loan">;
  } | null | undefined;
};
export type MyLoansQueriesRefetchQuery = {
  response: MyLoansQueriesRefetchQuery$data;
  variables: MyLoansQueriesRefetchQuery$variables;
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
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "MyLoansQueriesRefetchQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "MyLoansQueriesRowRefetch_loan"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MyLoansQueriesRefetchQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "user_id",
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
                "name": "pending",
                "storageKey": null
              }
            ],
            "type": "Loan",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "75da5b0b0faf1afd32c0ebdfcd467741",
    "id": null,
    "metadata": {},
    "name": "MyLoansQueriesRefetchQuery",
    "operationKind": "query",
    "text": "query MyLoansQueriesRefetchQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ...MyLoansQueriesRowRefetch_loan\n    id\n  }\n}\n\nfragment MyLoansQueriesRowRefetch_loan on Loan {\n  id\n  user_id\n  score\n  ROI\n  goal\n  term\n  raised\n  expiry\n  status\n  pending\n}\n"
  }
};
})();

(node as any).hash = "b9bd23b9161ac47acd933bc5b8ded744";

export default node;
