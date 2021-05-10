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
  readonly " $fragmentRefs": FragmentRefs<"DebtInSale_query">;
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
  ...DebtInSale_query
  user(id: $id, refreshToken: $refreshToken) {
    ...Routes_user
    error
    id
  }
}

fragment AddFunds_user on User {
  id
}

fragment AddLoan_user on User {
  id
}

fragment DebtInSale_query on Query {
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

fragment GeneralData_user on User {
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
  ...GeneralData_user
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
    v3 = [
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
    ],
    v4 = {
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
        {
          args: null,
          kind: "FragmentSpread",
          name: "DebtInSale_query",
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
          args: v3 /*: any*/,
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
                    v4 /*: any*/,
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
          args: v3 /*: any*/,
          filters: null,
          handle: "connection",
          key: "DebtInSale_query_loans",
          kind: "LinkedHandle",
          name: "loans",
        },
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: "User",
          kind: "LinkedField",
          name: "user",
          plural: false,
          selections: [
            v4 /*: any*/,
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
            v2 /*: any*/,
          ],
          storageKey: null,
        },
      ],
    },
    params: {
      cacheID: "524f62566af3bcd2258144806d8bce83",
      id: null,
      metadata: {},
      name: "AppQuery",
      operationKind: "query",
      text:
        'query AppQuery(\n  $id: String!\n  $refreshToken: String!\n) {\n  ...DebtInSale_query\n  user(id: $id, refreshToken: $refreshToken) {\n    ...Routes_user\n    error\n    id\n  }\n}\n\nfragment AddFunds_user on User {\n  id\n}\n\nfragment AddLoan_user on User {\n  id\n}\n\nfragment DebtInSale_query on Query {\n  loans(first: 5, after: "") {\n    edges {\n      node {\n        id\n        _id_user\n        score\n        ROI\n        goal\n        term\n        raised\n        expiry\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment GeneralData_user on User {\n  id\n  name\n  apellidoPaterno\n  apellidoMaterno\n  RFC\n  CURP\n  clabe\n  mobile\n  accountTotal\n  accountAvailable\n}\n\nfragment RetireFunds_user on User {\n  id\n}\n\nfragment Routes_user on User {\n  id\n  name\n  apellidoPaterno\n  apellidoMaterno\n  accountTotal\n  accountAvailable\n  ...GeneralData_user\n  ...AddFunds_user\n  ...RetireFunds_user\n  ...AddLoan_user\n}\n',
    },
  } as any;
})();
(node as any).hash = "3cee04ec1bee49d0c473760125e4558d";
export default node;
