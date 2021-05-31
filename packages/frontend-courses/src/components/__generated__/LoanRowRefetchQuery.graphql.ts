/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type LoanRowRefetchQueryVariables = {
    id: string;
};
export type LoanRowRefetchQueryResponse = {
    readonly node: {
        readonly " $fragmentRefs": FragmentRefs<"LoanRow_loan">;
    } | null;
};
export type LoanRowRefetchQuery = {
    readonly response: LoanRowRefetchQueryResponse;
    readonly variables: LoanRowRefetchQueryVariables;
};



/*
query LoanRowRefetchQuery(
  $id: ID!
) {
  node(id: $id) {
    __typename
    ...LoanRow_loan
    id
  }
}

fragment LoanRow_loan on Loan {
  id
  _id_user
  score
  ROI
  goal
  term
  raised
  expiry
  status
}
*/

const node: ConcreteRequest = (function () {
    var v0 = [
        {
            "defaultValue": null,
            "kind": "LocalArgument",
            "name": "id"
        } as any
    ], v1 = [
        {
            "kind": "Variable",
            "name": "id",
            "variableName": "id"
        } as any
    ];
    return {
        "fragment": {
            "argumentDefinitions": (v0 /*: any*/),
            "kind": "Fragment",
            "metadata": null,
            "name": "LoanRowRefetchQuery",
            "selections": [
                {
                    "alias": null,
                    "args": (v1 /*: any*/),
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                        {
                            "args": null,
                            "kind": "FragmentSpread",
                            "name": "LoanRow_loan"
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
            "argumentDefinitions": (v0 /*: any*/),
            "kind": "Operation",
            "name": "LoanRowRefetchQuery",
            "selections": [
                {
                    "alias": null,
                    "args": (v1 /*: any*/),
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
                                    "name": "_id_user",
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
            "cacheID": "13a7861fb91bc79bcbc3622e4ddf2710",
            "id": null,
            "metadata": {},
            "name": "LoanRowRefetchQuery",
            "operationKind": "query",
            "text": "query LoanRowRefetchQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ...LoanRow_loan\n    id\n  }\n}\n\nfragment LoanRow_loan on Loan {\n  id\n  _id_user\n  score\n  ROI\n  goal\n  term\n  raised\n  expiry\n  status\n}\n"
        }
    } as any;
})();
(node as any).hash = 'c28c5b57474e75d5f45d2da43d763fcc';
export default node;
