/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyInvestmentsPaginationQueryVariables = {
  count?: number | null;
  cursor?: string | null;
  id?: string | null;
  refreshToken?: string | null;
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
  $id: String
  $refreshToken: String
) {
  ...MyInvestments_query_1G22uz
}

fragment MyInvestments_query_1G22uz on Query {
  investments(first: $count, after: $cursor, refreshToken: $refreshToken, user_id: $id) {
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
*/

const node: ConcreteRequest = (function () {
  var v0 = [
      {
        defaultValue: 2,
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
        name: "refreshToken",
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
        name: "first",
        variableName: "count",
      } as any,
      {
        kind: "Variable",
        name: "refreshToken",
        variableName: "refreshToken",
      } as any,
      {
        kind: "Variable",
        name: "user_id",
        variableName: "id",
      } as any,
    ];
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Fragment",
      metadata: null,
      name: "MyInvestmentsPaginationQuery",
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
      name: "MyInvestmentsPaginationQuery",
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
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
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "id",
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "_id_borrower",
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "_id_loan",
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "quantity",
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "created",
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "updated",
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
          filters: ["refreshToken", "user_id"],
          handle: "connection",
          key: "MyInvestments_query_investments",
          kind: "LinkedHandle",
          name: "investments",
        },
      ],
    },
    params: {
      cacheID: "9e58e802914134bc3e6498a5b6e394e5",
      id: null,
      metadata: {},
      name: "MyInvestmentsPaginationQuery",
      operationKind: "query",
      text: 'query MyInvestmentsPaginationQuery(\n  $count: Int = 2\n  $cursor: String = ""\n  $id: String\n  $refreshToken: String\n) {\n  ...MyInvestments_query_1G22uz\n}\n\nfragment MyInvestments_query_1G22uz on Query {\n  investments(first: $count, after: $cursor, refreshToken: $refreshToken, user_id: $id) {\n    edges {\n      node {\n        id\n        _id_borrower\n        _id_loan\n        quantity\n        created\n        updated\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n',
    },
  } as any;
})();
(node as any).hash = "91b836d56ae4ca06a2dff2bb676e40b4";
export default node;
