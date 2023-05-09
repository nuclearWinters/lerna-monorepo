/**
 * @generated SignedSource<<1d4b3704f5fb27eaaf2ac57b743098a5>>
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
  readonly lastTimeAccessed: Int;
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
      "name": "lastTimeAccessed",
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

(node as any).hash = "3e71dfd52eb56d78a519dd00436b343f";

export default node;
