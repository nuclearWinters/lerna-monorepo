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
  user(id: $id, refreshToken: $refreshToken) {
    ...Routes_user
    error
    id
  }
}

fragment DebtInSale_user on User {
  id
  loans(first: 5, after: "") {
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

fragment GeneralData_user on User {
  id
  name
  apellidoPaterno
  apellidoMaterno
  RFC
  CURP
  clabe
  mobile
  email
  accountTotal
  accountAvailable
}

fragment Routes_user on User {
  id
  name
  apellidoPaterno
  apellidoMaterno
  accountTotal
  accountAvailable
  ...GeneralData_user
  ...DebtInSale_user
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
    v1 = [
      {
        kind: "Variable",
        name: "id",
        variableName: "id",
      } as any,
      {
        kind: "Variable",
        name: "refreshToken",
        variableName: "refreshToken",
      } as any,
    ],
    v2 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "error",
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
        kind: "Literal",
        name: "after",
        value: "",
      } as any,
      {
        kind: "Literal",
        name: "first",
        value: 5,
      } as any,
    ];
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Fragment",
      metadata: null,
      name: "AppQuery",
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: "User",
          kind: "LinkedField",
          name: "user",
          plural: false,
          selections: [
            v2 /*: any*/,
            {
              args: null,
              kind: "FragmentSpread",
              name: "Routes_user",
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
      name: "AppQuery",
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: "User",
          kind: "LinkedField",
          name: "user",
          plural: false,
          selections: [
            v3 /*: any*/,
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
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "email",
              storageKey: null,
            },
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
              storageKey: 'loans(after:"",first:5)',
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
            v2 /*: any*/,
          ],
          storageKey: null,
        },
      ],
    },
    params: {
      cacheID: "ef8611f00517135346f8563a05b1dc63",
      id: null,
      metadata: {},
      name: "AppQuery",
      operationKind: "query",
      text:
        'query AppQuery(\n  $id: String!\n  $refreshToken: String!\n) {\n  user(id: $id, refreshToken: $refreshToken) {\n    ...Routes_user\n    error\n    id\n  }\n}\n\nfragment DebtInSale_user on User {\n  id\n  loans(first: 5, after: "") {\n    edges {\n      node {\n        id\n        user_id\n        score\n        rate\n        total\n        term\n        need\n        ends\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment GeneralData_user on User {\n  id\n  name\n  apellidoPaterno\n  apellidoMaterno\n  RFC\n  CURP\n  clabe\n  mobile\n  email\n  accountTotal\n  accountAvailable\n}\n\nfragment Routes_user on User {\n  id\n  name\n  apellidoPaterno\n  apellidoMaterno\n  accountTotal\n  accountAvailable\n  ...GeneralData_user\n  ...DebtInSale_user\n}\n',
    },
  } as any;
})();
(node as any).hash = "14c65173d2767a2c561332de2ae28e8e";
export default node;
