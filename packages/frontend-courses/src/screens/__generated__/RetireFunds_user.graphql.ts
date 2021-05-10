/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type RetireFunds_user = {
  readonly id: string;
  readonly " $refType": "RetireFunds_user";
};
export type RetireFunds_user$data = RetireFunds_user;
export type RetireFunds_user$key = {
  readonly " $data"?: RetireFunds_user$data;
  readonly " $fragmentRefs": FragmentRefs<"RetireFunds_user">;
};

const node: ReaderFragment = {
  argumentDefinitions: [],
  kind: "Fragment",
  metadata: null,
  name: "RetireFunds_user",
  selections: [
    {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "id",
      storageKey: null,
    },
  ],
  type: "User",
  abstractKey: null,
} as any;
(node as any).hash = "87bead93c556c7b81e8309b608ee05f2";
export default node;
