/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type LoanStatus =
  | "FINANCING"
  | "PAID"
  | "PAST_DUE"
  | "TO_BE_PAID"
  | "WAITING_FOR_APPROVAL"
  | "%future added value";
export type AppQueryVariables = {
  id: string;
  status: Array<LoanStatus>;
  borrower_id?: string | null;
};
export type AppQueryResponse = {
  readonly " $fragmentRefs": FragmentRefs<
    | "AddInvestments_query"
    | "MyTransactions_query"
    | "MyInvestments_query"
    | "Routes_query"
  >;
};
export type AppQuery = {
  readonly response: AppQueryResponse;
  readonly variables: AppQueryVariables;
};

/*
query AppQuery(
  $id: String!
  $status: [LoanStatus!]!
  $borrower_id: String
) {
  ...AddInvestments_query
  ...MyTransactions_query
  ...MyInvestments_query
  ...Routes_query
}

fragment Account_user on User {
  investments {
    _id_loan
    quantity
    term
    ROI
    payments
  }
  accountAvailable
}

fragment AddFunds_user on User {
  id
}

fragment AddInvestments_query on Query {
  loans(first: 5, after: "", borrower_id: $borrower_id, status: $status) {
    edges {
      node {
        id
        ...LoanRow_loan
        __typename
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
  user(id: $id) {
    id
  }
  authUser(id: $id) {
    isLender
    isSupport
    isBorrower
    language
    id
  }
}

fragment AddLoan_user on User {
  id
}

fragment CheckExpiration_auth_user on AuthUser {
  isBorrower
  isSupport
}

fragment InvestmentRow_investment on Investment {
  id
  _id_borrower
  _id_loan
  quantity
  created
  updated
  status
  payments
  ROI
  term
  moratory
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
  scheduledPayments {
    amortize
    status
    scheduledDate
  }
}

fragment MyInvestments_query on Query {
  investments(first: 2, after: "", user_id: $id, status: [DELAY_PAYMENT, UP_TO_DATE, FINANCING]) {
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
  authUser(id: $id) {
    language
    id
  }
}

fragment RetireFunds_user on User {
  id
}

fragment Routes_query on Query {
  user(id: $id) {
    id
    investments {
      _id_loan
      quantity
      term
      ROI
      payments
    }
    accountAvailable
    ...AddFunds_user
    ...RetireFunds_user
    ...AddLoan_user
    ...Account_user
  }
  authUser(id: $id) {
    id
    name
    apellidoPaterno
    apellidoMaterno
    language
    isBorrower
    isSupport
    ...Settings_auth_user
    ...CheckExpiration_auth_user
  }
}

fragment Settings_auth_user on AuthUser {
  id
  name
  apellidoPaterno
  apellidoMaterno
  RFC
  CURP
  clabe
  mobile
  email
  language
}
*/

