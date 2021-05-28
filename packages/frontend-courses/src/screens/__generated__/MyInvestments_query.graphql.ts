/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type InvestmentStatus =
  | "DELAY_PAYMENT"
  | "PAID"
  | "PAST_DUE"
  | "UP_TO_DATE"
  | "%future added value";
export type MyInvestments_query = {
  readonly investments: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly _id_borrower: string;
        readonly _id_loan: string;
        readonly quantity: number;
        readonly created: number;
        readonly updated: number;
        readonly status: InvestmentStatus;
      } | null;
    } | null> | null;
  } | null;
  readonly " $refType": "MyInvestments_query";
};
export type MyInvestments_query$data = MyInvestments_query;
export type MyInvestments_query$key = {
  readonly " $data"?: MyInvestments_query$data;
  readonly " $fragmentRefs": FragmentRefs<"MyInvestments_query">;
};

const node: ReaderFragment = (function () {
  var v0 = ["investments"];
  return {
    argumentDefinitions: [
      {
        defaultValue: 2,
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
        operation: require("./MyInvestmentsPaginationQuery.graphql.ts"),
      },
    },
    name: "MyInvestments_query",
    selections: [
      {
        alias: "investments",
        args: [
          {
            kind: "Variable",
            name: "user_id",
            variableName: "id",
          },
        ],
        concreteType: "InvestmentsConnection",
        kind: "LinkedField",
        name: "__MyInvestments_query_investments_connection",
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
                concreteType: "Investment",
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
(node as any).hash = "a25d13611b639299e8eb671e328250e8";
export default node;
