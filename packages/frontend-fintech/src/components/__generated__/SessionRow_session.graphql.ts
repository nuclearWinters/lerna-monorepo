/**
 * @generated SignedSource<<9965b61d46adeb13ce79fd1403ff8d12>>
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
      "identifierInfo": {
        "identifierField": "id",
        "identifierQueryVariableName": "id"
      }
    }
  },
  "name": "SessionRow_session",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
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
      "name": "address",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "lastTimeAccessed",
      "storageKey": null
    }
  ],
  "type": "Session",
  "abstractKey": null
};

(node as any).hash = "64ad97c9244ed031a7b448a815094adb";

export default node;
