/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyInvestmentsPaginationQueryVariables = {
    count?: number | null;
    cursor?: string | null;
    id: string;
};
export type MyInvestmentsPaginationQueryResponse = {
    readonly " $fragmentRefs": FragmentRefs<"MyInvestments_query">;
};
export type MyInvestmentsPaginationQuery = {
    readonly response: MyInvestmentsPaginationQueryResponse;
    readonly variables: MyInvestmentsPaginationQueryVariables;
};



/*
query MyInvestmentsPaginationQuery(
  $count: Int = 2
  $cursor: String = ""
  $id: String!
) {
  ...MyInvestments_query_1G22uz
}

fragment InvestmentRow_investment on Investment {
  id
  _id_borrower
  _id_loan
  quantity
  created
  updated
  status
}

fragment MyInvestments_query_1G22uz on Query {
  investments(first: $count, after: $cursor, user_id: $id) {
    edges {
      node {
        id
        ...InvestmentRow_investment
        __typename
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
*/

const node: ConcreteRequest = (function () {
    var v0 = [
        {
            "defaultValue": 2,
            "kind": "LocalArgument",
            "name": "count"
        } as any,
        {
            "defaultValue": "",
            "kind": "LocalArgument",
            "name": "cursor"
        } as any,
        {
            "defaultValue": null,
            "kind": "LocalArgument",
            "name": "id"
        } as any
    ], v1 = [
        {
            "kind": "Variable",
            "name": "after",
            "variableName": "cursor"
        } as any,
        {
            "kind": "Variable",
            "name": "first",
            "variableName": "count"
        } as any,
        {
            "kind": "Variable",
            "name": "user_id",
            "variableName": "id"
        } as any
    ];
    return {
        "fragment": {
            "argumentDefinitions": (v0 /*: any*/),
            "kind": "Fragment",
            "metadata": null,
            "name": "MyInvestmentsPaginationQuery",
            "selections": [
                {
                    "args": [
                        {
                            "kind": "Variable",
                            "name": "count",
                            "variableName": "count"
                        },
                        {
                            "kind": "Variable",
                            "name": "cursor",
                            "variableName": "cursor"
                        }
                    ],
                    "kind": "FragmentSpread",
                    "name": "MyInvestments_query"
                }
            ],
            "type": "Query",
            "abstractKey": null
        },
        "kind": "Request",
        "operation": {
            "argumentDefinitions": (v0 /*: any*/),
            "kind": "Operation",
            "name": "MyInvestmentsPaginationQuery",
            "selections": [
                {
                    "alias": null,
                    "args": (v1 /*: any*/),
                    "concreteType": "InvestmentsConnection",
                    "kind": "LinkedField",
                    "name": "investments",
                    "plural": false,
                    "selections": [
                        {
                            "alias": null,
                            "args": null,
                            "concreteType": "InvestmentsEdge",
                            "kind": "LinkedField",
                            "name": "edges",
                            "plural": true,
                            "selections": [
                                {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Investment",
                                    "kind": "LinkedField",
                                    "name": "node",
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
                                            "name": "_id_borrower",
                                            "storageKey": null
                                        },
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
                                            "name": "created",
                                            "storageKey": null
                                        },
                                        {
                                            "alias": null,
                                            "args": null,
                                            "kind": "ScalarField",
                                            "name": "updated",
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
                                            "name": "__typename",
                                            "storageKey": null
                                        }
                                    ],
                                    "storageKey": null
                                },
                                {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "cursor",
                                    "storageKey": null
                                }
                            ],
                            "storageKey": null
                        },
                        {
                            "alias": null,
                            "args": null,
                            "concreteType": "PageInfo",
                            "kind": "LinkedField",
                            "name": "pageInfo",
                            "plural": false,
                            "selections": [
                                {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "endCursor",
                                    "storageKey": null
                                },
                                {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "hasNextPage",
                                    "storageKey": null
                                }
                            ],
                            "storageKey": null
                        }
                    ],
                    "storageKey": null
                },
                {
                    "alias": null,
                    "args": (v1 /*: any*/),
                    "filters": [
                        "user_id"
                    ],
                    "handle": "connection",
                    "key": "MyInvestments_query_investments",
                    "kind": "LinkedHandle",
                    "name": "investments"
                }
            ]
        },
        "params": {
            "cacheID": "3e8a58b52e85b855a6c6dd9d8998ed62",
            "id": null,
            "metadata": {},
            "name": "MyInvestmentsPaginationQuery",
            "operationKind": "query",
            "text": "query MyInvestmentsPaginationQuery(\n  $count: Int = 2\n  $cursor: String = \"\"\n  $id: String!\n) {\n  ...MyInvestments_query_1G22uz\n}\n\nfragment InvestmentRow_investment on Investment {\n  id\n  _id_borrower\n  _id_loan\n  quantity\n  created\n  updated\n  status\n}\n\nfragment MyInvestments_query_1G22uz on Query {\n  investments(first: $count, after: $cursor, user_id: $id) {\n    edges {\n      node {\n        id\n        ...InvestmentRow_investment\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n"
        }
    } as any;
})();
(node as any).hash = '8faf7d6a2ad83a1ba91caee1cd54ab10';
export default node;
