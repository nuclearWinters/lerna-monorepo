/**
 * @generated SignedSource<<198fcd7c7ae55656a24702e8951a4d13>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type LoanStatus = "PAID" | "TO_BE_PAID" | "FINANCING" | "WAITING_FOR_APPROVAL" | "PAST_DUE" | "%future added value";
export type AppQuery$variables = {
  id: string;
  status: ReadonlyArray<LoanStatus>;
  borrower_id?: string | null;
};
export type AppQueryVariables = AppQuery$variables;
export type AppQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"AddInvestments_query" | "MyTransactions_query" | "MyInvestments_query" | "Routes_query">;
};
export type AppQueryResponse = AppQuery$data;
export type AppQuery = {
  variables: AppQueryVariables;
  response: AppQuery$data;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "borrower_id"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "status"
},
v3 = {
  "kind": "Literal",
  "name": "after",
  "value": ""
},
v4 = [
  (v3/*: any*/),
  {
    "kind": "Variable",
    "name": "borrower_id",
    "variableName": "borrower_id"
  },
  {
    "kind": "Literal",
    "name": "first",
    "value": 5
  },
  {
    "kind": "Variable",
    "name": "status",
    "variableName": "status"
  }
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ROI",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "term",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v11 = {
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
},
v12 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "_id_loan",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "quantity",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "payments",
  "storageKey": null
},
v16 = {
  "kind": "Literal",
  "name": "first",
  "value": 2
},
v17 = {
  "kind": "Variable",
  "name": "user_id",
  "variableName": "id"
},
v18 = [
  (v3/*: any*/),
  (v16/*: any*/),
  (v17/*: any*/)
],
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "_id_borrower",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "created",
  "storageKey": null
},
v21 = [
  (v3/*: any*/),
  (v16/*: any*/),
  {
    "kind": "Literal",
    "name": "status",
    "value": [
      "DELAY_PAYMENT",
      "UP_TO_DATE",
      "FINANCING"
    ]
  },
  (v17/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "AppQuery",
    "selections": [
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
      },
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "Routes_query"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "AppQuery",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
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
                  (v5/*: any*/),
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
                  (v6/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "goal",
                    "storageKey": null
                  },
                  (v7/*: any*/),
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
                  (v8/*: any*/),
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
                      (v8/*: any*/),
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
                  (v9/*: any*/)
                ],
                "storageKey": null
              },
              (v10/*: any*/)
            ],
            "storageKey": null
          },
          (v11/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v4/*: any*/),
        "filters": [
          "borrower_id",
          "status"
        ],
        "handle": "connection",
        "key": "AddInvestments_query_loans",
        "kind": "LinkedHandle",
        "name": "loans"
      },
      {
        "alias": null,
        "args": (v12/*: any*/),
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": [
          (v5/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "InvestmentsUser",
            "kind": "LinkedField",
            "name": "investments",
            "plural": true,
            "selections": [
              (v13/*: any*/),
              (v14/*: any*/),
              (v7/*: any*/),
              (v6/*: any*/),
              (v15/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "accountAvailable",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v12/*: any*/),
        "concreteType": "AuthUser",
        "kind": "LinkedField",
        "name": "authUser",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isLender",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isSupport",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isBorrower",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "language",
            "storageKey": null
          },
          (v5/*: any*/),
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
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "email",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v18/*: any*/),
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
                  (v5/*: any*/),
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
                      (v5/*: any*/),
                      (v19/*: any*/),
                      (v13/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "type",
                        "storageKey": null
                      },
                      (v14/*: any*/),
                      (v20/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v9/*: any*/)
                ],
                "storageKey": null
              },
              (v10/*: any*/)
            ],
            "storageKey": null
          },
          (v11/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v18/*: any*/),
        "filters": [
          "user_id"
        ],
        "handle": "connection",
        "key": "MyTransactions_query_transactions",
        "kind": "LinkedHandle",
        "name": "transactions"
      },
      {
        "alias": null,
        "args": (v21/*: any*/),
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
                  (v5/*: any*/),
                  (v19/*: any*/),
                  (v13/*: any*/),
                  (v14/*: any*/),
                  (v20/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "updated",
                    "storageKey": null
                  },
                  (v8/*: any*/),
                  (v15/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "moratory",
                    "storageKey": null
                  },
                  (v9/*: any*/)
                ],
                "storageKey": null
              },
              (v10/*: any*/)
            ],
            "storageKey": null
          },
          (v11/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v21/*: any*/),
        "filters": [
          "user_id",
          "status"
        ],
        "handle": "connection",
        "key": "MyInvestments_query_investments",
        "kind": "LinkedHandle",
        "name": "investments"
      }
    ]
  },
  "params": {
    "cacheID": "eeff07cea483b7d324e998f635d7b4e6",
    "id": null,
    "metadata": {},
    "name": "AppQuery",
    "operationKind": "query",
    "text": "query AppQuery(\n  $id: String!\n  $status: [LoanStatus!]!\n  $borrower_id: String\n) {\n  ...AddInvestments_query\n  ...MyTransactions_query\n  ...MyInvestments_query\n  ...Routes_query\n}\n\nfragment Account_user on User {\n  investments {\n    _id_loan\n    quantity\n    term\n    ROI\n    payments\n  }\n  accountAvailable\n}\n\nfragment AddFunds_user on User {\n  id\n}\n\nfragment AddInvestments_query on Query {\n  loans(first: 5, after: \"\", borrower_id: $borrower_id, status: $status) {\n    edges {\n      node {\n        id\n        ...LoanRow_loan\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n  user(id: $id) {\n    id\n  }\n  authUser(id: $id) {\n    isLender\n    isSupport\n    isBorrower\n    language\n    id\n  }\n}\n\nfragment AddLoan_user on User {\n  id\n}\n\nfragment CheckExpiration_auth_user on AuthUser {\n  isBorrower\n  isSupport\n}\n\nfragment InvestmentRow_investment on Investment {\n  id\n  _id_borrower\n  _id_loan\n  quantity\n  created\n  updated\n  status\n  payments\n  ROI\n  term\n  moratory\n}\n\nfragment LoanRow_loan on Loan {\n  id\n  _id_user\n  score\n  ROI\n  goal\n  term\n  raised\n  expiry\n  status\n  scheduledPayments {\n    amortize\n    status\n    scheduledDate\n  }\n}\n\nfragment MyInvestments_query on Query {\n  investments(first: 2, after: \"\", user_id: $id, status: [DELAY_PAYMENT, UP_TO_DATE, FINANCING]) {\n    edges {\n      node {\n        id\n        ...InvestmentRow_investment\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment MyTransactions_query on Query {\n  transactions(first: 2, after: \"\", user_id: $id) {\n    edges {\n      node {\n        id\n        count\n        history {\n          id\n          _id_borrower\n          _id_loan\n          type\n          quantity\n          created\n        }\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n  authUser(id: $id) {\n    language\n    id\n  }\n}\n\nfragment RetireFunds_user on User {\n  id\n}\n\nfragment Routes_query on Query {\n  user(id: $id) {\n    id\n    investments {\n      _id_loan\n      quantity\n      term\n      ROI\n      payments\n    }\n    accountAvailable\n    ...AddFunds_user\n    ...RetireFunds_user\n    ...AddLoan_user\n    ...Account_user\n  }\n  authUser(id: $id) {\n    id\n    name\n    apellidoPaterno\n    apellidoMaterno\n    language\n    isBorrower\n    isSupport\n    ...Settings_auth_user\n    ...CheckExpiration_auth_user\n  }\n}\n\nfragment Settings_auth_user on AuthUser {\n  id\n  name\n  apellidoPaterno\n  apellidoMaterno\n  RFC\n  CURP\n  clabe\n  mobile\n  email\n  language\n}\n"
  }
};
})();

(node as any).hash = "bd362e37fc24d5857009888ee7e3824c";

export default node;
