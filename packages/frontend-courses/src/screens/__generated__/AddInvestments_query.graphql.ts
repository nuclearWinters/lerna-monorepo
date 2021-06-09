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
  readonly " $refType": "AddInvestments_query";
};
export type AddInvestments_query$data = AddInvestments_query;
export type AddInvestments_query$key = {
  readonly " $data"?: AddInvestments_query$data;
  readonly " $fragmentRefs": FragmentRefs<"AddInvestments_query">;
};

const node: ReaderFragment = (function () {
  var v0 = ["loans"];
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
    ],
    type: "Query",
    abstractKey: null,
  } as any;
})();
(node as any).hash = "3e716fcf57ffcbfe72f9c3de78869c5b";
export default node;
