/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type DebtInSale_query = {
  readonly loans: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly _id_user: string;
        readonly score: number;
        readonly ROI: number;
        readonly goal: number;
        readonly term: number;
        readonly raised: number;
        readonly expiry: number;
      } | null;
    } | null> | null;
  } | null;
  readonly " $refType": "DebtInSale_query";
};
export type DebtInSale_query$data = DebtInSale_query;
export type DebtInSale_query$key = {
  readonly " $data"?: DebtInSale_query$data;
  readonly " $fragmentRefs": FragmentRefs<"DebtInSale_query">;
};

const node: ReaderFragment = (function () {
  var v0 = ["loans"];
  return {
    argumentDefinitions: [
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
        operation: require("./DebtInSalePaginationQuery.graphql.ts"),
      },
    },
    name: "DebtInSale_query",
    selections: [
      {
        alias: "loans",
        args: null,
        concreteType: "LoanConnection",
        kind: "LinkedField",
        name: "__DebtInSale_query_loans_connection",
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
(node as any).hash = "ad4abc2ed9fab37f6b124cf17f51751e";
export default node;
