/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type DebtInSalePaginationQueryVariables = {
  count?: number | null;
  cursor?: string | null;
  id: string;
};
export type DebtInSalePaginationQueryResponse = {
  readonly node: {
    readonly " $fragmentRefs": FragmentRefs<"DebtInSale_user">;
  } | null;
};
export type DebtInSalePaginationQuery = {
  readonly response: DebtInSalePaginationQueryResponse;
  readonly variables: DebtInSalePaginationQueryVariables;
};

/*
query DebtInSalePaginationQuery(
  $count: Int = 5
  $cursor: String = ""
  $id: ID!
) {
  node(id: $id) {
    __typename
    ...DebtInSale_user_1G22uz
    id
  }
}

fragment DebtInSale_user_1G22uz on User {
  id
  loans(first: $count, after: $cursor) {
    edges {
      node {
        id
        user_id
        score
        rate
        total
        term
        need
        ends
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
    ],
    v1 = [
      {
        kind: "Variable",
        name: "id",
        variableName: "id",
      } as any,
    ],
    v2 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "__typename",
      storageKey: null,
    } as any,
    v3 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "id",
      storageKey: null,
    } as any,
    v4 = [
      {
        kind: "Variable",
        name: "after",
        variableName: "cursor",
      } as any,
      {
        kind: "Variable",
        name: "first",
        variableName: "count",
      } as any,
    ];
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Fragment",
      metadata: null,
      name: "DebtInSalePaginationQuery",
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: null,
          kind: "LinkedField",
          name: "node",
          plural: false,
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
              name: "DebtInSale_user",
            },
          ],
          storageKey: null,
        },
      ],
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "DebtInSalePaginationQuery",
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: null,
          kind: "LinkedField",
          name: "node",
          plural: false,
          selections: [
            v2 /*: any*/,
            v3 /*: any*/,
            {
              kind: "InlineFragment",
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
                            v3 /*: any*/,
                            {
                              alias: null,
                              args: null,
                              kind: "ScalarField",
                              name: "user_id",
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
                              name: "rate",
                              storageKey: null,
                            },
                            {
                              alias: null,
                              args: null,
                              kind: "ScalarField",
                              name: "total",
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
                              name: "need",
                              storageKey: null,
                            },
                            {
                              alias: null,
                              args: null,
                              kind: "ScalarField",
                              name: "ends",
                              storageKey: null,
                            },
                            v2 /*: any*/,
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
                  args: v4 /*: any*/,
                  filters: null,
                  handle: "connection",
                  key: "DebtInSale_user_loans",
                  kind: "LinkedHandle",
                  name: "loans",
                },
              ],
              type: "User",
              abstractKey: null,
            },
          ],
          storageKey: null,
        },
      ],
    },
    params: {
      cacheID: "0a0882c3be47289c5792b3a1d2c692e9",
      id: null,
      metadata: {},
      name: "DebtInSalePaginationQuery",
      operationKind: "query",
      text:
        'query DebtInSalePaginationQuery(\n  $count: Int = 5\n  $cursor: String = ""\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ...DebtInSale_user_1G22uz\n    id\n  }\n}\n\nfragment DebtInSale_user_1G22uz on User {\n  id\n  loans(first: $count, after: $cursor) {\n    edges {\n      node {\n        id\n        user_id\n        score\n        rate\n        total\n        term\n        need\n        ends\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n',
    },
  } as any;
})();
(node as any).hash = "8cbb37ba075bcdbab7c9173fc9ea681a";
export default node;
