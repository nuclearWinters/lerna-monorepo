/**
 * @generated SignedSource<<61bccab7c354bff048fa9a53afabf181>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CheckExpiration_auth_user$data = {
  readonly isBorrower: boolean;
  readonly isSupport: boolean;
  readonly " $fragmentType": "CheckExpiration_auth_user";
};
export type CheckExpiration_auth_user = CheckExpiration_auth_user$data;
export type CheckExpiration_auth_user$key = {
  readonly " $data"?: CheckExpiration_auth_user$data;
  readonly " $fragmentSpreads": FragmentRefs<"CheckExpiration_auth_user">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "CheckExpiration_auth_user",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isBorrower",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isSupport",
      "storageKey": null
    }
  ],
  "type": "AuthUser",
  "abstractKey": null
};

(node as any).hash = "af5f9f888be7ab93ce0cf3647802e8ad";

export default node;
