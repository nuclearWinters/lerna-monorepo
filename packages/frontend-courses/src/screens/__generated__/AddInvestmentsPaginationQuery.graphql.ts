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
export type AddInvestmentsPaginationQueryVariables = {
  borrower_id?: string | null;
  count?: number | null;
  cursor?: string | null;
  id: string;
  status: Array<LoanStatus>;
};
export type AddInvestmentsPaginationQueryResponse = {
  readonly " $fragmentRefs": FragmentRefs<"AddInvestments_query">;
};
export type AddInvestmentsPaginationQuery = {
  readonly response: AddInvestmentsPaginationQueryResponse;
  readonly variables: AddInvestmentsPaginationQueryVariables;
};

/*
query AddInvestmentsPaginationQuery(
  $borrower_id: String
  $count: Int = 5
  $cursor: String = ""
  $id: String!
  $status: [LoanStatus!]!
) {
  ...AddInvestments_query_1G22uz
}

fragment AddInvestments_query_1G22uz on Query {
  loans(first: $count, after: $cursor, borrower_id: $borrower_id, status: $status) {
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
        defaultValue: null,
        kind: "LocalArgument",
        name: "borrower_id",
      } as any,
      {
        defaultValue: 5,
        kind: "LocalArgument",
        name: "count",
      } as any,
      {
        defaultValue: "",
        kind: "LocalArgument",
        name: "cursor",
      } as any,
      {
        defaultValue: null,
        kind: "LocalArgument",
        name: "id",
      } as any,
      {
        defaultValue: null,
        kind: "LocalArgument",
        name: "status",
      } as any,
    ],
    v1 = [
      {
        kind: "Variable",
        name: "after",
        variableName: "cursor",
      } as any,
      {
        kind: "Variable",
        name: "borrower_id",
        variableName: "borrower_id",
      } as any,
      {
        kind: "Variable",
        name: "first",
        variableName: "count",
      } as any,
      {
        kind: "Variable",
        name: "status",
        variableName: "status",
      } as any,
    ],
    v2 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "id",
      storageKey: null,
    } as any,
    v3 = [
      {
        kind: "Variable",
        name: "id",
        variableName: "id",
      } as any,
    ];
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Fragment",
      metadata: null,
      name: "AddInvestmentsPaginationQuery",
      selections: [
        {
          args: [
            {
              kind: "Variable",
              name: "count",
              variableName: "count",
            },
            {
              kind: "Variable",
              name: "cursor",
              variableName: "cursor",
            },
          ],
          kind: "FragmentSpread",
          name: "AddInvestments_query",
        },
      ],
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "AddInvestmentsPaginationQuery",
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
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
                    v2 /*: any*/,
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
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "status",
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "__typename",
                      storageKey: null,
                    },
                  ],
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  kind: "ScalarField",
                  name: "cursor",
                  storageKey: null,
                },
              ],
              storageKey: null,
            },
            {
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
            },
          ],
          storageKey: null,
        },
        {
          alias: null,
          args: v1 /*: any*/,
          filters: ["borrower_id", "status"],
          handle: "connection",
          key: "AddInvestments_query_loans",
          kind: "LinkedHandle",
          name: "loans",
        },
        {
          alias: null,
          args: v3 /*: any*/,
          concreteType: "User",
          kind: "LinkedField",
          name: "user",
          plural: false,
          selections: [v2 /*: any*/],
          storageKey: null,
        },
        {
          alias: null,
          args: v3 /*: any*/,
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
            v2 /*: any*/,
          ],
          storageKey: null,
        },
      ],
    },
    params: {
      cacheID: "1d6bd0b25eead08cfc0528185cf81507",
      id: null,
      metadata: {},
      name: "AddInvestmentsPaginationQuery",
      operationKind: "query",
      text: 'query AddInvestmentsPaginationQuery(\n  $borrower_id: String\n  $count: Int = 5\n  $cursor: String = ""\n  $id: String!\n  $status: [LoanStatus!]!\n) {\n  ...AddInvestments_query_1G22uz\n}\n\nfragment AddInvestments_query_1G22uz on Query {\n  loans(first: $count, after: $cursor, borrower_id: $borrower_id, status: $status) {\n    edges {\n      node {\n        id\n        ...LoanRow_loan\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n  user(id: $id) {\n    id\n  }\n  authUser(id: $id) {\n    isLender\n    isSupport\n    id\n  }\n}\n\nfragment LoanRow_loan on Loan {\n  id\n  _id_user\n  score\n  ROI\n  goal\n  term\n  raised\n  expiry\n  status\n}\n',
    },
  } as any;
})();
(node as any).hash = "ea4ef89190b30ac0dcd8acb3554f3258";
export default node;
