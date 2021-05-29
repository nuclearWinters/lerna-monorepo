/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AddLoan_user = {
    readonly id: string;
    readonly " $refType": "AddLoan_user";
};
export type AddLoan_user$data = AddLoan_user;
export type AddLoan_user$key = {
    readonly " $data"?: AddLoan_user$data;
    readonly " $fragmentRefs": FragmentRefs<"AddLoan_user">;
};



const node: ReaderFragment = {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AddLoan_user",
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
(node as any).hash = '2d1cbc45c30f5a531698f4be303084a6';
export default node;
