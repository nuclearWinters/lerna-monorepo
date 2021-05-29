/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Profile_user = {
    readonly id: string;
    readonly name: string;
    readonly apellidoPaterno: string;
    readonly apellidoMaterno: string;
    readonly RFC: string;
    readonly CURP: string;
    readonly clabe: string;
    readonly mobile: string;
    readonly accountTotal: string;
    readonly accountAvailable: string;
    readonly " $refType": "Profile_user";
};
export type Profile_user$data = Profile_user;
export type Profile_user$key = {
    readonly " $data"?: Profile_user$data;
    readonly " $fragmentRefs": FragmentRefs<"Profile_user">;
};



const node: ReaderFragment = {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "Profile_user",
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
            "name": "name",
            "storageKey": null
        },
        {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "apellidoPaterno",
            "storageKey": null
        },
        {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "apellidoMaterno",
            "storageKey": null
        },
        {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "RFC",
            "storageKey": null
        },
        {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "CURP",
            "storageKey": null
        },
        {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "clabe",
            "storageKey": null
        },
        {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "mobile",
            "storageKey": null
        },
        {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "accountTotal",
            "storageKey": null
        },
        {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "accountAvailable",
            "storageKey": null
        }
    ],
    "type": "User",
    "abstractKey": null
} as any;
(node as any).hash = 'b71da76a98e434467fadec39c613036f';
export default node;
