/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type LoanStatus = "FINANCING" | "PAID" | "PAST_DUE" | "TO_BE_PAID" | "WAITING_FOR_APPROVAL" | "%future added value";
export type AppQueryVariables = {
    id: string;
    status?: Array<LoanStatus> | null;
    borrower_id?: string | null;
};
export type AppQueryResponse = {
    readonly user: {
        readonly error: string;
        readonly " $fragmentRefs": FragmentRefs<"Routes_user">;
    };
    readonly " $fragmentRefs": FragmentRefs<"AddInvestments_query" | "MyTransactions_query" | "MyInvestments_query">;
};
export type AppQuery = {
    readonly response: AppQueryResponse;
    readonly variables: AppQueryVariables;
};



/*
query AppQuery(
  $id: String!
  $status: [LoanStatus!]
  $borrower_id: String
) {
  ...AddInvestments_query
  ...MyTransactions_query
  ...MyInvestments_query
  user(id: $id) {
    ...Routes_user
    error
    id
  }
}

fragment AddFunds_user on User {
  id
}

fragment AddInvestments_query on Query {
  loans(first: 5, after: "", status: $status, borrower_id: $borrower_id) {
    edges {
      node {
        id
        _id_user
        score
        ROI
        goal
        term
        raised
        expiry
        status
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

fragment AddLoan_user on User {
  id
}

fragment MyInvestments_query on Query {
  investments(first: 2, after: "", user_id: $id) {
    edges {
      node {
        id
        _id_borrower
        _id_loan
        quantity
        created
        updated
        status
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

fragment MyTransactions_query on Query {
  transactions(first: 2, after: "", user_id: $id) {
    edges {
      node {
        id
        count
        history {
          id
          _id_borrower
          _id_loan
          type
          quantity
          created
        }
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

fragment Profile_user on User {
  id
  name
  apellidoPaterno
  apellidoMaterno
  RFC
  CURP
  clabe
  mobile
  accountTotal
  accountAvailable
}

fragment RetireFunds_user on User {
  id
}

fragment Routes_user on User {
  id
  name
  apellidoPaterno
  apellidoMaterno
  accountTotal
  accountAvailable
  ...Profile_user
  ...AddFunds_user
  ...RetireFunds_user
  ...AddLoan_user
}
*/

