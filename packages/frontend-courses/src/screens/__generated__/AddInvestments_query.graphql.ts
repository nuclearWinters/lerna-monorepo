/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type LoanStatus =
  | "FINANCING"
  | "PAID"
  | "PAST_DUE"
  | "TO_BE_PAID"
  | "WAITING_FOR_APPROVAL"
  | "%future added value";
export type AddInvestments_query = {
  readonly loans: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly _id_user: string;
        readonly score: string;
        readonly ROI: number;
        readonly goal: string;
        readonly term: number;
        readonly raised: string;
        readonly expiry: number;
        readonly status: LoanStatus;
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
    ],
    type: "Query",
    abstractKey: null,
  } as any;
})();
(node as any).hash = "ee3507a93eece348b7083803a0838daf";
export default node;
