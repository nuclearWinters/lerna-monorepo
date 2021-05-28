/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyTransactionsPaginationQueryVariables = {
  count?: number | null;
  cursor?: string | null;
  id: string;
};
export type MyTransactionsPaginationQueryResponse = {
  readonly " $fragmentRefs": FragmentRefs<"MyTransactions_query">;
};
export type MyTransactionsPaginationQuery = {
  readonly response: MyTransactionsPaginationQueryResponse;
  readonly variables: MyTransactionsPaginationQueryVariables;
};

/*
query MyTransactionsPaginationQuery(
  $count: Int = 2
  $cursor: String = ""
  $id: String!
) {
  ...MyTransactions_query_1G22uz
}

fragment MyTransactions_query_1G22uz on Query {
  transactions(first: $count, after: $cursor, user_id: $id) {
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
        name: "user_id",
        variableName: "id",
      } as any,
    ],
    v2 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "id",
      storageKey: null,
    } as any;
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Fragment",
      metadata: null,
      name: "MyTransactionsPaginationQuery",
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
          name: "MyTransactions_query",
        },
      ],
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "MyTransactionsPaginationQuery",
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
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
                    v2 /*: any*/,
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
                        v2 /*: any*/,
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
                          name: "type",
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
                      ],
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
          filters: ["user_id"],
          handle: "connection",
          key: "MyTransactions_query_transactions",
          kind: "LinkedHandle",
          name: "transactions",
        },
      ],
    },
    params: {
      cacheID: "b877d0dec97f3a37ed9f1c33d9a98759",
      id: null,
      metadata: {},
      name: "MyTransactionsPaginationQuery",
      operationKind: "query",
      text: 'query MyTransactionsPaginationQuery(\n  $count: Int = 2\n  $cursor: String = ""\n  $id: String!\n) {\n  ...MyTransactions_query_1G22uz\n}\n\nfragment MyTransactions_query_1G22uz on Query {\n  transactions(first: $count, after: $cursor, user_id: $id) {\n    edges {\n      node {\n        id\n        count\n        history {\n          id\n          _id_borrower\n          _id_loan\n          type\n          quantity\n          created\n        }\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n',
    },
  } as any;
})();
(node as any).hash = "4176bb7778e068c8b609ce5a5b58fabb";
export default node;
