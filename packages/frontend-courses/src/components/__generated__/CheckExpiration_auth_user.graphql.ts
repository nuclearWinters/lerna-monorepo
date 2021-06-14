/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CheckExpiration_auth_user = {
  readonly isBorrower: boolean;
  readonly isSupport: boolean;
  readonly " $refType": "CheckExpiration_auth_user";
};
export type CheckExpiration_auth_user$data = CheckExpiration_auth_user;
export type CheckExpiration_auth_user$key = {
  readonly " $data"?: CheckExpiration_auth_user$data;
  readonly " $fragmentRefs": FragmentRefs<"CheckExpiration_auth_user">;
};

const node: ReaderFragment = {
  argumentDefinitions: [],
  kind: "Fragment",
  metadata: null,
  name: "CheckExpiration_auth_user",
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
(node as any).hash = "af5f9f888be7ab93ce0cf3647802e8ad";
export default node;
