/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Routes_user = {
  readonly id: string;
  readonly name: string;
  readonly apellidoPaterno: string;
  readonly apellidoMaterno: string;
  readonly accountTotal: string;
  readonly accountAvailable: string;
  readonly " $fragmentRefs": FragmentRefs<
    "Profile_user" | "AddFunds_user" | "RetireFunds_user" | "AddLoan_user"
  >;
  readonly " $refType": "Routes_user";
};
export type Routes_user$data = Routes_user;
export type Routes_user$key = {
  readonly " $data"?: Routes_user$data;
  readonly " $fragmentRefs": FragmentRefs<"Routes_user">;
};

const node: ReaderFragment = {
  argumentDefinitions: [],
  kind: "Fragment",
  metadata: null,
  name: "Routes_user",
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
    {
      args: null,
      kind: "FragmentSpread",
      name: "Profile_user",
    },
    {
      args: null,
      kind: "FragmentSpread",
      name: "AddFunds_user",
    },
    {
      args: null,
      kind: "FragmentSpread",
      name: "RetireFunds_user",
    },
    {
      args: null,
      kind: "FragmentSpread",
      name: "AddLoan_user",
    },
  ],
  type: "User",
  abstractKey: null,
} as any;
(node as any).hash = "a15401ebc05d53c758506473f30667ac";
export default node;
