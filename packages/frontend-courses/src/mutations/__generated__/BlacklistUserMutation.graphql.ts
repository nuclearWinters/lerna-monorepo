/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type BlacklistUserInput = {
    user_gid: string;
    clientMutationId?: string | null;
};
export type BlacklistUserMutationVariables = {
    input: BlacklistUserInput;
};
export type BlacklistUserMutationResponse = {
    readonly blacklistUser: {
        readonly validAccessToken: string;
        readonly error: string;
    };
};
export type BlacklistUserMutation = {
    readonly response: BlacklistUserMutationResponse;
    readonly variables: BlacklistUserMutationVariables;
};



/*
mutation BlacklistUserMutation(
  $input: BlacklistUserInput!
) {
  blacklistUser(input: $input) {
    validAccessToken
    error
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
                    "name": "validAccessToken",
                    "storageKey": null
                },
                {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "error",
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
            "name": "BlacklistUserMutation",
            "selections": (v1 /*: any*/),
            "type": "Mutation",
            "abstractKey": null
        },
        "kind": "Request",
        "operation": {
            "argumentDefinitions": (v0 /*: any*/),
            "kind": "Operation",
            "name": "BlacklistUserMutation",
            "selections": (v1 /*: any*/)
        },
        "params": {
            "cacheID": "d48b07f0d2761c36a6af3977b9ba751d",
            "id": null,
            "metadata": {},
            "name": "BlacklistUserMutation",
            "operationKind": "mutation",
            "text": "mutation BlacklistUserMutation(\n  $input: BlacklistUserInput!\n) {\n  blacklistUser(input: $input) {\n    validAccessToken\n    error\n  }\n}\n"
        }
    } as any;
})();
(node as any).hash = '656d3506592c16a35bc4459c4e8f4eef';
export default node;
