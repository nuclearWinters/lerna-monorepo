/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type BlacklistUserInput = {
    user_gid: string;
    clientMutationId?: string | null;
};
export type SettingsBlacklistUserMutationVariables = {
    input: BlacklistUserInput;
};
export type SettingsBlacklistUserMutationResponse = {
    readonly blacklistUser: {
        readonly error: string;
        readonly validAccessToken: string;
    };
};
export type SettingsBlacklistUserMutation = {
    readonly response: SettingsBlacklistUserMutationResponse;
    readonly variables: SettingsBlacklistUserMutationVariables;
};



/*
mutation SettingsBlacklistUserMutation(
  $input: BlacklistUserInput!
) {
  blacklistUser(input: $input) {
    error
    validAccessToken
  }
}
*/

const node: ConcreteRequest = (function () {
    var v0 = [
        {
            "defaultValue": null,
            "kind": "LocalArgument",
            "name": "input"
        } as any
    ], v1 = [
        {
            "alias": null,
            "args": [
                {
                    "kind": "Variable",
                    "name": "input",
                    "variableName": "input"
                }
            ],
            "concreteType": "BlacklistUserPayload",
            "kind": "LinkedField",
            "name": "blacklistUser",
            "plural": false,
            "selections": [
                {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "error",
                    "storageKey": null
                },
                {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "validAccessToken",
                    "storageKey": null
                }
            ],
            "storageKey": null
        } as any
    ];
    return {
        "fragment": {
            "argumentDefinitions": (v0 /*: any*/),
            "kind": "Fragment",
            "metadata": null,
            "name": "SettingsBlacklistUserMutation",
            "selections": (v1 /*: any*/),
            "type": "Mutation",
            "abstractKey": null
        },
        "kind": "Request",
        "operation": {
            "argumentDefinitions": (v0 /*: any*/),
            "kind": "Operation",
            "name": "SettingsBlacklistUserMutation",
            "selections": (v1 /*: any*/)
        },
        "params": {
            "cacheID": "5e4fb7bc07a201aaa07384d376d910bb",
            "id": null,
            "metadata": {},
            "name": "SettingsBlacklistUserMutation",
            "operationKind": "mutation",
            "text": "mutation SettingsBlacklistUserMutation(\n  $input: BlacklistUserInput!\n) {\n  blacklistUser(input: $input) {\n    error\n    validAccessToken\n  }\n}\n"
        }
    } as any;
})();
(node as any).hash = '1fcdfed34f4ef9d1502b391155b4ff05';
export default node;
