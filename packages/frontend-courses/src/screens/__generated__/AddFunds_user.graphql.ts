/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AddFunds_user = {
  readonly id: string;
  readonly " $refType": "AddFunds_user";
};
export type AddFunds_user$data = AddFunds_user;
export type AddFunds_user$key = {
  readonly " $data"?: AddFunds_user$data;
  readonly " $fragmentRefs": FragmentRefs<"AddFunds_user">;
};

const node: ReaderFragment = {
  argumentDefinitions: [],
  kind: "Fragment",
  metadata: null,
  name: "AddFunds_user",
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
(node as any).hash = "29fe39a8c3737ed57a71de59ab5b53cc";
export default node;
