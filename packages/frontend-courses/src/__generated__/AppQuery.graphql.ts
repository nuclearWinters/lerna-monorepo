/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AppQueryVariables = {
  id: string;
  refreshToken: string;
};
export type AppQueryResponse = {
  readonly user: {
    readonly error: string;
    readonly " $fragmentRefs": FragmentRefs<"Routes_user">;
  };
  readonly " $fragmentRefs": FragmentRefs<
    "AddInvestments_query" | "MyTransactions_query" | "MyInvestments_query"
  >;
};
export type AppQuery = {
  readonly response: AppQueryResponse;
  readonly variables: AppQueryVariables;
};

/*
query AppQuery(
  $id: String!
  $refreshToken: String!
) {
  ...AddInvestments_query
  ...MyTransactions_query
  ...MyInvestments_query
  user(id: $id, refreshToken: $refreshToken) {
    ...Routes_user
    error
    id
  }
}

fragment AddFunds_user on User {
  id
}

fragment AddInvestments_query on Query {
  loans(first: 5, after: "") {
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
  investments(first: 2, after: "", refreshToken: $refreshToken, user_id: $id) {
    edges {
      node {
        id
        _id_borrower
        _id_loan
        quantity
        created
        updated
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
  transactions(first: 2, after: "", refreshToken: $refreshToken, user_id: $id) {
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
  var v0 = [
      {
        defaultValue: null,
        kind: "LocalArgument",
        name: "id",
      } as any,
      {
        defaultValue: null,
        kind: "LocalArgument",
        name: "refreshToken",
      } as any,
    ],
    v1 = {
      kind: "Variable",
      name: "refreshToken",
      variableName: "refreshToken",
    } as any,
    v2 = [
      {
        kind: "Variable",
        name: "id",
        variableName: "id",
      } as any,
      v1 /*: any*/,
    ],
    v3 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "error",
      storageKey: null,
    } as any,
    v4 = {
      kind: "Literal",
      name: "after",
      value: "",
    } as any,
    v5 = [
      v4 /*: any*/,
      {
        kind: "Literal",
        name: "first",
        value: 5,
      } as any,
    ],
    v6 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "id",
      storageKey: null,
    } as any,
    v7 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "__typename",
      storageKey: null,
    } as any,
    v8 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "cursor",
      storageKey: null,
    } as any,
    v9 = {
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
    v10 = [
      v4 /*: any*/,
      {
        kind: "Literal",
        name: "first",
        value: 2,
      } as any,
      v1 /*: any*/,
      {
        kind: "Variable",
        name: "user_id",
        variableName: "id",
      } as any,
    ],
    v11 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "_id_borrower",
      storageKey: null,
    } as any,
    v12 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "_id_loan",
      storageKey: null,
    } as any,
    v13 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "quantity",
      storageKey: null,
    } as any,
    v14 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "created",
      storageKey: null,
    } as any,
    v15 = ["refreshToken", "user_id"];
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Fragment",
      metadata: null,
      name: "AppQuery",
      selections: [
        {
          alias: null,
          args: v2 /*: any*/,
          concreteType: "User",
          kind: "LinkedField",
          name: "user",
          plural: false,
          selections: [
            v3 /*: any*/,
            {
              args: null,
              kind: "FragmentSpread",
              name: "Routes_user",
            },
          ],
          storageKey: null,
        },
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
      ],
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "AppQuery",
      selections: [
        {
          alias: null,
          args: v5 /*: any*/,
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
                    v6 /*: any*/,
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
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "ROI",
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "goal",
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "term",
                      storageKey: null,
                    },
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
                    v7 /*: any*/,
                  ],
                  storageKey: null,
                },
                v8 /*: any*/,
              ],
              storageKey: null,
            },
            v9 /*: any*/,
          ],
          storageKey: 'loans(after:"",first:5)',
        },
        {
          alias: null,
          args: v5 /*: any*/,
          filters: null,
          handle: "connection",
          key: "AddInvestments_query_loans",
          kind: "LinkedHandle",
          name: "loans",
        },
        {
          alias: null,
          args: v10 /*: any*/,
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
                    v6 /*: any*/,
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
                        v6 /*: any*/,
                        v11 /*: any*/,
                        v12 /*: any*/,
                        {
                          alias: null,
                          args: null,
                          kind: "ScalarField",
                          name: "type",
                          storageKey: null,
                        },
                        v13 /*: any*/,
                        v14 /*: any*/,
                      ],
                      storageKey: null,
                    },
                    v7 /*: any*/,
                  ],
                  storageKey: null,
                },
                v8 /*: any*/,
              ],
              storageKey: null,
            },
            v9 /*: any*/,
          ],
          storageKey: null,
        },
        {
          alias: null,
          args: v10 /*: any*/,
          filters: v15 /*: any*/,
          handle: "connection",
          key: "MyTransactions_query_transactions",
          kind: "LinkedHandle",
          name: "transactions",
        },
        {
          alias: null,
          args: v10 /*: any*/,
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
                  concreteType: "Investments",
                  kind: "LinkedField",
                  name: "node",
                  plural: false,
                  selections: [
                    v6 /*: any*/,
                    v11 /*: any*/,
                    v12 /*: any*/,
                    v13 /*: any*/,
                    v14 /*: any*/,
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "updated",
                      storageKey: null,
                    },
                    v7 /*: any*/,
                  ],
                  storageKey: null,
                },
                v8 /*: any*/,
              ],
              storageKey: null,
            },
            v9 /*: any*/,
          ],
          storageKey: null,
        },
        {
          alias: null,
          args: v10 /*: any*/,
          filters: v15 /*: any*/,
          handle: "connection",
          key: "MyInvestments_query_investments",
          kind: "LinkedHandle",
          name: "investments",
        },
        {
          alias: null,
          args: v2 /*: any*/,
          concreteType: "User",
          kind: "LinkedField",
          name: "user",
          plural: false,
          selections: [
            v6 /*: any*/,
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
              name: "accountTotal",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "accountAvailable",
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
            v3 /*: any*/,
          ],
          storageKey: null,
        },
      ],
    },
    params: {
      cacheID: "f1d2d8e4ed179e7369bb7ecdcf04aa7a",
      id: null,
      metadata: {},
      name: "AppQuery",
      operationKind: "query",
      text:
        'query AppQuery(\n  $id: String!\n  $refreshToken: String!\n) {\n  ...AddInvestments_query\n  ...MyTransactions_query\n  ...MyInvestments_query\n  user(id: $id, refreshToken: $refreshToken) {\n    ...Routes_user\n    error\n    id\n  }\n}\n\nfragment AddFunds_user on User {\n  id\n}\n\nfragment AddInvestments_query on Query {\n  loans(first: 5, after: "") {\n    edges {\n      node {\n        id\n        _id_user\n        score\n        ROI\n        goal\n        term\n        raised\n        expiry\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment AddLoan_user on User {\n  id\n}\n\nfragment MyInvestments_query on Query {\n  investments(first: 2, after: "", refreshToken: $refreshToken, user_id: $id) {\n    edges {\n      node {\n        id\n        _id_borrower\n        _id_loan\n        quantity\n        created\n        updated\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment MyTransactions_query on Query {\n  transactions(first: 2, after: "", refreshToken: $refreshToken, user_id: $id) {\n    edges {\n      node {\n        id\n        count\n        history {\n          id\n          _id_borrower\n          _id_loan\n          type\n          quantity\n          created\n        }\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment Profile_user on User {\n  id\n  name\n  apellidoPaterno\n  apellidoMaterno\n  RFC\n  CURP\n  clabe\n  mobile\n  accountTotal\n  accountAvailable\n}\n\nfragment RetireFunds_user on User {\n  id\n}\n\nfragment Routes_user on User {\n  id\n  name\n  apellidoPaterno\n  apellidoMaterno\n  accountTotal\n  accountAvailable\n  ...Profile_user\n  ...AddFunds_user\n  ...RetireFunds_user\n  ...AddLoan_user\n}\n',
    },
  } as any;
})();
(node as any).hash = "9849c7df2405fcae9e466e1cae2c3f22";
export default node;
