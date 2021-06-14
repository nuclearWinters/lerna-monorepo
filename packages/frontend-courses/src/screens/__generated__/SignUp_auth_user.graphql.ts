/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SignUp_auth_user = {
  readonly isBorrower: boolean;
  readonly isSupport: boolean;
  readonly " $refType": "SignUp_auth_user";
};
export type SignUp_auth_user$data = SignUp_auth_user;
export type SignUp_auth_user$key = {
  readonly " $data"?: SignUp_auth_user$data;
  readonly " $fragmentRefs": FragmentRefs<"SignUp_auth_user">;
};

const node: ReaderFragment = {
  argumentDefinitions: [],
  kind: "Fragment",
  metadata: null,
  name: "SignUp_auth_user",
  selections: [
    {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "isBorrower",
      storageKey: null,
    },
    {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "isSupport",
      storageKey: null,
    },
  ],
  type: "AuthUser",
  abstractKey: null,
} as any;
(node as any).hash = "1d286dff059cbefba0fac132a0b08483";
export default node;
