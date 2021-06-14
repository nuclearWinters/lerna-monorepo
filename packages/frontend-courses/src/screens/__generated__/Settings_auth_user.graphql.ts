/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Languages = "DEFAULT" | "EN" | "ES" | "%future added value";
export type Settings_auth_user = {
  readonly id: string;
  readonly name: string;
  readonly apellidoPaterno: string;
  readonly apellidoMaterno: string;
  readonly RFC: string;
  readonly CURP: string;
  readonly clabe: string;
  readonly mobile: string;
  readonly email: string;
  readonly language: Languages;
  readonly " $refType": "Settings_auth_user";
};
export type Settings_auth_user$data = Settings_auth_user;
export type Settings_auth_user$key = {
  readonly " $data"?: Settings_auth_user$data;
  readonly " $fragmentRefs": FragmentRefs<"Settings_auth_user">;
};

const node: ReaderFragment = {
  argumentDefinitions: [],
  kind: "Fragment",
  metadata: null,
  name: "Settings_auth_user",
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
      name: "language",
      storageKey: null,
    },
  ],
  type: "AuthUser",
  abstractKey: null,
} as any;
(node as any).hash = "a0e578bdd0ff074ffce60619025a42a5";
export default node;
