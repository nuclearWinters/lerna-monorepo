/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Routes_user = {
  readonly name: string;
  readonly apellidoPaterno: string;
  readonly apellidoMaterno: string;
  readonly accountTotal: number;
  readonly accountAvailable: number;
  readonly " $fragmentRefs": FragmentRefs<"GeneralData_user">;
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
      name: "GeneralData_user",
    },
  ],
  type: "User",
  abstractKey: null,
} as any;
(node as any).hash = "3a5603542265d9b290313cf6013f891b";
export default node;