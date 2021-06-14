/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type LogIn_auth_user = {
  readonly isBorrower: boolean;
  readonly isSupport: boolean;
  readonly " $refType": "LogIn_auth_user";
};
export type LogIn_auth_user$data = LogIn_auth_user;
export type LogIn_auth_user$key = {
  readonly " $data"?: LogIn_auth_user$data;
  readonly " $fragmentRefs": FragmentRefs<"LogIn_auth_user">;
};

const node: ReaderFragment = {
  argumentDefinitions: [],
  kind: "Fragment",
  metadata: null,
  name: "LogIn_auth_user",
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
(node as any).hash = "be0f224dd09b6a17674556fd5f3b9926";
export default node;
