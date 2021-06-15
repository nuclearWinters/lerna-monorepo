/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type LoanScheduledPaymentStatus =
  | "DELAYED"
  | "PAID"
  | "TO_BE_PAID"
  | "%future added value";
export type LoanStatus =
  | "FINANCING"
  | "PAID"
  | "PAST_DUE"
  | "TO_BE_PAID"
  | "WAITING_FOR_APPROVAL"
  | "%future added value";
export type LoanRow_loan = {
  readonly id: string;
  readonly _id_user: string;
  readonly score: string;
  readonly ROI: number;
  readonly goal: string;
  readonly term: number;
  readonly raised: string;
  readonly expiry: number;
  readonly status: LoanStatus;
  readonly scheduledPayments: ReadonlyArray<{
    readonly amortize: string;
    readonly status: LoanScheduledPaymentStatus;
    readonly scheduledDate: number;
  }> | null;
  readonly " $refType": "LoanRow_loan";
};
export type LoanRow_loan$data = LoanRow_loan;
export type LoanRow_loan$key = {
  readonly " $data"?: LoanRow_loan$data;
  readonly " $fragmentRefs": FragmentRefs<"LoanRow_loan">;
};

const node: ReaderFragment = (function () {
  var v0 = {
    alias: null,
    args: null,
    kind: "ScalarField",
    name: "status",
    storageKey: null,
  } as any;
  return {
    argumentDefinitions: [],
    kind: "Fragment",
    metadata: {
      refetch: {
        connection: null,
        fragmentPathInResult: ["node"],
        operation: require("./LoanRowRefetchQuery.graphql.ts"),
        identifierField: "id",
      },
    },
    name: "LoanRow_loan",
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
      v0 /*: any*/,
      {
        alias: null,
        args: null,
        concreteType: "ScheduledPayments",
        kind: "LinkedField",
        name: "scheduledPayments",
        plural: true,
        selections: [
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "amortize",
            storageKey: null,
          },
          v0 /*: any*/,
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "scheduledDate",
            storageKey: null,
          },
        ],
        storageKey: null,
      },
    ],
    type: "Loan",
    abstractKey: null,
  } as any;
})();
(node as any).hash = "02ecb10e18a8b0a5924d6890b3fd7400";
export default node;
