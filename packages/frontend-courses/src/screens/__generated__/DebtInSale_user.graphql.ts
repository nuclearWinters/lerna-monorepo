/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type DebtInSale_user = {
  readonly id: string;
  readonly loans: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly user_id: string;
        readonly score: number;
        readonly rate: number;
        readonly total: number;
        readonly term: number;
        readonly need: number;
        readonly ends: number;
      } | null;
    } | null> | null;
  } | null;
  readonly " $refType": "DebtInSale_user";
};
export type DebtInSale_user$data = DebtInSale_user;
export type DebtInSale_user$key = {
  readonly " $data"?: DebtInSale_user$data;
  readonly " $fragmentRefs": FragmentRefs<"DebtInSale_user">;
};

const node: ReaderFragment = (function () {
  var v0 = ["loans"],
    v1 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "id",
      storageKey: null,
    } as any;
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
        fragmentPathInResult: ["node"],
        operation: require("./DebtInSalePaginationQuery.graphql.ts"),
        identifierField: "id",
      },
    },
    name: "DebtInSale_user",
    selections: [
      v1 /*: any*/,
      {
        alias: "loans",
        args: null,
        concreteType: "LoanConnection",
        kind: "LinkedField",
        name: "__DebtInSale_user_loans_connection",
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
        storageKey: null,
      },
    ],
    type: "User",
    abstractKey: null,
  } as any;
})();
(node as any).hash = "8cbb37ba075bcdbab7c9173fc9ea681a";
export default node;
