/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type InvestmentsPaginationQueryVariables = {
  count?: number | null;
  cursor?: string | null;
  id: string;
  refreshToken: string;
};
export type InvestmentsPaginationQueryResponse = {
  readonly " $fragmentRefs": FragmentRefs<"Investments_query">;
};
export type InvestmentsPaginationQuery = {
  readonly response: InvestmentsPaginationQueryResponse;
  readonly variables: InvestmentsPaginationQueryVariables;
};

/*
query InvestmentsPaginationQuery(
  $count: Int = 2
  $cursor: String = ""
  $id: String!
  $refreshToken: String!
) {
  ...Investments_query_1G22uz
}

fragment Investments_query_1G22uz on Query {
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
      name: "InvestmentsPaginationQuery",
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
          name: "Investments_query",
        },
      ],
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "InvestmentsPaginationQuery",
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
                  concreteType: "Investments",
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
          key: "Investments_query_investments",
          kind: "LinkedHandle",
          name: "investments",
        },
      ],
    },
    params: {
      cacheID: "d4f2bc9258298de0213954f54fb40cfa",
      id: null,
      metadata: {},
      name: "InvestmentsPaginationQuery",
      operationKind: "query",
      text:
        'query InvestmentsPaginationQuery(\n  $count: Int = 2\n  $cursor: String = ""\n  $id: String!\n  $refreshToken: String!\n) {\n  ...Investments_query_1G22uz\n}\n\nfragment Investments_query_1G22uz on Query {\n  investments(first: $count, after: $cursor, refreshToken: $refreshToken, user_id: $id) {\n    edges {\n      node {\n        id\n        _id_borrower\n        _id_loan\n        quantity\n        created\n        updated\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n',
    },
  } as any;
})();
(node as any).hash = "8f78f7c1a8e68ce18fec8f71db2df062";
export default node;
