/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Settings_user = {
  readonly id: string;
  readonly name: string;
  readonly apellidoPaterno: string;
  readonly apellidoMaterno: string;
  readonly RFC: string;
  readonly CURP: string;
  readonly clabe: string;
  readonly mobile: string;
  readonly investments: ReadonlyArray<{
    readonly _id_loan: string;
    readonly quantity: number;
    readonly term: number;
    readonly ROI: number;
    readonly payments: number;
  }>;
  readonly accountAvailable: string;
  readonly " $refType": "Settings_user";
};
export type Settings_user$data = Settings_user;
export type Settings_user$key = {
  readonly " $data"?: Settings_user$data;
  readonly " $fragmentRefs": FragmentRefs<"Settings_user">;
};

const node: ReaderFragment = {
  argumentDefinitions: [],
  kind: "Fragment",
  metadata: null,
  name: "Settings_user",
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
      concreteType: "InvestmentsUser",
      kind: "LinkedField",
      name: "investments",
      plural: true,
      selections: [
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
          name: "term",
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
          name: "payments",
          storageKey: null,
        },
      ],
      storageKey: null,
    },
    {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "accountAvailable",
      storageKey: null,
    },
  ],
  type: "User",
  abstractKey: null,
} as any;
(node as any).hash = "f54a3f6e6666900120ce5e10fa1e222e";
export default node;
