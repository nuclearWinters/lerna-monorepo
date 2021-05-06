/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type GeneralData_user = {
  readonly id: string;
  readonly name: string;
  readonly apellidoPaterno: string;
  readonly apellidoMaterno: string;
  readonly RFC: string;
  readonly CURP: string;
  readonly clabe: string;
  readonly mobile: string;
  readonly email: string;
  readonly accountTotal: number;
  readonly accountAvailable: number;
  readonly " $refType": "GeneralData_user";
};
export type GeneralData_user$data = GeneralData_user;
export type GeneralData_user$key = {
  readonly " $data"?: GeneralData_user$data;
  readonly " $fragmentRefs": FragmentRefs<"GeneralData_user">;
};

const node: ReaderFragment = {
  argumentDefinitions: [],
  kind: "Fragment",
  metadata: null,
  name: "GeneralData_user",
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
      kind: "ScalarField",
      name: "email",
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
  ],
  type: "User",
  abstractKey: null,
} as any;
(node as any).hash = "9cfed411a4b2117e632a48ca0b24bce9";
export default node;
