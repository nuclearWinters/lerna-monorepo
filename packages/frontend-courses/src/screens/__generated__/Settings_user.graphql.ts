/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Settings_user = {
    readonly id: string;
    readonly " $refType": "Settings_user";
};
export type Settings_user$data = Settings_user;
export type Settings_user$key = {
    readonly " $data"?: Settings_user$data;
    readonly " $fragmentRefs": FragmentRefs<"Settings_user">;
};



const node: ReaderFragment = {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "Settings_user",
    "selections": [
        {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
        }
    ],
    "type": "User",
    "abstractKey": null
} as any;
(node as any).hash = '18c40d33cf777c614737da9600893e71';
export default node;