const node: ConcreteRequest = (function () {
  var v0 = {
      defaultValue: null,
      kind: "LocalArgument",
      name: "borrower_id",
    } as any,
    v1 = {
      defaultValue: null,
      kind: "LocalArgument",
      name: "id",
    } as any,
    v2 = {
      defaultValue: null,
      kind: "LocalArgument",
      name: "status",
    } as any,
    v3 = {
      kind: "Literal",
      name: "after",
      value: "",
    } as any,
    v4 = [
      v3 /*: any*/,
      {
        kind: "Variable",
        name: "borrower_id",
        variableName: "borrower_id",
      } as any,
      {
        kind: "Literal",
        name: "first",
        value: 5,
      } as any,
      {
        kind: "Variable",
        name: "status",
        variableName: "status",
      } as any,
    ],
    v5 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "id",
      storageKey: null,
    } as any,
    v6 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "ROI",
      storageKey: null,
    } as any,
    v7 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "term",
      storageKey: null,
    } as any,
    v8 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "status",
      storageKey: null,
    } as any,
    v9 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "__typename",
      storageKey: null,
    } as any,
    v10 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "cursor",
      storageKey: null,
    } as any,
    v11 = {
      alias: null,
      args: null,
      concreteType: "PageInfo",
      kind: "LinkedField",
      name: "pageInfo",
      plural: false,
      selections: [
        {
          alias: null,
          args: null,
          kind: "ScalarField",
          name: "endCursor",
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          kind: "ScalarField",
          name: "hasNextPage",
          storageKey: null,
        },
      ],
      storageKey: null,
    } as any,
    v12 = [
      {
        kind: "Variable",
        name: "id",
        variableName: "id",
      } as any,
    ],
    v13 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "_id_loan",
      storageKey: null,
    } as any,
    v14 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "quantity",
      storageKey: null,
    } as any,
    v15 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "payments",
      storageKey: null,
    } as any,
    v16 = {
      kind: "Literal",
      name: "first",
      value: 2,
    } as any,
    v17 = {
      kind: "Variable",
      name: "user_id",
      variableName: "id",
    } as any,
    v18 = [v3 /*: any*/, v16 /*: any*/, v17 /*: any*/],
    v19 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "_id_borrower",
      storageKey: null,
    } as any,
    v20 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "created",
      storageKey: null,
    } as any,
    v21 = [
      v3 /*: any*/,
      v16 /*: any*/,
      {
        kind: "Literal",
        name: "status",
        value: ["DELAY_PAYMENT", "UP_TO_DATE", "FINANCING"],
      } as any,
      v17 /*: any*/,
    ];
  return {
    fragment: {
      argumentDefinitions: [v0 /*: any*/, v1 /*: any*/, v2 /*: any*/],
      kind: "Fragment",
      metadata: null,
      name: "AppQuery",
      selections: [
        {
          args: null,
          kind: "FragmentSpread",
          name: "AddInvestments_query",
        },
        {
          args: null,
          kind: "FragmentSpread",
          name: "MyTransactions_query",
        },
        {
          args: null,
          kind: "FragmentSpread",
          name: "MyInvestments_query",
        },
        {
          args: null,
          kind: "FragmentSpread",
          name: "Routes_query",
        },
      ],
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: [v1 /*: any*/, v2 /*: any*/, v0 /*: any*/],
      kind: "Operation",
      name: "AppQuery",
      selections: [
        {
          alias: null,
          args: v4 /*: any*/,
          concreteType: "LoanConnection",
          kind: "LinkedField",
          name: "loans",
          plural: false,
          selections: [
            {
              alias: null,
              args: null,
              concreteType: "LoanEdge",
              kind: "LinkedField",
              name: "edges",
              plural: true,
              selections: [
                {
                  alias: null,
                  args: null,
                  concreteType: "Loan",
                  kind: "LinkedField",
                  name: "node",
                  plural: false,
                  selections: [
                    v5 /*: any*/,
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "_id_user",
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "score",
                      storageKey: null,
                    },
                    v6 /*: any*/,
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "goal",
                      storageKey: null,
                    },
                    v7 /*: any*/,
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "raised",
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "expiry",
                      storageKey: null,
                    },
                    v8 /*: any*/,
                    {
                      alias: null,
                      args: null,
                      concreteType: "ScheduledPayments",
                      kind: "LinkedField",
                      name: "scheduledPayments",
                      plural: true,
                      selections: [
                        {
                          alias: null,
                          args: null,
                          kind: "ScalarField",
                          name: "amortize",
                          storageKey: null,
                        },
                        v8 /*: any*/,
                        {
                          alias: null,
                          args: null,
                          kind: "ScalarField",
                          name: "scheduledDate",
                          storageKey: null,
                        },
                      ],
                      storageKey: null,
                    },
                    v9 /*: any*/,
                  ],
                  storageKey: null,
                },
                v10 /*: any*/,
              ],
              storageKey: null,
            },
            v11 /*: any*/,
          ],
          storageKey: null,
        },
        {
          alias: null,
          args: v4 /*: any*/,
          filters: ["borrower_id", "status"],
          handle: "connection",
          key: "AddInvestments_query_loans",
          kind: "LinkedHandle",
          name: "loans",
        },
        {
          alias: null,
          args: v12 /*: any*/,
          concreteType: "User",
          kind: "LinkedField",
          name: "user",
          plural: false,
          selections: [
            v5 /*: any*/,
            {
              alias: null,
              args: null,
              concreteType: "InvestmentsUser",
              kind: "LinkedField",
              name: "investments",
              plural: true,
              selections: [
                v13 /*: any*/,
                v14 /*: any*/,
                v7 /*: any*/,
                v6 /*: any*/,
                v15 /*: any*/,
              ],
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "accountAvailable",
              storageKey: null,
            },
          ],
          storageKey: null,
        },
        {
          alias: null,
          args: v12 /*: any*/,
          concreteType: "AuthUser",
          kind: "LinkedField",
          name: "authUser",
          plural: false,
          selections: [
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "isLender",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "isSupport",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "isBorrower",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "language",
              storageKey: null,
            },
            v5 /*: any*/,
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "name",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "apellidoPaterno",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "apellidoMaterno",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "RFC",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "CURP",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "clabe",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "mobile",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "email",
              storageKey: null,
            },
          ],
          storageKey: null,
        },
        {
          alias: null,
          args: v18 /*: any*/,
          concreteType: "BucketTransactionConnection",
          kind: "LinkedField",
          name: "transactions",
          plural: false,
          selections: [
            {
              alias: null,
              args: null,
              concreteType: "BucketTransactionEdge",
              kind: "LinkedField",
              name: "edges",
              plural: true,
              selections: [
                {
                  alias: null,
                  args: null,
                  concreteType: "BucketTransaction",
                  kind: "LinkedField",
                  name: "node",
                  plural: false,
                  selections: [
                    v5 /*: any*/,
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "count",
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      concreteType: "Transaction",
                      kind: "LinkedField",
                      name: "history",
                      plural: true,
                      selections: [
                        v5 /*: any*/,
                        v19 /*: any*/,
                        v13 /*: any*/,
                        {
                          alias: null,
                          args: null,
                          kind: "ScalarField",
                          name: "type",
                          storageKey: null,
                        },
                        v14 /*: any*/,
                        v20 /*: any*/,
                      ],
                      storageKey: null,
                    },
                    v9 /*: any*/,
                  ],
                  storageKey: null,
                },
                v10 /*: any*/,
              ],
              storageKey: null,
            },
            v11 /*: any*/,
          ],
          storageKey: null,
        },
        {
          alias: null,
          args: v18 /*: any*/,
          filters: ["user_id"],
          handle: "connection",
          key: "MyTransactions_query_transactions",
          kind: "LinkedHandle",
          name: "transactions",
        },
        {
          alias: null,
          args: v21 /*: any*/,
          concreteType: "InvestmentsConnection",
          kind: "LinkedField",
          name: "investments",
          plural: false,
          selections: [
            {
              alias: null,
              args: null,
              concreteType: "InvestmentsEdge",
              kind: "LinkedField",
              name: "edges",
              plural: true,
              selections: [
                {
                  alias: null,
                  args: null,
                  concreteType: "Investment",
                  kind: "LinkedField",
                  name: "node",
                  plural: false,
                  selections: [
                    v5 /*: any*/,
                    v19 /*: any*/,
                    v13 /*: any*/,
                    v14 /*: any*/,
                    v20 /*: any*/,
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "updated",
                      storageKey: null,
                    },
                    v8 /*: any*/,
                    v15 /*: any*/,
                    v6 /*: any*/,
                    v7 /*: any*/,
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "moratory",
                      storageKey: null,
                    },
                    v9 /*: any*/,
                  ],
                  storageKey: null,
                },
                v10 /*: any*/,
              ],
              storageKey: null,
            },
            v11 /*: any*/,
          ],
          storageKey: null,
        },
        {
          alias: null,
          args: v21 /*: any*/,
          filters: ["user_id", "status"],
          handle: "connection",
          key: "MyInvestments_query_investments",
          kind: "LinkedHandle",
          name: "investments",
        },
      ],
    },
    params: {
      cacheID: "eeff07cea483b7d324e998f635d7b4e6",
      id: null,
      metadata: {},
      name: "AppQuery",
      operationKind: "query",
      text: 'query AppQuery(\n  $id: String!\n  $status: [LoanStatus!]!\n  $borrower_id: String\n) {\n  ...AddInvestments_query\n  ...MyTransactions_query\n  ...MyInvestments_query\n  ...Routes_query\n}\n\nfragment Account_user on User {\n  investments {\n    _id_loan\n    quantity\n    term\n    ROI\n    payments\n  }\n  accountAvailable\n}\n\nfragment AddFunds_user on User {\n  id\n}\n\nfragment AddInvestments_query on Query {\n  loans(first: 5, after: "", borrower_id: $borrower_id, status: $status) {\n    edges {\n      node {\n        id\n        ...LoanRow_loan\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n  user(id: $id) {\n    id\n  }\n  authUser(id: $id) {\n    isLender\n    isSupport\n    isBorrower\n    language\n    id\n  }\n}\n\nfragment AddLoan_user on User {\n  id\n}\n\nfragment CheckExpiration_auth_user on AuthUser {\n  isBorrower\n  isSupport\n}\n\nfragment InvestmentRow_investment on Investment {\n  id\n  _id_borrower\n  _id_loan\n  quantity\n  created\n  updated\n  status\n  payments\n  ROI\n  term\n  moratory\n}\n\nfragment LoanRow_loan on Loan {\n  id\n  _id_user\n  score\n  ROI\n  goal\n  term\n  raised\n  expiry\n  status\n  scheduledPayments {\n    amortize\n    status\n    scheduledDate\n  }\n}\n\nfragment MyInvestments_query on Query {\n  investments(first: 2, after: "", user_id: $id, status: [DELAY_PAYMENT, UP_TO_DATE, FINANCING]) {\n    edges {\n      node {\n        id\n        ...InvestmentRow_investment\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment MyTransactions_query on Query {\n  transactions(first: 2, after: "", user_id: $id) {\n    edges {\n      node {\n        id\n        count\n        history {\n          id\n          _id_borrower\n          _id_loan\n          type\n          quantity\n          created\n        }\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n  authUser(id: $id) {\n    language\n    id\n  }\n}\n\nfragment RetireFunds_user on User {\n  id\n}\n\nfragment Routes_query on Query {\n  user(id: $id) {\n    id\n    investments {\n      _id_loan\n      quantity\n      term\n      ROI\n      payments\n    }\n    accountAvailable\n    ...AddFunds_user\n    ...RetireFunds_user\n    ...AddLoan_user\n    ...Account_user\n  }\n  authUser(id: $id) {\n    id\n    name\n    apellidoPaterno\n    apellidoMaterno\n    language\n    isBorrower\n    isSupport\n    ...Settings_auth_user\n    ...CheckExpiration_auth_user\n  }\n}\n\nfragment Settings_auth_user on AuthUser {\n  id\n  name\n  apellidoPaterno\n  apellidoMaterno\n  RFC\n  CURP\n  clabe\n  mobile\n  email\n  language\n}\n',
    },
  } as any;
})();
(node as any).hash = "bd362e37fc24d5857009888ee7e3824c";
export default node;
