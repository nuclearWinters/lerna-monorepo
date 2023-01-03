/**
 * @generated SignedSource<<ce94858dadbe6a86db5703be64b93fd0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment, RefetchableFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type LoginRow_login$data = {
  readonly address: string;
  readonly applicationName: string;
  readonly id: string;
  readonly time: Int;
  readonly " $fragmentType": "LoginRow_login";
};
export type LoginRow_login$key = {
  readonly " $data"?: LoginRow_login$data;
  readonly " $fragmentSpreads": FragmentRefs<"LoginRow_login">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "refetch": {
      "connection": null,
      "fragmentPathInResult": [
        "node"
      ],
      "operation": require('./LoginRowRefetchQuery.graphql'),
      "identifierField": "id"
    }
  },
  "name": "LoginRow_login",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "applicationName",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "time",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "address",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    }
  ],
  "type": "Login",
  "abstractKey": null
};

(node as any).hash = "a879ca87d379b53b11d9002782cd1452";

export default node;
