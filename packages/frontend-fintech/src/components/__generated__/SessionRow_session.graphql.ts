/**
 * @generated SignedSource<<43c16ad9a2d1d1c4f18f224155734738>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment, RefetchableFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type SessionRow_session$data = {
  readonly address: string;
  readonly applicationName: string;
  readonly deviceName: string;
  readonly id: string;
  readonly lasTimeAccessed: Int;
  readonly sessionId: string;
  readonly type: string;
  readonly " $fragmentType": "SessionRow_session";
};
export type SessionRow_session$key = {
  readonly " $data"?: SessionRow_session$data;
  readonly " $fragmentSpreads": FragmentRefs<"SessionRow_session">;
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
      "operation": require('./SessionRowRefetchQuery.graphql'),
      "identifierField": "id"
    }
  },
  "name": "SessionRow_session",
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
      "name": "type",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "deviceName",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "sessionId",
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
      "name": "lasTimeAccessed",
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
  "type": "Session",
  "abstractKey": null
};

(node as any).hash = "3efd23a18301dc418b2a41ad4c1d266d";

export default node;