const node: ConcreteRequest = (function () {
    var v0 = {
        "defaultValue": null,
        "kind": "LocalArgument",
        "name": "borrower_id"
    } as any, v1 = {
        "defaultValue": null,
        "kind": "LocalArgument",
        "name": "id"
    } as any, v2 = {
        "defaultValue": null,
        "kind": "LocalArgument",
        "name": "status"
    } as any, v3 = [
        {
            "kind": "Variable",
            "name": "id",
            "variableName": "id"
        } as any
    ], v4 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "error",
        "storageKey": null
    } as any, v5 = {
        "kind": "Literal",
        "name": "after",
        "value": ""
    } as any, v6 = [
        (v5 /*: any*/),
        {
            "kind": "Variable",
            "name": "borrower_id",
            "variableName": "borrower_id"
        } as any,
        {
            "kind": "Literal",
            "name": "first",
            "value": 5
        } as any,
        {
            "kind": "Variable",
            "name": "status",
            "variableName": "status"
        } as any
    ], v7 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
    } as any, v8 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "status",
        "storageKey": null
    } as any, v9 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "__typename",
        "storageKey": null
    } as any, v10 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "cursor",
        "storageKey": null
    } as any, v11 = {
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
    } as any, v12 = [
        (v5 /*: any*/),
        {
            "kind": "Literal",
            "name": "first",
            "value": 2
        } as any,
        {
            "kind": "Variable",
            "name": "user_id",
            "variableName": "id"
        } as any
    ], v13 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "_id_borrower",
        "storageKey": null
    } as any, v14 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "_id_loan",
        "storageKey": null
    } as any, v15 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "quantity",
        "storageKey": null
    } as any, v16 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "created",
        "storageKey": null
    } as any, v17 = [
        "user_id"
    ];
    return {
        "fragment": {
            "argumentDefinitions": [
                (v0 /*: any*/),
                (v1 /*: any*/),
                (v2 /*: any*/)
            ],
            "kind": "Fragment",
            "metadata": null,
            "name": "AppQuery",
            "selections": [
                {
                    "alias": null,
                    "args": (v3 /*: any*/),
                    "concreteType": "User",
                    "kind": "LinkedField",
                    "name": "user",
                    "plural": false,
                    "selections": [
                        (v4 /*: any*/),
                        {
                            "args": null,
                            "kind": "FragmentSpread",
                            "name": "Routes_user"
                        }
                    ],
                    "storageKey": null
                },
                {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "AddInvestments_query"
                },
                {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "MyTransactions_query"
                },
                {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "MyInvestments_query"
                }
            ],
            "type": "Query",
            "abstractKey": null
        },
        "kind": "Request",
        "operation": {
            "argumentDefinitions": [
                (v1 /*: any*/),
                (v2 /*: any*/),
                (v0 /*: any*/)
            ],
            "kind": "Operation",
            "name": "AppQuery",
            "selections": [
                {
                    "alias": null,
                    "args": (v6 /*: any*/),
                    "concreteType": "LoanConnection",
                    "kind": "LinkedField",
                    "name": "loans",
                    "plural": false,
                    "selections": [
                        {
                            "alias": null,
                            "args": null,
                            "concreteType": "LoanEdge",
                            "kind": "LinkedField",
                            "name": "edges",
                            "plural": true,
                            "selections": [
                                {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Loan",
                                    "kind": "LinkedField",
                                    "name": "node",
                                    "plural": false,
                                    "selections": [
                                        (v7 /*: any*/),
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
                                        (v8 /*: any*/),
                                        (v9 /*: any*/)
                                    ],
                                    "storageKey": null
                                },
                                (v10 /*: any*/)
                            ],
                            "storageKey": null
                        },
                        (v11 /*: any*/)
                    ],
                    "storageKey": null
                },
                {
                    "alias": null,
                    "args": (v6 /*: any*/),
                    "filters": [
                        "status",
                        "borrower_id"
                    ],
                    "handle": "connection",
                    "key": "AddInvestments_query_loans",
                    "kind": "LinkedHandle",
                    "name": "loans"
                },
                {
                    "alias": null,
                    "args": (v12 /*: any*/),
                    "concreteType": "BucketTransactionConnection",
                    "kind": "LinkedField",
                    "name": "transactions",
                    "plural": false,
                    "selections": [
                        {
                            "alias": null,
                            "args": null,
                            "concreteType": "BucketTransactionEdge",
                            "kind": "LinkedField",
                            "name": "edges",
                            "plural": true,
                            "selections": [
                                {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "BucketTransaction",
                                    "kind": "LinkedField",
                                    "name": "node",
                                    "plural": false,
                                    "selections": [
                                        (v7 /*: any*/),
                                        {
                                            "alias": null,
                                            "args": null,
                                            "kind": "ScalarField",
                                            "name": "count",
                                            "storageKey": null
                                        },
                                        {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "Transaction",
                                            "kind": "LinkedField",
                                            "name": "history",
                                            "plural": true,
                                            "selections": [
                                                (v7 /*: any*/),
                                                (v13 /*: any*/),
                                                (v14 /*: any*/),
                                                {
                                                    "alias": null,
                                                    "args": null,
                                                    "kind": "ScalarField",
                                                    "name": "type",
                                                    "storageKey": null
                                                },
                                                (v15 /*: any*/),
                                                (v16 /*: any*/)
                                            ],
                                            "storageKey": null
                                        },
                                        (v9 /*: any*/)
                                    ],
                                    "storageKey": null
                                },
                                (v10 /*: any*/)
                            ],
                            "storageKey": null
                        },
                        (v11 /*: any*/)
                    ],
                    "storageKey": null
                },
                {
                    "alias": null,
                    "args": (v12 /*: any*/),
                    "filters": (v17 /*: any*/),
                    "handle": "connection",
                    "key": "MyTransactions_query_transactions",
                    "kind": "LinkedHandle",
                    "name": "transactions"
                },
                {
                    "alias": null,
                    "args": (v12 /*: any*/),
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
                                        (v7 /*: any*/),
                                        (v13 /*: any*/),
                                        (v14 /*: any*/),
                                        (v15 /*: any*/),
                                        (v16 /*: any*/),
                                        {
                                            "alias": null,
                                            "args": null,
                                            "kind": "ScalarField",
                                            "name": "updated",
                                            "storageKey": null
                                        },
                                        (v8 /*: any*/),
                                        (v9 /*: any*/)
                                    ],
                                    "storageKey": null
                                },
                                (v10 /*: any*/)
                            ],
                            "storageKey": null
                        },
                        (v11 /*: any*/)
                    ],
                    "storageKey": null
                },
                {
                    "alias": null,
                    "args": (v12 /*: any*/),
                    "filters": (v17 /*: any*/),
                    "handle": "connection",
                    "key": "MyInvestments_query_investments",
                    "kind": "LinkedHandle",
                    "name": "investments"
                },
                {
                    "alias": null,
                    "args": (v3 /*: any*/),
                    "concreteType": "User",
                    "kind": "LinkedField",
                    "name": "user",
                    "plural": false,
                    "selections": [
                        (v7 /*: any*/),
                        {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "name",
                            "storageKey": null
                        },
                        {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "apellidoPaterno",
                            "storageKey": null
                        },
                        {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "apellidoMaterno",
                            "storageKey": null
                        },
                        {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "accountTotal",
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
                            "kind": "ScalarField",
                            "name": "RFC",
                            "storageKey": null
                        },
                        {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "CURP",
                            "storageKey": null
                        },
                        {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "clabe",
                            "storageKey": null
                        },
                        {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "mobile",
                            "storageKey": null
                        },
                        (v4 /*: any*/)
                    ],
                    "storageKey": null
                }
            ]
        },
        "params": {
            "cacheID": "ec27452047d0fbed904dfde9d2b8e182",
            "id": null,
            "metadata": {},
            "name": "AppQuery",
            "operationKind": "query",
            "text": "query AppQuery(\n  $id: String!\n  $status: [LoanStatus!]\n  $borrower_id: String\n) {\n  ...AddInvestments_query\n  ...MyTransactions_query\n  ...MyInvestments_query\n  user(id: $id) {\n    ...Routes_user\n    error\n    id\n  }\n}\n\nfragment AddFunds_user on User {\n  id\n}\n\nfragment AddInvestments_query on Query {\n  loans(first: 5, after: \"\", status: $status, borrower_id: $borrower_id) {\n    edges {\n      node {\n        id\n        _id_user\n        score\n        ROI\n        goal\n        term\n        raised\n        expiry\n        status\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment AddLoan_user on User {\n  id\n}\n\nfragment MyInvestments_query on Query {\n  investments(first: 2, after: \"\", user_id: $id) {\n    edges {\n      node {\n        id\n        _id_borrower\n        _id_loan\n        quantity\n        created\n        updated\n        status\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment MyTransactions_query on Query {\n  transactions(first: 2, after: \"\", user_id: $id) {\n    edges {\n      node {\n        id\n        count\n        history {\n          id\n          _id_borrower\n          _id_loan\n          type\n          quantity\n          created\n        }\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment Profile_user on User {\n  id\n  name\n  apellidoPaterno\n  apellidoMaterno\n  RFC\n  CURP\n  clabe\n  mobile\n  accountTotal\n  accountAvailable\n}\n\nfragment RetireFunds_user on User {\n  id\n}\n\nfragment Routes_user on User {\n  id\n  name\n  apellidoPaterno\n  apellidoMaterno\n  accountTotal\n  accountAvailable\n  ...Profile_user\n  ...AddFunds_user\n  ...RetireFunds_user\n  ...AddLoan_user\n}\n"
        }
    } as any;
})();
(node as any).hash = '3a3699126bbd8dd536d52f72cce211ae';
export default node;
