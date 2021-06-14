/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AddInvestments_query = {
  readonly loans: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly " $fragmentRefs": FragmentRefs<"LoanRow_loan">;
      } | null;
    } | null> | null;
  } | null;
  readonly user: {
    readonly id: string;
  };
  readonly authUser: {
    readonly isLender: boolean;
    readonly isSupport: boolean;
  };
  readonly " $refType": "AddInvestments_query";
};
export type AddInvestments_query$data = AddInvestments_query;
export type AddInvestments_query$key = {
  readonly " $data"?: AddInvestments_query$data;
  readonly " $fragmentRefs": FragmentRefs<"AddInvestments_query">;
};

const node: ReaderFragment = (function () {
  var v0 = ["loans"],
    v1 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "id",
      storageKey: null,
    } as any,
    v2 = [
      {
        kind: "Variable",
        name: "id",
        variableName: "id",
      } as any,
    ];
  return {
    argumentDefinitions: [
      {
        kind: "RootArgument",
        name: "borrower_id",
      },
      {
        defaultValue: 5,
        kind: "LocalArgument",
        name: "count",
      },
      {
        defaultValue: "",
        kind: "LocalArgument",
        name: "cursor",
      },
      {
        kind: "RootArgument",
        name: "id",
      },
      {
        kind: "RootArgument",
        name: "status",
      },
    ],
    kind: "Fragment",
    metadata: {
      connection: [
        {
          count: "count",
          cursor: "cursor",
          direction: "forward",
          path: v0 /*: any*/,
        },
      ],
      refetch: {
        connection: {
          forward: {
            count: "count",
            cursor: "cursor",
          },
          backward: null,
          path: v0 /*: any*/,
        },
        fragmentPathInResult: [],
        operation: require("./AddInvestmentsPaginationQuery.graphql.ts"),
      },
    },
    name: "AddInvestments_query",
    selections: [
      {
        alias: "loans",
        args: [
          {
            kind: "Variable",
            name: "borrower_id",
            variableName: "borrower_id",
          },
          {
            kind: "Variable",
            name: "status",
            variableName: "status",
          },
        ],
        concreteType: "LoanConnection",
        kind: "LinkedField",
        name: "__AddInvestments_query_loans_connection",
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
                  v1 /*: any*/,
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "__typename",
                    storageKey: null,
                  },
                  {
                    args: null,
                    kind: "FragmentSpread",
                    name: "LoanRow_loan",
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
        args: v2 /*: any*/,
        concreteType: "User",
        kind: "LinkedField",
        name: "user",
        plural: false,
        selections: [v1 /*: any*/],
        storageKey: null,
      },
      {
        alias: null,
        args: v2 /*: any*/,
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
        ],
        storageKey: null,
      },
    ],
    type: "Query",
    abstractKey: null,
  } as any;
})();
(node as any).hash = "ea4ef89190b30ac0dcd8acb3554f3258";
export default node;
