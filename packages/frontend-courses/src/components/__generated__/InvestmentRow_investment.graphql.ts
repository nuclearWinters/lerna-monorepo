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
export type InvestmentRow_investment = {
  readonly id: string;
  readonly _id_borrower: string;
  readonly _id_loan: string;
  readonly quantity: number;
  readonly created: number;
  readonly updated: number;
  readonly status: InvestmentStatus;
  readonly payments: number;
  readonly ROI: number;
  readonly term: number;
  readonly moratory: string;
  readonly " $refType": "InvestmentRow_investment";
};
export type InvestmentRow_investment$data = InvestmentRow_investment;
export type InvestmentRow_investment$key = {
  readonly " $data"?: InvestmentRow_investment$data;
  readonly " $fragmentRefs": FragmentRefs<"InvestmentRow_investment">;
};

const node: ReaderFragment = {
  argumentDefinitions: [],
  kind: "Fragment",
  metadata: {
    refetch: {
      connection: null,
      fragmentPathInResult: ["node"],
      operation: require("./InvestmentRowRefetchQuery.graphql.ts"),
      identifierField: "id",
    },
  },
  name: "InvestmentRow_investment",
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
      name: "payments",
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
      name: "term",
      storageKey: null,
    },
    {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "moratory",
      storageKey: null,
    },
  ],
  type: "Investment",
  abstractKey: null,
} as any;
(node as any).hash = "3e1cac86e549c2f4e368fcae142c5584";
export default node;
