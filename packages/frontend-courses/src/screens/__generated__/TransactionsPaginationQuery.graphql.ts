/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type TransactionsPaginationQueryVariables = {
  count?: number | null;
  cursor?: string | null;
  id: string;
};
export type TransactionsPaginationQueryResponse = {
  readonly node: {
    readonly " $fragmentRefs": FragmentRefs<"Transactions_user">;
  } | null;
};
export type TransactionsPaginationQuery = {
  readonly response: TransactionsPaginationQueryResponse;
  readonly variables: TransactionsPaginationQueryVariables;
};

/*
query TransactionsPaginationQuery(
  $count: Int = 2
  $cursor: String = ""
  $id: ID!
) {
  node(id: $id) {
    __typename
    ...Transactions_user_1G22uz
    id
  }
}

fragment Transactions_user_1G22uz on User {
  id
  transactions(first: $count, after: $cursor) {
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
      name: "TransactionsPaginationQuery",
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
              name: "Transactions_user",
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
      name: "TransactionsPaginationQuery",
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
                            v3 /*: any*/,
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
                                v3 /*: any*/,
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
                  key: "Transactions_user_transactions",
                  kind: "LinkedHandle",
                  name: "transactions",
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
      cacheID: "d36ad58e9f7c25d892a3e51071195784",
      id: null,
      metadata: {},
      name: "TransactionsPaginationQuery",
      operationKind: "query",
      text:
        'query TransactionsPaginationQuery(\n  $count: Int = 2\n  $cursor: String = ""\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ...Transactions_user_1G22uz\n    id\n  }\n}\n\nfragment Transactions_user_1G22uz on User {\n  id\n  transactions(first: $count, after: $cursor) {\n    edges {\n      node {\n        id\n        count\n        history {\n          id\n          _id_borrower\n          _id_loan\n          type\n          quantity\n          created\n        }\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n',
    },
  } as any;
})();
(node as any).hash = "6810b7c8fe43a38aaf2b534c62b307d9";
export default node;
